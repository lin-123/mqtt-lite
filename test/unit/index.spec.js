const MqttLite = require('../../src')
const mqtt = require('mqtt')
const Client = require('./client')

describe('MqttLite', () => {
  let mqttLite
  before(() => {
    const config = {
      broker: 'ws://iot.eclipse.org:80/ws',
      option: {debug: false}
    }
    sinon.stub(mqtt, 'connect').callsFake((broker, opt) => {
      expect(broker).toEqual(config.broker)
      expect(opt.debug).toEqual(undefined)
      return new Client()
    })
    mqttLite = new MqttLite(config.broker, config.option)
  })
  after(() => mqtt.connect.restore())

  it('normal: can subscribe publish', (done) =>  {
    const payload = 'hello world!'
    mqttLite.subscribe('testx', (msg) => {
      expect(msg).toEqual(payload)
      done()
    })
    mqttLite.publish('testx', payload)
  })

  it('normal: error should recive messasge', done => {
    mqttLite.error(e => {
      expect(e).toEqual('error')
      done()
    })
  })

  it('error: subscribe havn`t msgHandler', (done) => {
    mqttLite.subscribe('tt').catch(e => {
      expect(e).toEqual('invalid msgHandler')
      done()
    })
  })

  it('error: publish payload is null or undefined', (done) => {
    mqttLite.publish('', null).catch(e => {
      expect(e).toEqual('payload should not be null')
      done()
    })
  })

  it('error: error no msgHandler', (done) => {
    mqttLite.error().catch(e => {
      expect(e).toEqual('invalid msgHandler')
      done()
    })
  })
})
