export class HandlersManager {
  topicHandlers;
  topicRequests;

  constructor() {
    this.topicHandlers = {};
    this.topicRequests = {};
  }

  allRequests() {
    return Object.values(this.topicRequests);
  }

  allTopics() {
    return Object.keys(this.topicRequests);
  }

  handleNewUpdate(topic, data) {
    let topicHandlers = this.topicHandlers[topic];
    if (topicHandlers) {
      topicHandlers.callAllHandlers(data);
    }
  }

  addTopicHandler(topic, request, handler) {
    let handlers = this.topicHandlers[topic];
    if (handlers === undefined) {
      handlers = this.topicHandlers[topic] = new TopicHandlers();
    }
    this.topicRequests[topic] = request;
    let handlerClosable = handlers.addHandler(handler);
    return () => {
      handlerClosable();
      if (this.topicHandlers[topic] && this.topicHandlers[topic].isEmpty()) {
        delete this.topicHandlers[topic];
      }
    };
  }
}

class TopicHandlers {
  handlersMap;
  idGenerator;

  constructor() {
    this.handlersMap = {};
    this.idGenerator = 0;
  }

  isEmpty() {
    return Object.keys(this.handlersMap).length === 0;
  }

  callAllHandlers(data) {
    Object.keys(this.handlersMap).forEach(key => {
      try {
        this.handlersMap[key](data);
      } catch (e) {
        console.log(e);
      }
    });
  }

  addHandler(handler) {
    let handlerId = ++this.idGenerator;
    this.handlersMap[handlerId] = handler;
    return () => delete this.handlersMap[handlerId];
  }
}
