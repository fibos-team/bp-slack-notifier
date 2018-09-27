/*
 * @Author: PaddingMe (BP: liuqiangdong)
 * @Date: 2018-09-27 00:03:53
 * @Last Modified by: PaddingMe
 * @Last Modified time: 2018-09-27 18:54:49
*/

const getProducerStatus = require('./produce')
const getRank = require('./rank')

/**
  * 获取节点状态
  * @param {string} bpName 节点名字
  * @returns {object} 节点状态
  * obj.bpName 节点名字
  * obj.rank 节点排名
  * obj.isRegBP 节点是否已注册或者被注销
  * obj.isOnline 出块出块服务器状态
*/
const getStatus = (bpName) => {
  return Promise.all([getRank(bpName), getProducerStatus(bpName)])
    .then(([rankObj, bpStatusObj]) => {
      let data = Object.assign(rankObj, bpStatusObj)
      return Promise.resolve(data)
    })
    .catch(error => Promise.reject(error))
}

module.exports = getStatus
