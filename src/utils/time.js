
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

export default {
  interval,
  isGreater,
  endTime
}
