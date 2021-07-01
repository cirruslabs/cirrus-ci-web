// package:
// file: terminal.proto

import * as terminal_pb from './terminal_pb';
import { grpc } from '@improbable-eng/grpc-web';

type GuestServiceTerminalChannel = {
  readonly methodName: string;
  readonly service: typeof GuestService;
  readonly requestStream: true;
  readonly responseStream: true;
  readonly requestType: typeof terminal_pb.GuestTerminalRequest;
  readonly responseType: typeof terminal_pb.GuestTerminalResponse;
};

export class GuestService {
  static readonly serviceName: string;
  static readonly TerminalChannel: GuestServiceTerminalChannel;
}

type HostServiceControlChannel = {
  readonly methodName: string;
  readonly service: typeof HostService;
  readonly requestStream: true;
  readonly responseStream: true;
  readonly requestType: typeof terminal_pb.HostControlRequest;
  readonly responseType: typeof terminal_pb.HostControlResponse;
};

type HostServiceDataChannel = {
  readonly methodName: string;
  readonly service: typeof HostService;
  readonly requestStream: true;
  readonly responseStream: true;
  readonly requestType: typeof terminal_pb.HostDataRequest;
  readonly responseType: typeof terminal_pb.HostDataResponse;
};

export class HostService {
  static readonly serviceName: string;
  static readonly ControlChannel: HostServiceControlChannel;
  static readonly DataChannel: HostServiceDataChannel;
}

export type ServiceError = { message: string; code: number; metadata: grpc.Metadata };
export type Status = { details: string; code: number; metadata: grpc.Metadata };

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class GuestServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  terminalChannel(
    metadata?: grpc.Metadata,
  ): BidirectionalStream<terminal_pb.GuestTerminalRequest, terminal_pb.GuestTerminalResponse>;
}

export class HostServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  controlChannel(
    metadata?: grpc.Metadata,
  ): BidirectionalStream<terminal_pb.HostControlRequest, terminal_pb.HostControlResponse>;
  dataChannel(metadata?: grpc.Metadata): BidirectionalStream<terminal_pb.HostDataRequest, terminal_pb.HostDataResponse>;
}
