# mqtt-lite

## Introduction
- use mqtt`s method without wait for connection ready. support nodejs and browser.

#### API

- new MqttLite(connection, option)
``` javascript
/**
 * mqtt-lite
 * @param  {string} conn   [mqtt websocket url]
 * @param  {Object} option [mqtt connect opiton see:  https://github.com/mqttjs/MQTT.js#connect]
 * @param  {bool}   option.debug [lite option, if debug is true, mqtt-lite will print log to console]
 */
new MqttLite(connection, option)
```

- subscribe
```javascript
/**
 * @param {Sting} topic
 * @param {Function} msgHandler [callback when this topic revice message]
 */
subscribe(topic, msgHandler)
```

- publish
```javascript
/**
 * @param {String} topic
 * @param {*} payload  [send message that can be number, string, boolean, object]
 */
publish(topic, payload)
```

- error
```javascript
/**
 * @param {Function} msgHandler [callback when mqtt connection revcive error message]
 */
error(msgHandler)
```


#### Usage
```javascript
import MqttLite from 'mqtt-lite'

// debug: true  打印mqtt-lite log
const mqtt = new MqttLite('ws://iot.eclipse.org:80/ws', {debug: true})

mqtt.subscribe('testx', (msg) => {
    console.log('recive message: ', msg)
})

mqtt.publish('testx', 'hello world!')

mqtt.error((e) => {
  console.error(e)
})
```

