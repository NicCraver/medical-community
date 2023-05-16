export default {
  methods: {
    validatorPhone(rule, value, callback) {
      if (value === '') {
        callback(new Error('请填写手机号'))
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    },
    validatorAge(rule, value, callback) {
      if (value === '') {
        callback()
      } else if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error('年龄格式错误'))
      } else {
        callback()
      }
    },
    validatorID(rule, value, callback) {
      if (value === '') {
        callback()
      } else if (
        !/^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X]|[x])$/.test(
          value
        )
      ) {
        callback(new Error('证件格式错误'))
      } else {
        callback()
      }
    },
    validatorAccountBook(rule, value, callback) {
      if (value === '') {
        callback()
      } else if (!/^\d{9}$/.test(value)) {
        callback(new Error('证件格式错误'))
      } else {
        callback()
      }
    },
    validatorPassport(rule, value, callback) {
      if (value === '') {
        callback()
      } else if (!/^([EK]\d{8}|(SE|DE|PE|MA)\d{7})$/.test(value)) {
        callback(new Error('证件格式错误'))
      } else {
        callback()
      }
    },
  },
}
