export class HandlersManager {
  constructor() {
    this.subscriptionRequests = {}
  }

  allRequests() {
    return Object.keys(this.subscriptionRequests)
  }

  handleNewUpdate(topic, data) {
    let topicHandlers = this.subscriptionRequests[topic];
    if (topicHandlers) {
      topicHandlers.callAllHandlers(data)
    }
  }

  addRequestHandler(request, handler) {
    let handlers = this.subscriptionRequests[request];
    if (handlers === undefined) {
      handlers = this.subscriptionRequests[request] = new RequestHandlers();
    }
    return handlers.addHandler(handler)
  }
}

class RequestHandlers {
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
