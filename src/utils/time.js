
function _timeStrToVal (time) {
  let [hour, minu] = time.split(':').map((item) => parseInt(item))

  if (hour < 0 || hour > 23) {
    throw (new Error('非法时间'))
  }

  if (minu < 0 || minu > 59) {
    throw (new Error('非法时间'))
  }

  return parseInt(hour * 60 + minu)
}

function _valToTimeStr (val) {
  let hour = parseInt(val / 60)
  let min = (val % 60)
  let hourStr = hour < 10 ? `0${hour}` : `${hour}`
  let minStr = min < 10 ? `0${min}` : `${min}`
  return `${hourStr}:${minStr}`
}

function interval (start, end) {
  return parseInt(_timeStrToVal(end) - _timeStrToVal(start))
}

function isGreater (lhs, rhs) {
  return _timeStrToVal(lhs) > _timeStrToVal(rhs)
}

function endTime (start, interval) {
  return _valToTimeStr(_timeStrToVal(start) + parseInt(interval))
}

/*
* 获取 yyyy-MM-dd HH:mm:ss格式的时间
* */
function getFormatTime () {
  let now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  month = month < 10 ? '0' + month : month
  let day = now.getDate()
  day = day < 10 ? '0' + day : day
  let hour = now.getHours()
  hour = hour < 10 ? '0' + hour : hour
  let minute = now.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  let second = now.getSeconds()
  second = second < 10 ? '0' + second : second
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

export default {
  interval,
  isGreater,
  endTime,
  getFormatTime
}
