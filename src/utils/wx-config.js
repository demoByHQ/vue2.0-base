import Vue from 'vue'
import {WechatPlugin} from 'vux'
import {fetch} from './fetch'

Vue.use(WechatPlugin)
// for debug
console.log(WechatPlugin.$wechat)

/**
 * @getCode function from the wxURL:
 * eg. url: http://handhrhap.hand-china.com/dist/?code=zCGiYN30SxNDeyN7yLn2n3iPC8mDPi0ZigeHDWL3L7U&state=STATE
 * 获取url中的code字段的信息
 *
 * @getToken function get TOKEN through getCode function
 * 根据code字段信息，来获取对应的token？
 *
 * @getMessage function getMessage function
 * 获取消息推送的信息
 *
 * @wxConfig function 配置JS-SDK，方便以后使用JS-SDK的相关api功能：
 * eg. chooseImage api (ps: 获取拍照和相册选择功能)
 */

let WX_CONFIGS = {
  getCode () {
    let WxUrlObj = {}
    let urlParamsArray = window.location.search.substring(1).split('&')
    urlParamsArray.forEach((item, index, array) => {
      let pos = item.indexOf('=')
      if (pos == '-1') {
      } else {
        WxUrlObj[item.split('=')[0]] = item.split('=')[1]
      }
    })
    return WxUrlObj.code
  },
  // 获取消息推送的信息getMessage
  getMessage () {
    let WxUrlObj = {}
    let url = '?fBillNo=12229&fClassTypeId=190000003&fStatus=4&response_type=code&scope=snsapi_base&agentid=AGENTID&state=1#wechat_redirect'
    let urlParamsArray = url.substring(1).split('&')
    urlParamsArray.forEach((item, index, array) => {
      let pos = item.indexOf('=')
      if (pos == '-1') {
      } else {
        WxUrlObj[item.split('=')[0]] = item.split('=')[1]
      }
    })
    return WxUrlObj
  },
  wxConfig (WxUrl, apiList) {
    // WxUrl需要动态获取当前页面完整的URL地址（包括?后面的参数，但不能包含#号）
    fetch({
      url: 'api/getJSSDKParams',
      method: 'post',
      data: {
        url: WxUrl,
      },
    }).then(function (res) {
      const data = res.data.rows[0] || []
      WechatPlugin.$wechat.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId || '', // 必填，企业号的唯一标识，此处填写企业号corpid
        timestamp: data.timestamp || '', // 必填，生成签名的时间戳
        nonceStr: data.nonceStr || '', // 必填，生成签名的随机串
        signature: data.signature || '', // 必填，签名
        jsApiList: apiList || [], // 必填，需要使用的JS接口列表
      })
    })
  },
}

export default WX_CONFIGS

