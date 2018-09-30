/*
 * @Author: PaddingMe (BP:liuqiangdong)
 * @Date: 2018-09-30 20:37:51
 * @Last Modified by: PaddingMe
 * @Last Modified time: 2018-09-30 20:37:51
 */

const mongoose = require('mongoose')

const slackSchema = new mongoose.Schema({
  teamId: String, // slack 授权的 workspace 的 team_id
  accessToken: String // slack 授权的 workspace 的 access_token
}, { timestamps: true })

const Slack = mongoose.model('Slack', slackSchema)

module.exports = Slack
