import MqttLite from '../dist/index.min.js'

const mqtt = new MqttLite('ws://iot.eclipse.org:80/ws', {debug: true})
mqtt.subscribe('testx', (msg) => {
    console.log('recive message: ', msg)
    document.getElementsByClassName('message')[0].insertAdjacentHTML('beforeBegin', `<p>${msg}</p>`)
    document.getElementById('message').value = ''
})
window.send = () => mqtt.publish('testx', document.getElementById('message').value)

mqtt.publish('testx', 'hello world!')