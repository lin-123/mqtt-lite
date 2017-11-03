// todo: 封装mqtt  暴露一个register方法，接收两个参数：topic listener
const {connect} = require('mqtt')
const Log = require('./log')
class MqttLite {

  /**
   * mqtt-lite
   * @param  {String} conn   [mqtt websocket地址]
   * @param  {Object} option [配置信息， 见https://github.com/mqttjs/MQTT.js#connect]
   * @param  {Boolean=}   option.debug [可选项。 是否开启debug模式]
   */
  constructor(conn, option = {}) {
    if(!conn) return this.log.error('invalid connection url')

    let clientResolve
    this.clientPromise = new window.Promise(resolve => clientResolve = resolve)
    this.topicDistribute = {}
    let opt = Object.assign({}, option)
    this.log = new Log(opt.debug)
    delete opt.debug
    const client = connect(conn, opt)
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

  /**
   * @param {Function} msgHandler [callback when mqtt connection revcive error message]
   */
  async error(msgHandler) {
    const client = await this.clientPromise
    client.on('error', () => {
      this.log.error(arguments)
      msgHandler(arguments)
    })
  }

  /**
   * @param {Sting} topic
   * @param {Function} msgHandler [callback when this topic revice message]
   */
  async subscribe(topic, msgHandler){
    if(!topic || typeof msgHandler !== 'function')
      return this.log.error(`subscribe: invalid params`);

    this.log.info(`subscribe topic: topic=${topic}`)
    const client = await this.clientPromise
    this.topicDistribute[topic] = msgHandler
    return client.subscribe(topic)
  }

  /**
   * @param {String} topic
   * @param {*} payload  [send message that can be number, string, boolean, object]
   */
  async publish(topic, payload){
    if(!topic || payload == null)
      return this.log.error(`publish: invalid params`);
    this.log.info(`publish message: topic=${topic} payload=${payload}`)
    const client = await this.clientPromise
    return client.publish(topic, JSON.stringify(payload))
  }
}

module.exports = MqttLite
