/*
 * @Author: PaddingMe (BP: liuqiangdong)
 * @Date: 2018-09-27 00:10:10
 * @Last Modified by: PaddingMe
 * @Last Modified time: 2018-09-27 19:57:36
 */

const request = require('request')

const getRank = (bpName) => {
  return new Promise((resolve, reject) => {
    let options = {
      method: 'POST',
      uri: process.env.BP_URL,
      body: {
        json: true
      },
      json: true
    }
    request(options, (error, response, body) => {

      if (error) {
        return reject(error) // TODO
      }

      let bpObjArr = body.rows
      let bps = bpObjArr.map(bp => bp.owner)
      let index = bps.indexOf(bpName)

      if (index > -1) {
        let rank = index + 1
        let isRegBP = (bpObjArr[index].is_active && true) || false

        return resolve({
          rank,
          isRegBP
        })
      }

      return resolve({
        rank: -1,
        isRegBP: false
      })
    })
  })
}

module.exports = getRank
