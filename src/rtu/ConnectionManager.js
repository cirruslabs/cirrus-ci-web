import ReconnectingWebSocket from '../vendor/reconnecting-websocket/reconnecting-websocket'
import {HandlersManager} from "./HandlersManager";

const ws = new ReconnectingWebSocket('wss://api.cirrus-ci.org/ws');

const handlersManager = new HandlersManager();

ws.onopen = function open() {
  handlersManager.allRequests().forEach(function (request) {
    ws.send(request);
  });
};

ws.onerror = function error(err) {
  console.log(err);
};

ws.onclose = function close() {
  console.log('disconnected', Date.now());
};

ws.onmessage = function incoming(event) {
  let message = JSON.parse(event.data);
  let data = message.data || {};
  let topic = message.topic || '';
  console.log("New message from " + topic);
  handlersManager.handleNewUpdate(topic, data);
};

export function subscribeObjectUpdates(kind, id, handler) {
  let request = JSON.stringify({
    type: 'subscribe',
    kind: kind,
    id: id,
  });
  ws.send(request);
  let topic = kind + '-update-'+id;
  return handlersManager.addTopicHandler(topic.toLowerCase(), handler)
}

export function subscribeTaskCommandLogs(taskId, command, handler) {
  let request = JSON.stringify({
    type: 'logs',
    taskId: taskId,
    command: command,
  });
  ws.send(request);
  let topic = 'task-log-' + taskId + '-' + command;
  return handlersManager.addTopicHandler(topic, handler)
}
