class Log {
  constructor(debug = false) {
    this.debug = debug
    ;['info', 'error'].forEach(key => {
      this[key] = (msg) => debug && console[key]('#mqtt-lite# ', msg)
    })
  }
}

module.exports = Log