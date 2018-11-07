import wechat from './wechat'
import config from './config.js'
import Time from '../../../utils/time'
require('xiaoda-date')

const url = config.service.courseUrl

const weekdays = [{
  backend: 'monday',
  frontend: '周一'
},
{
  backend: 'tuesday',
  frontend: '周二'
},
{
  backend: 'wednesday',
  frontend: '周三'
},
{
  backend: 'thursday',
  frontend: '周四'
},
{
  backend: 'friday',
  frontend: '周五'
},
{
  backend: 'saturday',
  frontend: '周六'
},
{
  backend: 'sunday',
  frontend: '周日'
}
]

const intervals = [{
  backend: 'morning',
  frontend: '上午'
},
{
  backend: 'afternoon',
  frontend: '下午'
},
{
  backend: 'evening',
  frontend: '晚上'
}
]

var getFrontEndCoursePerInterval = function (backendCourse, dayBackend, intervalBackend) {
  let dayInfo = backendCourse[dayBackend]
  if (!dayInfo) {
    return []
  }

  let backendAddition = dayInfo[intervalBackend + 'Info']

  if (!backendAddition) {
    return []
  }
  return backendAddition.map((course) => {
    return { week: 'both', teacher: '', share: true, ...course }
  })
}

var getFrontEndCourse = function (backendCourse) {
  let frontend = []
  for (let day of weekdays) {
    let daycourse = {}
    daycourse.name = day.frontend
    daycourse.interval = []
    for (let interval of intervals) {
      let intervalCourse = {}
      intervalCourse.name = interval.frontend
      intervalCourse.course =
        getFrontEndCoursePerInterval(backendCourse, day.backend, interval.backend)
      daycourse.interval.push(intervalCourse)
    }
    frontend.push(daycourse)
  }

  let meta = backendCourse.meta ? backendCourse.meta : {sameOddWeek: true}
  console.log('meta', meta)
  return {meta, courseInfo: frontend}
}

var getBackEndCourse = function (frontEnd) {
  let backend = {}
  for (let dayIdx in weekdays) {
    backend[weekdays[dayIdx].backend] = {}
    for (var intervalIdx in intervals) {
      backend[weekdays[dayIdx].backend][intervals[intervalIdx].backend + 'Info'] =
        frontEnd[dayIdx].interval[intervalIdx].course
    }
  }
  return backend
}

const state = {
  courseInfo: [],
  openid: '',
  courseMeta: {
    needOddEvenWeek: false,
    sameOddWeek: true,
    from: ''
  }
}

function __allCourses (state) {
  const courseInfo = state.courseInfo
  var courses = []
  courseInfo.map(day => {
    day.interval.map(interval => {
      interval.course.map(course => {
        if (courses.indexOf(course.name) === -1) {
          courses.push(course.name)
        }
      })
    })
  })
  return courses
}

const possibleInterval = (state) => {
  let courseInterval = {}
  let courseInfo = state.courseInfo

  courseInfo.forEach(day => {
    day.interval.forEach(interval => {
      interval.course.forEach(course => {
        if (course.startTime && course.endTime) {
          let interval = Time.interval(course.startTime, course.endTime)
          courseInterval[interval] = courseInterval[interval] ? (courseInterval[interval] + 1) : 1
        }
      })
    })
  })

  let pCourseInterval = 45
  let occurTimes = 0

  for (let j in courseInterval) {
    if (occurTimes < courseInterval[j]) {
      pCourseInterval = j
      occurTimes = courseInterval[j]
    }
  }

  return pCourseInterval
}

const possibleIntervalBetweenCourse = state => {
  let courseInterval = {}
  let courseInfo = state.courseInfo

  courseInfo.forEach(day => {
    day.interval.forEach(interval => {
      interval.course.forEach((course, index) => {
        let lastCourse = interval.course[index - 1]
        if (index > 0 && course.startTime && lastCourse.endTime) {
          let interval = Time.interval(lastCourse.endTime, course.startTime)
          courseInterval[interval] = courseInterval[interval] ? (courseInterval[interval] + 1) : 1
        }
      })
    })
  })

  let pCourseInterval = 10
  let occurTimes = 0

  for (let j in courseInterval) {
    if (occurTimes < courseInterval[j]) {
      pCourseInterval = j
      occurTimes = courseInterval[j]
    }
  }

  return pCourseInterval
}

const getters = {
  allCourses: state => {
    return __allCourses(state)
  },
  allLocations: state => {
    const courseInfo = state.courseInfo
    var location = []
    courseInfo.map(day => {
      day.interval.map(interval => {
        interval.course.map(course => {
          if (course.location && location.indexOf(course.location) === -1) {
            location.push(course.location)
          }
        })
      })
    })
    return location
  },
  allLocationOfCourse: state => {
    const courseInfo = state.courseInfo
    var locationOfCourse = []

    courseInfo.map(day => {
      day.interval.map(interval => {
        interval.course.map(course => {
          if (course.location) {
            let sameLocationExisted = (
              locationOfCourse.filter((item) => {
                return item.name === course.name && item.location === course.location
              }).length !== 0
            )
            if (!sameLocationExisted) {
              locationOfCourse.push({name: course.name, location: course.location})
            }
          }
        })
      })
    })
    return locationOfCourse
  },
  canditateInterval: (state) => (day, interval) => {
    const courseInfo = state.courseInfo
    let courseNo = courseInfo[day].interval[interval].course.length

    for (let i in courseInfo) {
      let course = courseInfo[i].interval[interval].course[courseNo]
      if (course && course.startTime && course.endTime) {
        return {startTime: course.startTime, endTime: course.endTime}
      }
    }
    return {startTime: '', endTime: ''}
  },
  candidateStartTime: (state) => (day, interval, courseidx) => {
    const courseInfo = state.courseInfo
    for (let i in courseInfo) {
      let course = courseInfo[i].interval[interval].course[courseidx]
      if (course && course.startTime && course.endTime) {
        return course.startTime
      }
    }

    if (courseidx > 0) {
      let course = courseInfo[day].interval[interval].course[courseidx - 1]
      if (course && course.startTime && course.endTime) {
        let possibleInterval = possibleIntervalBetweenCourse(state)
        return Time.endTime(course.endTime, possibleInterval) // 上一节课的结束时间 + 10
      }
    }

    if (interval === 0) { // 上午的推荐时间
      return '08:00'
    } else if (interval === 1) { // 下午的推荐时间
      return '13:00'
    } else {
      return '19:00'
    }
  },

  candidateEndTime: (state) => (startTime) => {
    if (startTime === '') {
      return ''
    }
    let courseinterval = possibleInterval(state)
    return Time.endTime(startTime, courseinterval)
  },
  allTeacherOfCourse: (state) => (courseName) => {
    let teacher = []
    let courseInfo = state.courseInfo
    courseInfo.forEach(day => {
      day.interval.forEach(interval => {
        interval.course.forEach(course => {
          if (course.name === courseName && course.teacher !== '' && teacher.indexOf(course.teacher) === -1) {
            teacher.push(course.teacher)
          }
        })
      })
    })
    return teacher
  },
  currentWeekOdd: (state) => {
    let xiaodaOddWeek = new Date().isOddWeek()
    if (state.courseMeta.sameOddWeek) {
      return xiaodaOddWeek
    } else {
      return !xiaodaOddWeek
    }
  },
  getDisplayCourse: (state) => (filter) => {
    let courseInfo = JSON.parse(JSON.stringify(state.courseInfo))
    let displayCourseInfo = courseInfo.map((day) => {
      let interval = day.interval.map(interval => {
        let course = interval.course.filter(filter)
        interval.course = course
        return interval
      })
      day.interval = interval
      return day
    })
    return displayCourseInfo
  }
}

function isExistOddEvenCourse (courseInfo) {
  var exist = false
  courseInfo.forEach((day) => {
    day.interval.forEach((interval) => {
      interval.course.forEach((course) => {
        if (course.week && course.week !== 'both') {
          exist = true
        }
      })
    })
  })
  return exist
}

function __setCourses (state, courseInfo) {
  state.courseInfo = courseInfo
  state.courseMeta.needOddEvenWeek = isExistOddEvenCourse(courseInfo)
}

const mutations = {
  setBackendCourses (state, {meta, courseInfo}) {
    state.courseMeta.sameOddWeek = meta && meta.sameOddWeek !== undefined ? meta.sameOddWeek : true
    state.courseMeta.from = meta && meta.from !== undefined ? meta.from : ''
    __setCourses(state, courseInfo)
  },

  setCourses (state, courseInfo) {
    __setCourses(state, courseInfo)
  },

  moveupCourse (state, {day, interval, course}) {
    let courses = state.courseInfo[day].interval[interval].course
    if (course > 0) {
      let array = courses.splice(course, 1)
      state.courseInfo[day].interval[interval].course.splice(course - 1, 0, ...array)
    }
  },

  movedownCourse (state, {day, interval, course}) {
    let courses = state.courseInfo[day].interval[interval].course
    if (course < (courses.length - 1)) {
      let array = courses.splice(course, 1)
      state.courseInfo[day].interval[interval].course.splice(course + 1, 0, ...array)
    }
  },

  deleteCourse (state, {day, interval, course}) {
    state.courseInfo[day].interval[interval].course.splice(course, 1)
  },

  editCourse (state, {day, interval, course, value}) {
    state.courseInfo[day].interval[interval].course.splice(course, 1, value)
  },

  appendCourse (state, {day, interval, value}) {
    state.courseInfo[day].interval[interval].course.push(value)
  },

  appendCourseAfter (state, {day, interval, course, value}) {
    state.courseInfo[day].interval[interval].course.splice(course, 0, value)
  },

  copyCourses (state, {courseInfo, meta}) {
    state.courseInfo = courseInfo
    state.courseMeta.sameOddWeek = meta.sameOddWeek
    state.courseMeta.from = meta.from
  },

  setOpenId (state, openid) {
    state.openid = openid
  },

  setCurrentWeek (state, odd) {
    let xiaoDaOdd = new Date().isOddWeek()
    state.courseMeta.sameOddWeek = (xiaoDaOdd === odd)
  },

  toggleCourseShare (state, {day, interval, course}) {
    let courseInfo = state.courseInfo[day].interval[interval].course[course]
    state.courseInfo[day].interval[interval].course.splice(course, 1,
      {...courseInfo, share: !courseInfo.share})
  }
}

function __getCourses (openid) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}?openid=${openid}`,
      success: function (response) {
        if (response.statusCode === 200) {
          var backendCourse = response.data.courseTable
          resolve(getFrontEndCourse(backendCourse))
        } else if (response.statusCode === 404) {
          resolve(getFrontEndCourse({}))
        } else {
          reject(response)
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

const actions = {
  getOtherCourses ({commit}, openid) {
    return __getCourses(openid)
  },

  getCourses ({commit}) {
    return new Promise(function (resolve, reject) {
      wechat.getOpenId().then((openid) => {
        __getCourses(openid).then((courseInfo) => {
          console.log(courseInfo)
          commit('setBackendCourses', courseInfo)
          commit('setOpenId', openid)
          resolve()
        }).catch((err) => {
          reject(err)
        })
      }).catch((err) => {
        reject(err)
      })
    })
  },

  // mergeCourses ({commit}, otherOpenId) {
  //   return new Promise((resolve, reject) => {
  //     __getCourses(otherOpenId).then((courseInfo) => {
  //       commit('mergeCourses', courseInfo)
  //       resolve()
  //     }).catch((err) => {
  //       reject(err)
  //     })
  //   })
  // },

  saveCourses ({commit}, courses) {
    var backendCourses = getBackEndCourse(courses)
    return new Promise((resolve, reject) => {
      wechat.getOpenId()
        .then((openid) => {
          wx.request({
            url: url,
            method: 'POST',
            data: {
              openid: openid,
              courseTable: {
                meta: state.courseMeta,
                ...backendCourses
              }
            },
            success: function (response) {
              commit('setCourses', courses)
              resolve(response)
            },
            fail: function (err) {
              reject(err)
            }
          })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
