class Log {
  constructor(debug = false) {
    this.debug = debug
    ;['info', 'warn', 'error'].forEach(key => {
      this[key] = (...args) => debug && console[key]('#mqtt-lite# ', ...args)
    })
    this.error = (...args) => console.error('#mqtt-lite# ', ...args)
  }

  flatParam(info, params) {
    const paramsStr = Object.keys(params).map( key => `${key}=`+JSON.stringify(params[key])).join(',')
    this.info(`${info}: ${paramsStr}` )
  }
}

module.exports = Log