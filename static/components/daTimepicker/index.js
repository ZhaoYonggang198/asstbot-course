const MIN_TIME = 0
const MAX_TIME = 1439

function timeStrToVal (time) {
  let [hour, minu] = time.split(':').map((item) => parseInt(item))

  if (hour < 0 || hour > 23) {
    throw (new Error('非法时间'))
  }

  if (minu < 0 || minu > 59) {
    throw (new Error('非法时间'))
  }

  return { hour, minu }
}

function getHourRange (start, end) {
  let range = []
  for (let i = start.hour; i <= end.hour; i++) {
    range.push(i)
  }
  return range.map((value) => value < 10 ? `0${value}` : `${value}`)
}

function _getMinRange (startMin, endMin) {
  let range = []
  for (let i = parseInt(startMin / 5); i < parseInt(endMin / 5) + 1; i++) {
    range.push(i * 5)
  }
  return range.map((value) => value < 10 ? `0${value}` : `${value}`)
}

function getMinuRange (currentHour, startTime, endTime) {
  if (currentHour === startTime.hour) {
    if (startTime.hour !== endTime.hour) {
      return _getMinRange(startTime.minu, 59)
    } else {
      return _getMinRange(startTime.minu, endTime.minu)
    }
  } else if (currentHour === endTime.hour) {
    return _getMinRange(0, endTime.minu)
  } else {
    return _getMinRange(0, 59)
  }
}

function _getAppendMinRange (start, end) {
  let range = []
  for (let i = start; i < end; i++) {
    range.push('+' + i)
  }
  return range
}

function getAppendMinRange (current, start, end) {
  let currentTime = current.hour * 60 + current.minu
  let startTime = start.hour * 60 + start.minu
  let endTime = end.hour * 60 + end.minu

  if (parseInt(currentTime / 5) === parseInt(startTime / 5)) {
    return _getAppendMinRange((currentTime % 5), 5)
  } else if (parseInt(currentTime / 5) === parseInt(endTime / 5)) {
    return _getAppendMinRange(0, (endTime % 5) + 1)
  } else {
    return _getAppendMinRange(0, 5)
  }
}

function isTimeInRange (start, end, current) {
  let currentTime = current.hour * 60 + current.minu
  let startTime = start.hour * 60 + start.minu
  let endTime = end.hour * 60 + end.minu

  if (currentTime >= startTime && currentTime <= endTime) {
    return 0
  } else if (currentTime < startTime) {
    return -1
  } else {
    return 1
  }
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    start: {
      type: String,
      value: '00:00',
      observer: function (val) {
        this.setRange(val, this.properties.end)
      }
    },
    end: {
      type: String,
      value: '23:59',
      observer: function (val) {
        this.setRange(this.properties.start, val)
      }
    },
    value: {
      type: String,
      value: '00:00',
      observer: function (val) {
        let time = timeStrToVal(val)
        this.setRangeData(this.data.startTime, this.data.endTime, time)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timeRange: [[], [], []],
    timeValue: [0, 0, 0],
    startTime: MIN_TIME,
    endTime: MAX_TIME,
    time: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setRange (start, end) {
      let startTime = timeStrToVal(start)
      let endTime = timeStrToVal(end)

      this.setData({ startTime, endTime })

      this.setRangeData(startTime, endTime, this.data.time)
    },

    setRangeData (startTime, endTime, time) {
      let currentTime = time
      if (isTimeInRange(startTime, endTime, time) === -1) {
        currentTime = startTime
      } else if (isTimeInRange(startTime, endTime, time) === 1) {
        currentTime = endTime
      }

      let hourValue = currentTime.hour - startTime.hour
      let minuValue = hourValue === 0
        ? (parseInt(currentTime.minu / 5) - parseInt(startTime.minu / 5))
        : parseInt(currentTime.minu / 5)
      let appendminValue = (hourValue === 0 && minuValue === 0)
        ? currentTime.minu - startTime.minu : (currentTime.minu % 5)
      let hourRange = getHourRange(startTime, endTime)
      let minuRange = getMinuRange(currentTime.hour, startTime, endTime)
      let appendminRange = getAppendMinRange(currentTime, startTime, endTime)
      this.setData({
        time: currentTime,
        timeRange: [hourRange, minuRange, appendminRange],
        timeValue: [hourValue, minuValue, appendminValue]
      })
    },

    columnChange (event) {
      if (event.detail.column === 0) { // change hours
        let hourValue = event.detail.value
        let currentHour = parseInt(this.data.timeRange[0][hourValue])
        let currentMinu = this.data.time.minu
        this.setRangeData(this.data.startTime, this.data.endTime,
          {hour: currentHour, minu: currentMinu})
      } else if (event.detail.column === 1) {
        let currentHour = this.data.time.hour
        let minValue = event.detail.value
        let currentMin = parseInt(this.data.timeRange[1][minValue])
        this.setRangeData(this.data.startTime, this.data.endTime,
          {hour: currentHour, minu: currentMin})
      } else {
        let currentMinu = parseInt(this.data.timeRange[1][this.data.timeValue[1]]) +
          parseInt(this.data.timeRange[2][event.detail.value])
        this.setData({
          'time.minu': currentMinu,
          'timeValue[2]': event.detail.value
        })
      }
    },

    valuechange (event) {
      let hour = this.data.timeRange[0][event.detail.value[0]]
      let minu = parseInt(this.data.timeRange[1][event.detail.value[1]]) + parseInt(this.data.timeRange[2][event.detail.value[2]])
      minu = minu < 10 ? `0${minu}` : `${minu}`
      this.triggerEvent('change', {value: `${hour}:${minu}`})
    }
  }
})
