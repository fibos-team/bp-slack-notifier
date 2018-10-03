/*
 * @Author: PaddingMe (BP:liuqiangdong)
 * @Date: 2018-10-03 15:11:14
 * @Last Modified by: PaddingMe
 * @Last Modified time: 2018-10-04 01:11:41
 */

const BP = require('../../models/BP')
const getStatus = require('../status')

const SUPER_BP_RANK = 21

const queryStatus = async () => {
  const bps = await BP.find().exec()
  return Promise.all(bps.map(async (bp) => {
    let { bpName, rank, isRegBP, isOnline } = await getStatus(bp.name)
    let prevStatus = bp.status[bp.status.length - 1] || {}
    let sendMsg = ''

    // 排名更新了
    if (rank !== prevStatus.rank) {
      sendMsg = sendMsg + `${bpName} 当前排名从 ${prevStatus.rank} 变化为 ${rank}\r\n`
    }

    // BP 被注销了
    if (!isRegBP && (isRegBP !== prevStatus.isRegBP)) {
      sendMsg = sendMsg + `${bpName} 节点已被注销（unreg）了。\r\n`
    }

    // 注册为 BP
    if (!isRegBP && (isRegBP !== prevStatus.isRegBP)) {
      sendMsg = `sendMsg + ${bpName} 注册为 BP 节点。\r\n`
    }

    let currentProduerStatus = isOnline && isRegBP && (rank >= SUPER_BP_RANK)
    let prevProducerStatus = prevStatus.isOnline && prevStatus.isRegBP && (prevStatus.rank >= SUPER_BP_RANK)

    // 出块正常了
    if ((rank >= SUPER_BP_RANK) && currentProduerStatus && (currentProduerStatus !== prevProducerStatus)) {
      sendMsg = sendMsg + `${bpName} 节点出块服务器已恢复，可正常出块。\r\n`
    }

    // 出块有问题
    if ((rank >= SUPER_BP_RANK) && !currentProduerStatus && (currentProduerStatus !== prevProducerStatus)) {
      sendMsg = sendMsg + `${bpName} 节点出块服务器出现问题，请注意排查。\r\n`
    }

    sendMsg = sendMsg + `${bpName} 测试节点出块服务器出现问题，请注意排查。\r\n`

    if (sendMsg) {
      let status = {
        rank: rank, // BP 节点排名
        isRegBP: isRegBP, // BP 节点是否注册或被注销
        isOnline: isOnline, // BP 出块服务器是否正常在线
        updated: new Date().getTime()
      }
      if (!bp.status) {
        bp.status = [status]
      } else {
        bp.status.push(status)
      }
      bp.save()
      let subscribers = JSON.parse(JSON.stringify(bp.subscribers))
      return Promise.resolve({
        name: bp.name,
        subscribers: subscribers,
        sendMsg
      })
    }
  }))
}

module.exports = queryStatus
