# mqtt-lite

## TODO
1. 添加单测
2. mqtt瘦身 只需要connect subscribe publish 功能
3. make build 失败

## 介绍
- 封装mqtt， 可以让 publish subscribe 功能不用等待connect执行后再执行

#### 使用方式
```javascript
import MqttLite from '../dist/index.min.js'
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
