/*
 * @Author: PaddingMe (BP: liuqiangdong)
 * @Date: 2018-09-27 00:09:59
 * @Last Modified by: PaddingMe
 * @Last Modified time: 2018-09-27 19:57:17
 */

const request = require('request')
const MAX_RANGE_BLOCK_NUM = 12 * 21

const getProducerStatus = (bpName) => {
  return Promise.all([getChainInfo(), getBpInfo(bpName)]).then(([chainInfo, bpInfo]) => {
    let isOnline = false
    if (chainInfo.headBlockNum - bpInfo.lastBlock <= MAX_RANGE_BLOCK_NUM) {
      isOnline = true
    }
    return Promise.resolve({ bpName, isOnline })
  })
}
const getChainInfo = () => {
  return new Promise((resolve, reject) => {
    return request({
      method: 'POST',
      uri: process.env.CHAIN_INFO_URL,
      json: true
    }, (error, response, body) => {
      if (error) {
        return reject(error) // TODO
      }

      let headBlockNum = body.head_block_num
      return resolve({ headBlockNum })
    })
  })
}

const getBpInfo = (bpName) => {
  return new Promise((resolve, reject) => {
    let timeStamp = new Date().getTime()
    return request({
      method: 'GET',
      uri: `${process.env.BP_INFO_URL}?bpname=${bpName}&t=${timeStamp}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        return reject(error) // TODO
      }
      let lastBlock = body.last_block
      return resolve({ lastBlock })
    })
  })
}

module.exports = getProducerStatus
