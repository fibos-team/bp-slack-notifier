/*
 * @Author: PaddingMe (BP:liuqiangdong)
 * @Date: 2018-10-01 17:12:35
 * @Last Modified by: PaddingMe
 * @Last Modified time: 2018-10-03 15:27:47
 */

const mongoose = require('mongoose')

/**
 * 这里 watchers 和 Slack Model 数据耦合了，但 oAuth 在先，
 * 无法直接做到 bp 与 slack 用户的一对多
 * 另外需要考虑 一个 workspace **多个 channel 订阅** 一个 BP，
 * 所以暂且这样设计，虽然数据耦合但逻辑清晰。
 * 发送 BP 监控数据给对应的 slack channel 只需要读这一张表即可。
 */
const bpSchema = new mongoose.Schema({
  name: String, // 节点12个字节名称
  subscribers: [{
    teamId: String, // 订阅的 slack workspace ID
    channelId: String, // 订阅的 slack workspace channel ID
    accessToken: String // 订阅的 slack workspace 对应的 oAuth accesstoken
  }],
  status: [{
    rank: Number, // BP 节点排名
    isRegBP: Boolean, // BP 节点是否注册或被注销
    isOnline: Boolean, // BP 出块服务器是否正常在线
    updated: { type: Date, default: Date.now } // BP 状态更新时间
  }]
})

const BP = mongoose.model('BP', bpSchema)

module.exports = BP
