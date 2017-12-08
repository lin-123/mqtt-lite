// todo: 封装mqtt  暴露一个register方法，接收两个参数：topic listener
const mqtt = require('mqtt')
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
    this.clientPromise = new Promise(resolve => clientResolve = resolve)
    this.topicDistribute = {}
    let opt = Object.assign({}, option)
    this.log = new Log(opt.debug)
    delete opt.debug
    const client = mqtt.connect(conn, opt)
    client.on('connect', (msg) => {
      this.log.info('mqtt connect success!')
      clientResolve(client)
    })

    client.on('message', (topic, payload) => {
      const payloadStr = payload.toString()
      this.log.flatParam(`revice message`, {topic, payloadStr})
      const msgHandler = this.topicDistribute[topic]
      if(!msgHandler) return;
      try{
        msgHandler(JSON.parse(payloadStr))
      }catch(e) {
        this.log.warn('payload json parse error: ', e)
        msgHandler(payloadStr)
      }
    })
  }

  /**
   * @param {Function} msgHandler [callback when mqtt connection revcive error message]
   */
  error(msgHandler) {
    if(typeof msgHandler != 'function'){
      this.log.error('error: invalid msgHandler')
      return Promise.reject('invalid msgHandler')
    }

    this.clientPromise.then(client => {
      client.on('error', msgHandler)
    })
  }

  /**
   * @param {Sting} topic
   * @param {Function} msgHandler [callback when this topic revice message]
   */
  subscribe(...args){
    const msgHandler = args.pop()
    if(typeof msgHandler !== 'function'){
      this.log.error(`subscribe: invalid msgHandler`);
      return Promise.reject('invalid msgHandler')
    }

    const [topic, options = {}] = args
    this.log.flatParam(`subscribe topic`, {topic, options})
    return this.clientPromise.then(client => {
      const key = JSON.stringify(args)
      this.topicDistribute[key] = msgHandler
      return new Promise((resolve, reject) => {
        client.subscribe(topic, options, (err, pkg) => {
          err?reject(err):resolve(pkg)
        })
      })
    })
  }

  /**
   * @param {String} topic
   * @param {*} payload  [send message that can be number, string, boolean, object]
   */
  publish(topic, payload, options = {}){
    if(payload == null){
      this.log.error(`publish: invalid params`);
      return Promise.reject('payload should not be null')
    }

    this.log.flatParam(`publish message`, {topic, payload, options})
    return this.clientPromise.then(client => client.publish(topic, JSON.stringify(payload), options))
  }
}

module.exports = MqttLite
