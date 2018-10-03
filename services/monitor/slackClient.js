/*
 * @Author: PaddingMe (BP:liuqiangdong)
 * @Date: 2018-10-01 17:17:03
 * @Last Modified by: PaddingMe
 * @Last Modified time: 2018-10-04 01:00:36
 */

const { SlackOAuthClient } = require('messaging-api-slack')

const client = SlackOAuthClient.connect(process.env.SLACK_ACCESS_TOKEN)

exports.postMessage = ({
  channel,
  message, // String||Object (The message to be sent, can be text message or attachment message)
  accessToken
}) => {
  client.postMessage(channel, message, { accessToken, as_user: true })
}
