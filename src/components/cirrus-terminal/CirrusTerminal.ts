import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { grpc } from '@improbable-eng/grpc-web';
import { BidirectionalStream, GuestServiceClient } from './api/terminal_pb_service';
import { Data, GuestTerminalRequest, GuestTerminalResponse, TerminalDimensions } from './api/terminal_pb';
import '../../../node_modules/xterm/css/xterm.css';

enum CirrusTerminalState {
  Connecting = 1,
  Connected = 2,
}

export class CirrusTerminal {
  state: CirrusTerminalState;
  term: Terminal;
  terminalChannel: BidirectionalStream<GuestTerminalRequest, GuestTerminalResponse>;

  constructor(attachTo: HTMLElement) {
    // Instantiate a new Xterm.js terminal and attach it
    // to the element provided by the user
    this.term = new Terminal();
    this.term.open(attachTo);

    // Resize terminal to fit it's containing element
    const fitAddon = new FitAddon();
    this.term.loadAddon(fitAddon);
    fitAddon.fit();

    this.state = CirrusTerminalState.Connecting;
  }

  dispose() {
    if (this.term !== undefined) this.term.dispose();
    if (this.terminalChannel !== undefined) this.terminalChannel.cancel();
  }

  connect(connectTo: string, locator: string, secret: string) {
    // Configure gRPC-Web to use WebSocket transport,
    // otherwise bidirectional streaming wouldn't work
    grpc.setDefaultTransport(grpc.WebsocketTransport());

    // Request a new channel on the terminal server
    const frontendService = new GuestServiceClient(connectTo);
    this.terminalChannel = frontendService.terminalChannel();

    // Do I/O
    this.terminalChannel.on('data', message => {
      if (this.state !== CirrusTerminalState.Connected) {
        this.state = CirrusTerminalState.Connecting;
        return;
      }

      if (message.hasOutput()) {
        const data = message.getOutput().getData();
        this.term.write(data);
      }
    });
    this.terminalChannel.on('end', newStatus => {
      this.state = CirrusTerminalState.Connecting;
    });

    const requestedDimensions = new TerminalDimensions();
    requestedDimensions.setWidthColumns(this.term.cols);
    requestedDimensions.setHeightRows(this.term.rows);

    const request = new GuestTerminalRequest();
    const hello = new GuestTerminalRequest.Hello();
    hello.setLocator(locator);
    hello.setSecret(secret);
    hello.setRequestedDimensions(requestedDimensions);
    request.setHello(hello);
    this.terminalChannel.write(request);

    this.state = CirrusTerminalState.Connected;

    this.term.onData(userInput => {
      const data = new Data();
      data.setData(new TextEncoder().encode(userInput));

      const request = new GuestTerminalRequest();
      request.setInput(data);
      this.terminalChannel.write(request);
    });
  }
}
