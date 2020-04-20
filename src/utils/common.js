/**
 * Created by admin on 2017/7/19.
 */

// 获取当前时间
export function getNowFormatDate () {
  let date = new Date()
  let seperator1 = '-'
  let seperator2 = ':'
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  let hour = date.getHours()
  hour = hour < 10 ? '0' + hour : hour
  let minutes = date.getMinutes()
  minutes = minutes < 10 ? '0' + minutes : minutes
  let seconds = date.getSeconds()
  seconds = seconds < 10 ? '0' + seconds : seconds
  let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
    ' ' + hour + seperator2 + minutes + seperator2 + seconds
  return currentdate
}

// 时间转换 年月日时分秒
export function formatDateTime (date, type) {
  let week = '(' + [ '星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ][date.getDay()] + ')'
  let year = date.getFullYear()
  let month = (date.getMonth() + 1)
  month = month < 10 ? '0' + month : month + ''
  let day = date.getDate()
  day = day < 10 ? '0' + day : day + ''
  let hour = date.getHours()
  hour = hour < 10 ? '0' + hour : hour + ''
  let minutes = date.getMinutes()
  minutes = minutes < 10 ? '0' + minutes : minutes + ''
  let seconds = date.getSeconds()
  seconds = seconds < 10 ? '0' + seconds : seconds + ''
  if (type === 'dateTime') {
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
  } else if (type === 'date') {
    return year + '-' + month + '-' + day + ' '
  }
}

// 计算时间差
export function DateDiff (sDate1, sDate2) { // sDate1和sDate2是2002-12-18格式
  let aDate, oDate1, oDate2, iDays
  aDate = sDate1.split('-')
  oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])  // 转换为12-18-2002格式
  aDate = sDate2.split('-')
  oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)   // 把相差的毫秒数转换为天数
  return iDays
}
