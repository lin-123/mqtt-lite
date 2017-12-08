// const MqttLiteLite = require('../../dist/index.min.js')
const MqttLite = require('../../src')

describe('MqttLite', () => {
  const mqttLite = new MqttLite('ws://iot.eclipse.org:80/ws', {debug: true})
  after(() => {
    mqttLite.end()
  })
  it('normal', (done) =>  {
    const payload = 'hello world!'
    mqttLite.subscribe('testx', (msg) => {
      console.log('asdf', msg)
      expect(msg).toEqual(payload)
      done()
    })
    mqttLite.publish('testx', payload)
  })

  it('normal, qos=1', (done) =>  {
    const payload = 'hello world!'
    mqttLite.subscribe('testx', { qos:1 }, (msg) => {
      expect(msg).toEqual(payload)
      done()
    })
    mqttLite.publish('testx', payload, { qos:1 })
  })
})