// package:
// file: terminal.proto

var terminal_pb = require('./terminal_pb');
var grpc = require('@improbable-eng/grpc-web').grpc;

var GuestService = (function () {
  function GuestService() {}
  GuestService.serviceName = 'GuestService';
  return GuestService;
})();

GuestService.TerminalChannel = {
  methodName: 'TerminalChannel',
  service: GuestService,
  requestStream: true,
  responseStream: true,
  requestType: terminal_pb.GuestTerminalRequest,
  responseType: terminal_pb.GuestTerminalResponse,
};

exports.GuestService = GuestService;

function GuestServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

GuestServiceClient.prototype.terminalChannel = function terminalChannel(metadata) {
  var listeners = {
    data: [],
    end: [],
    status: [],
  };
  var client = grpc.client(GuestService.TerminalChannel, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  client.onMessage(function (message) {
    listeners.data.forEach(function (handler) {
      handler(message);
    });
  });
  client.start(metadata);
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    },
  };
};

exports.GuestServiceClient = GuestServiceClient;

var HostService = (function () {
  function HostService() {}
  HostService.serviceName = 'HostService';
  return HostService;
})();

HostService.ControlChannel = {
  methodName: 'ControlChannel',
  service: HostService,
  requestStream: true,
  responseStream: true,
  requestType: terminal_pb.HostControlRequest,
  responseType: terminal_pb.HostControlResponse,
};

HostService.DataChannel = {
  methodName: 'DataChannel',
  service: HostService,
  requestStream: true,
  responseStream: true,
  requestType: terminal_pb.HostDataRequest,
  responseType: terminal_pb.HostDataResponse,
};

exports.HostService = HostService;

function HostServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

HostServiceClient.prototype.controlChannel = function controlChannel(metadata) {
  var listeners = {
    data: [],
    end: [],
    status: [],
  };
  var client = grpc.client(HostService.ControlChannel, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  client.onMessage(function (message) {
    listeners.data.forEach(function (handler) {
      handler(message);
    });
  });
  client.start(metadata);
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    },
  };
};

HostServiceClient.prototype.dataChannel = function dataChannel(metadata) {
  var listeners = {
    data: [],
    end: [],
    status: [],
  };
  var client = grpc.client(HostService.DataChannel, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  client.onMessage(function (message) {
    listeners.data.forEach(function (handler) {
      handler(message);
    });
  });
  client.start(metadata);
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    },
  };
};

exports.HostServiceClient = HostServiceClient;
