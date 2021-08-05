// package:
// file: terminal.proto

import * as jspb from 'google-protobuf';

export class GuestTerminalRequest extends jspb.Message {
  hasHello(): boolean;
  clearHello(): void;
  getHello(): GuestTerminalRequest.Hello | undefined;
  setHello(value?: GuestTerminalRequest.Hello): void;

  hasChangeDimensions(): boolean;
  clearChangeDimensions(): void;
  getChangeDimensions(): TerminalDimensions | undefined;
  setChangeDimensions(value?: TerminalDimensions): void;

  hasInput(): boolean;
  clearInput(): void;
  getInput(): Data | undefined;
  setInput(value?: Data): void;

  getOperationCase(): GuestTerminalRequest.OperationCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GuestTerminalRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GuestTerminalRequest): GuestTerminalRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GuestTerminalRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GuestTerminalRequest;
  static deserializeBinaryFromReader(message: GuestTerminalRequest, reader: jspb.BinaryReader): GuestTerminalRequest;
}

export namespace GuestTerminalRequest {
  export type AsObject = {
    hello?: GuestTerminalRequest.Hello.AsObject;
    changeDimensions?: TerminalDimensions.AsObject;
    input?: Data.AsObject;
  };

  export class Hello extends jspb.Message {
    getLocator(): string;
    setLocator(value: string): void;

    getSecret(): string;
    setSecret(value: string): void;

    hasRequestedDimensions(): boolean;
    clearRequestedDimensions(): void;
    getRequestedDimensions(): TerminalDimensions | undefined;
    setRequestedDimensions(value?: TerminalDimensions): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Hello.AsObject;
    static toObject(includeInstance: boolean, msg: Hello): Hello.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: Hello, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Hello;
    static deserializeBinaryFromReader(message: Hello, reader: jspb.BinaryReader): Hello;
  }

  export namespace Hello {
    export type AsObject = {
      locator: string;
      secret: string;
      requestedDimensions?: TerminalDimensions.AsObject;
    };
  }

  export enum OperationCase {
    OPERATION_NOT_SET = 0,
    HELLO = 1,
    CHANGE_DIMENSIONS = 2,
    INPUT = 3,
  }
}

export class GuestTerminalResponse extends jspb.Message {
  hasOutput(): boolean;
  clearOutput(): void;
  getOutput(): Data | undefined;
  setOutput(value?: Data): void;

  getOperationCase(): GuestTerminalResponse.OperationCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GuestTerminalResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GuestTerminalResponse): GuestTerminalResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: GuestTerminalResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GuestTerminalResponse;
  static deserializeBinaryFromReader(message: GuestTerminalResponse, reader: jspb.BinaryReader): GuestTerminalResponse;
}

export namespace GuestTerminalResponse {
  export type AsObject = {
    output?: Data.AsObject;
  };

  export enum OperationCase {
    OPERATION_NOT_SET = 0,
    OUTPUT = 1,
  }
}

export class HostControlRequest extends jspb.Message {
  hasHello(): boolean;
  clearHello(): void;
  getHello(): HostControlRequest.Hello | undefined;
  setHello(value?: HostControlRequest.Hello): void;

  getOperationCase(): HostControlRequest.OperationCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HostControlRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HostControlRequest): HostControlRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: HostControlRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HostControlRequest;
  static deserializeBinaryFromReader(message: HostControlRequest, reader: jspb.BinaryReader): HostControlRequest;
}

export namespace HostControlRequest {
  export type AsObject = {
    hello?: HostControlRequest.Hello.AsObject;
  };

  export class Hello extends jspb.Message {
    getTrustedSecret(): string;
    setTrustedSecret(value: string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Hello.AsObject;
    static toObject(includeInstance: boolean, msg: Hello): Hello.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: Hello, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Hello;
    static deserializeBinaryFromReader(message: Hello, reader: jspb.BinaryReader): Hello;
  }

  export namespace Hello {
    export type AsObject = {
      trustedSecret: string;
    };
  }

  export enum OperationCase {
    OPERATION_NOT_SET = 0,
    HELLO = 1,
  }
}

export class HostControlResponse extends jspb.Message {
  hasHello(): boolean;
  clearHello(): void;
  getHello(): HostControlResponse.Hello | undefined;
  setHello(value?: HostControlResponse.Hello): void;

  hasDataChannelRequest(): boolean;
  clearDataChannelRequest(): void;
  getDataChannelRequest(): HostControlResponse.DataChannelRequest | undefined;
  setDataChannelRequest(value?: HostControlResponse.DataChannelRequest): void;

  getOperationCase(): HostControlResponse.OperationCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HostControlResponse.AsObject;
  static toObject(includeInstance: boolean, msg: HostControlResponse): HostControlResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: HostControlResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HostControlResponse;
  static deserializeBinaryFromReader(message: HostControlResponse, reader: jspb.BinaryReader): HostControlResponse;
}

export namespace HostControlResponse {
  export type AsObject = {
    hello?: HostControlResponse.Hello.AsObject;
    dataChannelRequest?: HostControlResponse.DataChannelRequest.AsObject;
  };

  export class Hello extends jspb.Message {
    getLocator(): string;
    setLocator(value: string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Hello.AsObject;
    static toObject(includeInstance: boolean, msg: Hello): Hello.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: Hello, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Hello;
    static deserializeBinaryFromReader(message: Hello, reader: jspb.BinaryReader): Hello;
  }

  export namespace Hello {
    export type AsObject = {
      locator: string;
    };
  }

  export class DataChannelRequest extends jspb.Message {
    getToken(): string;
    setToken(value: string): void;

    hasRequestedDimensions(): boolean;
    clearRequestedDimensions(): void;
    getRequestedDimensions(): TerminalDimensions | undefined;
    setRequestedDimensions(value?: TerminalDimensions): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DataChannelRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DataChannelRequest): DataChannelRequest.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: DataChannelRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DataChannelRequest;
    static deserializeBinaryFromReader(message: DataChannelRequest, reader: jspb.BinaryReader): DataChannelRequest;
  }

  export namespace DataChannelRequest {
    export type AsObject = {
      token: string;
      requestedDimensions?: TerminalDimensions.AsObject;
    };
  }

  export enum OperationCase {
    OPERATION_NOT_SET = 0,
    HELLO = 1,
    DATA_CHANNEL_REQUEST = 2,
  }
}

export class HostDataRequest extends jspb.Message {
  hasHello(): boolean;
  clearHello(): void;
  getHello(): HostDataRequest.Hello | undefined;
  setHello(value?: HostDataRequest.Hello): void;

  hasOutput(): boolean;
  clearOutput(): void;
  getOutput(): Data | undefined;
  setOutput(value?: Data): void;

  getOperationCase(): HostDataRequest.OperationCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HostDataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HostDataRequest): HostDataRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: HostDataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HostDataRequest;
  static deserializeBinaryFromReader(message: HostDataRequest, reader: jspb.BinaryReader): HostDataRequest;
}

export namespace HostDataRequest {
  export type AsObject = {
    hello?: HostDataRequest.Hello.AsObject;
    output?: Data.AsObject;
  };

  export class Hello extends jspb.Message {
    getLocator(): string;
    setLocator(value: string): void;

    getToken(): string;
    setToken(value: string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Hello.AsObject;
    static toObject(includeInstance: boolean, msg: Hello): Hello.AsObject;
    static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
    static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
    static serializeBinaryToWriter(message: Hello, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Hello;
    static deserializeBinaryFromReader(message: Hello, reader: jspb.BinaryReader): Hello;
  }

  export namespace Hello {
    export type AsObject = {
      locator: string;
      token: string;
    };
  }

  export enum OperationCase {
    OPERATION_NOT_SET = 0,
    HELLO = 1,
    OUTPUT = 2,
  }
}

export class HostDataResponse extends jspb.Message {
  hasChangeDimensions(): boolean;
  clearChangeDimensions(): void;
  getChangeDimensions(): TerminalDimensions | undefined;
  setChangeDimensions(value?: TerminalDimensions): void;

  hasInput(): boolean;
  clearInput(): void;
  getInput(): Data | undefined;
  setInput(value?: Data): void;

  getOperationCase(): HostDataResponse.OperationCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HostDataResponse.AsObject;
  static toObject(includeInstance: boolean, msg: HostDataResponse): HostDataResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: HostDataResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HostDataResponse;
  static deserializeBinaryFromReader(message: HostDataResponse, reader: jspb.BinaryReader): HostDataResponse;
}

export namespace HostDataResponse {
  export type AsObject = {
    changeDimensions?: TerminalDimensions.AsObject;
    input?: Data.AsObject;
  };

  export enum OperationCase {
    OPERATION_NOT_SET = 0,
    CHANGE_DIMENSIONS = 1,
    INPUT = 2,
  }
}

export class TerminalDimensions extends jspb.Message {
  getWidthColumns(): number;
  setWidthColumns(value: number): void;

  getHeightRows(): number;
  setHeightRows(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TerminalDimensions.AsObject;
  static toObject(includeInstance: boolean, msg: TerminalDimensions): TerminalDimensions.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: TerminalDimensions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TerminalDimensions;
  static deserializeBinaryFromReader(message: TerminalDimensions, reader: jspb.BinaryReader): TerminalDimensions;
}

export namespace TerminalDimensions {
  export type AsObject = {
    widthColumns: number;
    heightRows: number;
  };
}

export class Data extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Data.AsObject;
  static toObject(includeInstance: boolean, msg: Data): Data.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Data, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Data;
  static deserializeBinaryFromReader(message: Data, reader: jspb.BinaryReader): Data;
}

export namespace Data {
  export type AsObject = {
    data: Uint8Array | string;
  };
}

export class Error extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Error.AsObject;
  static toObject(includeInstance: boolean, msg: Error): Error.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: { [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message> };
  static serializeBinaryToWriter(message: Error, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Error;
  static deserializeBinaryFromReader(message: Error, reader: jspb.BinaryReader): Error;
}

export namespace Error {
  export type AsObject = {
    message: string;
  };
}
