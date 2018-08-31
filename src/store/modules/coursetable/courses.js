import wechat from './wechat'
import config from './config.js'
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

  let backendInfo = dayInfo[intervalBackend]
  let backendAddition = dayInfo[intervalBackend + 'Info']

  if (!backendInfo) {
    return []
  }

  if (!backendAddition) {
    return backendInfo.map((coursename) => {
      return {
        name: coursename,
        location: '',
        startTime: '',
        endTime: ''
      }
    })
  } else {
    return backendAddition
  }
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
  return frontend
}

var getBackEndCourse = function (frontEnd) {
  let backend = {}
  for (let dayIdx in weekdays) {
    backend[weekdays[dayIdx].backend] = {}
    for (var intervalIdx in intervals) {
      backend[weekdays[dayIdx].backend][intervals[intervalIdx].backend + 'Info'] =
        frontEnd[dayIdx].interval[intervalIdx].course
      backend[weekdays[dayIdx].backend][intervals[intervalIdx].backend] =
        frontEnd[dayIdx].interval[intervalIdx].course.map((course) => {
          return course.name
        })
    }
  }
  return backend
}

const state = {
  courseInfo: [],
  openid: ''
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

const getters = {
  allCourses: state => {
    return __allCourses(state)
  }
}

const mutations = {
  setCourses (state, courseInfo) {
    state.courseInfo = courseInfo
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

  copyCourses (state, courseInfo) {
    state.courseInfo = courseInfo
  },

  mergeCourses (state, courseInfo) {
    var allCourses = __allCourses(state)
    if (allCourses.length === 0) {
      state.courseInfo = courseInfo
    } else {
      for (let dayidx in state.courseInfo) {
        let day = courseInfo[dayidx]
        for (let intervalidx in state.courseInfo[dayidx].interval) {
          if (state.courseInfo[dayidx].interval[intervalidx].course.length === 0) {
            state.courseInfo[dayidx].interval[intervalidx].course =
              day.interval[intervalidx].course
          }
        }
      }
    }
  },

  setOpenId (state, openid) {
    state.openid = openid
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
          commit('setCourses', courseInfo)
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

  mergeCourses ({commit}, otherOpenId) {
    return new Promise((resolve, reject) => {
      __getCourses(otherOpenId).then((courseInfo) => {
        commit('mergeCourses', courseInfo)
        resolve()
      }).catch((err) => {
        reject(err)
      })
    })
  },

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
              courseTable: backendCourses
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
