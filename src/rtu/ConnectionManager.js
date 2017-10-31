import ReconnectingWebSocket from '../vendor/reconnecting-websocket/reconnecting-websocket'

const ws = new ReconnectingWebSocket('wss://api.cirrus-ci.org/ws');

const topicSubscriptions = {};

ws.onopen = function open() {
  Object.keys(topicSubscriptions).forEach(function(topic) {
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
  let subscription = topicSubscriptions[topic];
  if (subscription) {
    subscription(data)
  }
};

export function subscribe(topic, handler) {
  topicSubscriptions[topic] = handler;
  sendSubscribe(topic);
}

function sendSubscribe(topic) {
  console.log('subscribing from ' + topic);
  ws.send(JSON.stringify({
    type: 'subscribe',
    topic: topic
  }))
}

export function unsubscribe(topic) {
  console.log('unsubscribing from ' + topic);
  delete topicSubscriptions[topic];
  sendUnsubscribe(topic);
}


function sendUnsubscribe(topic) {
  ws.send(JSON.stringify({
    type: 'unsubscribe',
    topic: topic
  }))
}

export function taskUpdateTopic(taskId) {
  return "task-update-" + taskId;
}
