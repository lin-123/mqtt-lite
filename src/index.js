// todo: 封装mqtt  暴露一个register方法，接收两个参数：topic listener
import mqtt from 'mqtt'

let clientResolve
const Promise = window.Promise
const clientPromise = new Promise(resolve => clientResolve = resolve)
let topicDistribute = {}

export const connect = (connect, option) => {
  const client = mqtt.connect(connect, option)
  client.on('connect', (msg) => {
    console.log('mqtt connect success!')
    clientResolve(client)
  })

  client.on('message', (topic, payload) => {
    const msgHandler = topicDistribute[topic]
    if(!msgHandler) return;
    const msg = JSON.parse(payload.toString())
    msgHandler(msg);
  })
}

// 注册topic
export const subscribe = async (topic, msgHandler) => {
  const client = await clientPromise
  client.subscribe(topic)
  topicDistribute[topic] = msgHandler
}

export const publish = async (topic, payload) => {
  const client = await clientPromise
  client.publish(topic, JSON.stringify(payload))
}