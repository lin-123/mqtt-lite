// todo: 封装mqtt  暴露一个register方法，接收两个参数：topic listener
const {connect} = require('mqtt')
const Log = require('./log')
class MqttLite {
  constructor(conn, option = {}) {
    let clientResolve
    this.clientPromise = new window.Promise(resolve => clientResolve = resolve)
    this.topicDistribute = {}
    this.log = new Log(option.debug)
    delete option.debug

    const client = connect(conn, option)
    client.on('connect', (msg) => {
      this.log.info('mqtt connect success!')
      clientResolve(client)
    })

    client.on('message', (topic, payload) => {
      const payloadStr = payload.toString()
      this.log.info(`revice message: topic=${topic} payload=${payloadStr}`)
      const msgHandler = this.topicDistribute[topic]
      if(!msgHandler) return;
      try{
        msgHandler(JSON.parse(payloadStr))
      }catch(e) {
        this.log.error('payload json parse error: ', e)
        msgHandler(payloadStr)
      }
    })
  }

  async error(msgHandler) {
    this.log.info(`subscribe error`)
    const client = await this.clientPromise
    client.on('error', () => {
      this.log.error(arguments)
      msgHandler(arguments)
    })
  }

  // 注册topic
  async subscribe(topic, msgHandler){
    this.log.info(`subscribe topic: topic=${topic}`)
    const client = await this.clientPromise
    client.subscribe(topic)
    this.topicDistribute[topic] = msgHandler
  }

  async publish(topic, payload){
    this.log.info(`publish message: topic=${topic} payload=${payload}`)
    const client = await this.clientPromise
    client.publish(topic, JSON.stringify(payload))
  }
}

module.exports = MqttLite