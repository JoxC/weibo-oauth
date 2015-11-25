'use strict'

/**
 * 对返回结果的一层封装，如果遇见微信返回的错误，将返回一个错误
 * 参见： http://open.weibo.com/wiki/Error_code
 */
exports.wrapper = function (callback) {
  return function (err, data, res) {
    callback = callback || function () {}
    if (err) {
      err.name = 'WeiboAPI' + err.name
      return callback(err, data, res)
    }
    if (data.error_code) {
      err = new Error(data.error)
      err.name = 'WeiboAPIError'
      err.code = data.error_code
      return callback(err, data, res)
    }
    callback(null, data, res)
  }
}
