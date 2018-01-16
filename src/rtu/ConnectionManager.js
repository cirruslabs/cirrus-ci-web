import ReconnectingWebSocket from '../vendor/reconnecting-websocket/reconnecting-websocket'
import {HandlersManager} from "./HandlersManager";

const ws = new ReconnectingWebSocket('wss://api.cirrus-ci.com/ws');

const handlersManager = new HandlersManager();

ws.onopen = function open() {
  let allTopicSubscribeRequests = handlersManager.allRequests();
  allTopicSubscribeRequests.forEach(function (request) {
    ws.send(request);
  });
  if (process.env.NODE_ENV === 'development') {
    console.log("Subscribing to " + allTopicSubscribeRequests.length + " topics!");
  }
};

ws.onerror = function error(err) {
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }
};

ws.onclose = function close() {
  if (process.env.NODE_ENV === 'development') {
    console.log('disconnected', Date.now());
  }
};

ws.onmessage = function incoming(event) {
  let message = JSON.parse(event.data);
  let data = message.data || {};
  let topic = message.topic || '';
  handlersManager.handleNewUpdate(topic, data);
};

export function subscribeObjectUpdates(kind, id, handler) {
  let request = {
    type: 'subscribe',
    kind: kind,
    id: id,
  };
  let requestStr = JSON.stringify(request);
  ws.send(requestStr);
  let topic = kind + '-update-' + id;
  let topicHandlerDispose = handlersManager.addTopicHandler(topic.toLowerCase().replace("_", "-"), requestStr, handler);
  return () => {
    topicHandlerDispose();
    request.type = "unsubscribe";
    ws.send(JSON.stringify(request));
  }
}

export function subscribeTaskCommandLogs(taskId, command, handler) {
  let request = JSON.stringify({
    type: 'logs',
    taskId: taskId,
    command: command,
  });
  ws.send(request);
  let topic = 'task-log-' + taskId + '-' + command;
  return handlersManager.addTopicHandler(topic, request, handler)
}
