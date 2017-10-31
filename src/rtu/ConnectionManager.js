import ReconnectingWebSocket from '../vendor/reconnecting-websocket/reconnecting-websocket'
import {HandlersManager} from "./HandlersManager";

const ws = new ReconnectingWebSocket('wss://api.cirrus-ci.org/ws');

const handlersManager = new HandlersManager();

ws.onopen = function open() {
  handlersManager.allTopics().forEach(function(topic) {
    console.log('re-connecting to ' + topic);
    sendSubscribe(topic);
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
  handlersManager.handleNewUpdate(topic, data);
};

export function subscribe(topic, handler) {
  let closable = handlersManager.addTopicHandler(topic, handler);
  sendSubscribe(topic);
  return closable
}

function sendSubscribe(topic) {
  ws.send(JSON.stringify({
    type: 'subscribe',
    topic: topic
  }))
}

export function taskUpdateTopic(taskId) {
  return "task-update-" + taskId;
}
