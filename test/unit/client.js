class Client{
  constructor() {
    this.topicQueues = {
      topic1: [1,2,3]
    }
    this.listeners = {}
  }

  /**
   * type = connect message error
   */
  on(type, cb) {
    if(type === 'connect') return cb();
    if(type === 'error') return cb('error');

    this.listeners[type] = cb
  }

  /**
   * if subscribe, this topic message will be push to this client
   */
  subscribe(topic) {
    this.topicQueues[topic] = []
  }

  publish(topic, payload) {
    const queue = this.topicQueues[topic]
    if(!queue) return;

    this.listeners.message && this.listeners.message(topic, payload)
  }
}

module.exports = Client