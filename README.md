# mqtt-lite

## TODO
1. 每个broker建立一个socket链接
2. 可以提供publish subscribe功能
3. option.debug = true, 则开启log模式，
  - log记录mqtt链接成功
  - publish: topic payload
  - subscribe: 在 on message时候打印topic payload
4. 偶发性的publish后没收到消息。当publish执行的太早时


## 介绍
封装微信`jssdk`，让其支持`promise`，并且让每个方法在`wx.ready`之后再执行。

#### API
- register
``` javascript
/**
 * 注册签名
 * @param {string} signatureUrl 获取微信签名的URL地址
 * @param {string} appid  企业号或公众号唯一标识
 * @param {array}  jsApiList 需要调用的API，如： jsApiList = ['getNetworkType', 'previewImage']
 * @param {bool}   debug    true: 微信会alert出API调用情况
 */
wx.register({signatureUrl, appid, jsApiList, debug: true })

/**
 * signatureUrl： 获取签名接口介绍 [get接口]
 * @return {json}
 * {
 *  code: 0, //  normal response
 *  errorMsg: '',
 *  data: {
 *      timestamp,  // 获取signature的timestamp
 *      nonceStr,   // 获取signature的noncestr
 *      signature,  // signature
 *  }
 * }
 */
```
- wx 其他API正常调用，返回promise


#### 使用方式
``` javascript
import wx from 'wx-sdk-promisify'
const domain = 'http://domain/signature'
const agentid = 1000001
const appid = 'testappid'
const url = location.href.split('#')[0]
const signatureUrl = `${domain}?appid=${appid}&agentid=${agentid}&url=${url}`
const jsApiList = ['getNetworkType', 'previewImage']
wx.register({signatureUrl, appid, jsApiList, debug: true })

const testWx = async () => {
  const {networkType} = await wx.getNetworkType()
  await wx.previewImage({current, urls})
}
textWx()
```

#### 比较
- example1
``` javascript
// before
wx.ready(function() {
  wx.getNetworkType({
      success: function (res) {
          var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
          //...
      }
  });
})

// promisify
const {networkType} = await wx.getNetworkType()
```

- example2
``` javascript
// before
wx.ready(function() {
  wx.previewImage({
    current: '', // 当前显示图片的http链接
    urls: [] // 需要预览的图片http链接列表
  });
})

// promisify
await wx.previewImage({current, urls})
```

## Build Setup
- develop:  `make dev`
- build: `make build`
- publish: `make publish`


## 附录

#### 微信开发文档
- 公众号： https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
- 企业微信： https://work.weixin.qq.com/api/doc#10029

#### API list
其中注释掉的部分是微信官方 js-sdk 暂未支持的方法
``` javascript
  'checkJsApi',
  'openEnterpriseChat',
  'onMenuShareAppMessage',
  // 'onMenuShareWechat',
  'chooseImage',
  'uploadImage',
  'downloadImage',
  'stopRecord',
  'onVoicePlayEnd',
  'uploadVoice',
  'downloadVoice',
  'getNetworkType',
  'getLocation',
  'scanQRCode',
  'onVoiceRecordEnd',
  // 'selectEnterpriseContact',
  'startRecord',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'previewImage',
  // 'previewFile',
  'openLocation',
  // 'onHistoryBack',
  'hideOptionMenu',
  'showOptionMenu',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'closeWindow',
  // 'chooseInvoice'
```