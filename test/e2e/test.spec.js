// const MqttLiteLite = require('../../dist/index.min.js')
const MqttLite = require('../../src')

describe('MqttLite', () => {
  let mqttLite
  before(() => {
    mqttLite = new MqttLite('ws://iot.eclipse.org:80/ws', {debug: true})
  })
  it('normal', () =>  {
    const payload = 'hello world!'
    mqttLite.subscribe('testx', (msg) => {
      console.log('msg,,', msg)
      expect(msg).toEqual(payload)
      done()
    })
    mqttLite.publish('testx', payload)
  })
})