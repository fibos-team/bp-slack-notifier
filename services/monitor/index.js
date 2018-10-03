/*
 * @Author: PaddingMe (BP:liuqiangdong)
 * @Date: 2018-10-03 18:21:12
 * @Last Modified by: PaddingMe
 * @Last Modified time: 2018-10-04 01:04:44
 */

const queryStatus = require('./query')
const { postMessage } = require('./slackClient')

const monitor = async () => {
  let bpStatuses = await queryStatus()
  bpStatuses.map(bp => {
    if (!bp.sendMsg || !bp.subscribers) return false
    return bp.subscribers.map(slacker => postMessage({
      channel: slacker.channelId,
      message: bp.sendMsg,
      accessToken: slacker.accessToken
    }))
  })
}

module.exports = monitor
