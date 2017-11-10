export class HandlersManager {
  constructor() {
    this.topicHandlers = {}
  }

  allRequests() {
    return Object.keys(this.topicHandlers)
  }

  handleNewUpdate(topic, data) {
    let topicHandlers = this.topicHandlers[topic];
    if (topicHandlers) {
      topicHandlers.callAllHandlers(data)
    }
  }

  addTopicHandler(topic, handler) {
    let handlers = this.topicHandlers[topic];
    if (handlers === undefined) {
      handlers = this.topicHandlers[topic] = new TopicHandlers();
    }
    return handlers.addHandler(handler)
  }
}

class TopicHandlers {
  constructor() {
    this.handlersMap = {};
    this.idGenerator = 0;
  }

  callAllHandlers(data) {
    Object.keys(this.handlersMap).forEach((key) => {
      try {
        this.handlersMap[key](data);
      } catch (e) {
        console.log(e)
      }
    })
  }

  addHandler(handler) {
    let handlerId = ++this.idGenerator;
    this.handlersMap[handlerId] = handler;
    return () => { delete this.handlersMap[handlerId] }
  }
}
