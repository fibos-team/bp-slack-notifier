/*
 * @Author: PaddingMe (BP:liuqiangdong)
 * @Date: 2018-09-30 20:38:48
 * @Last Modified by: PaddingMe
 * @Last Modified time: 2018-10-03 14:25:35
 */

const { SlackBot, MongoSessionStore, SlackHandler } = require('bottender')
const getStatus = require('./status')
const Slack = require('../models/Slack')
const BP = require('../models/BP')

const mapTeamToAccessToken = async (teamId) => {
  const teamObj = await Slack.findOne({ teamId }).exec()
  return teamObj.accessToken
}

const bot = new SlackBot({
  // accessToken: process.env.SLACK_ACCESS_TOKEN,
  mapTeamToAccessToken,
  verificationToken: process.env.SLACK_VERFICATION_TOKEN,
  sessionStore: new MongoSessionStore(process.env.MONGODB_URI)
})

const handler = new SlackHandler()
  .onText(/yo/i, async context => {
    await context.sendText('Hi there!')
  })
  .onEvent(async context => {
    let isReceiveText = context.event.isText
    let receiveText = context.event.text

    let teamId = context.session.user.team_id
    let channelId = context.session.channel.id
    let token = await mapTeamToAccessToken(teamId)

    let subscriberObj = {
      teamId,
      channelId,
      accessToken: token
    }
    // 检测第一次加入 channel 发出声音
    if (context.event._rawEvent.subtype === 'channel_join') {
      await context.sendText('Hi, 我是 Fibos BP 机器人阿东，请多指教。\r\n 请输入你的 12 位 BP 名，以便订阅通知。', { token })

    // 用户输入了 BP 名进行验证
    } else if (isReceiveText && receiveText.length === 12) {
      context.sendText('正在查询 BP 节点信息，  请稍后......', { token })
      let { bpName, rank, isRegBP, isOnline } = await getStatus(receiveText) //eslint-disable-line

      if (bpName && (rank > 0)) {
        // 查询 该 BP & teamId & channelId 是否已经订阅
        let existingBP = await BP.findOne({ name: bpName })

        let existingSubscriber = await BP.findOne({
          name: bpName,
          subscribers: {
            $elemMatch: subscriberObj
          }
        }).exec()

        // 第一次订阅 BP,
        if (!existingBP) {
          let bp = new BP({
            name: bpName,
            subscribers: [subscriberObj]
          })
          await bp.save()
        }

        // 已经有 user 订阅该 BP
        if (existingBP && !existingSubscriber) {
          existingBP.subscribers.push(subscriberObj)
          await existingBP.save()
        }

        // 已经订阅了
        if (existingBP && existingSubscriber) {
          await context.sendText(`已经订阅节点 ${bpName}。`, { token })
          return false
        }

        await context.sendText(`订阅节点 ${bpName} 成功，当节点状态变化时，阿东会及时发送信息，请保持 slack 畅通。`, { token })
      } else {
        await context.sendText(`未查到你的 BP 节点，请重新输入 BP 名，或联系 liuqiangdong 。`, { token })
      }
    } else {
      await context.typing(100) // TODO 解决模拟用户输入
      await context.sendText(`I don't know what you say, please say Chinese, Man!`, { token })
    }
  })
  .onError(async context => {
    let teamId = context.session.user.team_id
    let token = await mapTeamToAccessToken(teamId)
    await context.sendText('Aha, holy shit! Something wrong happened... feel free to contact liuqiangdong.', { token })
  })

bot.onEvent(handler)

module.exports = bot
