/**
 * Created by admin on 2017/7/24.
 */

import Vue from 'vue'

// //将时间转化为xxxx-xx-xx的时间格式
Vue.filter('getDateTime', function (time) {
  let newTime = time.replace(/\s/, 'T')
  let date = new Date(newTime)
  let year = date.getFullYear()
  let month = (date.getMonth() + 1)
  month = month < 10 ? '0' + month : month + ''
  let day = date.getDate()
  day = day < 10 ? '0' + day : day + ''
  let hour = date.getHours()
  hour = hour < 10 ? '0' + hour : hour + ''
  let minutes = date.getMinutes()
  minutes = minutes < 10 ? '0' + minutes : minutes + ''
  let milliseconds = date.getMilliseconds()
  milliseconds = milliseconds < 10 ? '0' + milliseconds : milliseconds + ''
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + milliseconds
})

// //将时间转化为xxxx-xx-xx的时间格式
Vue.filter('getYearMonth', function (time) {
  let newTime = time.replace(/\s/, 'T')
  let date = new Date(newTime)
  let year = date.getFullYear()
  let month = (date.getMonth() + 1)
  month = month < 10 ? '0' + month : month + ''
  let day = date.getDate()
  day = day < 10 ? '0' + day : day + ''
  let hour = date.getHours()
  hour = hour < 10 ? '0' + hour : hour + ''
  let minutes = date.getMinutes()
  minutes = minutes < 10 ? '0' + minutes : minutes + ''
  let milliseconds = date.getMilliseconds()
  milliseconds = milliseconds < 10 ? '0' + milliseconds : milliseconds + ''
  return year + '-' + month + '-' + day
})

// 将时间转换成星期
Vue.filter('getWeek', function (time) {
  let newTime = time.replace(/\s/, 'T')
  let week = new Date(newTime).getDay()
  switch (week) {
    case 1:
      return '周一'
      break
    case 2:
      return '周二'
      break
    case 3:
      return '周三'
      break
    case 4:
      return '周四'
      break
    case 5:
      return '周五'
      break
    case 6:
      return '周六'
      break
    case 0:
      return '周日'
      break
    default:
      break
  }
})

// 取出("2017-07-19 16:06:30") 里面的日期
Vue.filter('getDate', function (time) {
  let newTime = time.replace(/\s/, 'T')
  let date = new Date(newTime)
  let month = (date.getMonth() + 1)
  month = month < 10 ? '0' + month : month + ''
  let day = date.getDate()
  day = day < 10 ? '0' + day : day + ''
  return month + '.' + day
})

// 取出("2017-07-19 16:06:30") 里面的时间
Vue.filter('getTime', function (time) {
  let newTime = time.substring(10, 16)
  return newTime
})

// 打卡类型转换
Vue.filter('changeStatus', function (param) {
  if (param === 'startWork') {
    return '上班'
  } else {
    return '下班'
  }
})

// 假期状态转换
Vue.filter('checkStatus', function (param) {
  if (param === '4') {
    return '审批中'
  } else {
    return '已结束'
  }
})

// 假期状态转换
Vue.filter('exceptionStatus', function (param) {
  if (param === 'startWork') {
    return '上班补卡'
  } else if (param === 'offWork') {
    return '下班补卡'
  } else {
    return param
  }
})
