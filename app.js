/*
 * @Author: PaddingMe (BP:liuqiangdong)
 * @Date: 2018-09-27 18:55:37
 * @Last Modified by: PaddingMe
 * @Last Modified time: 2018-09-27 19:44:40
 */

const { SlackBot, RedisSessionStore, SlackHandler } = require('bottender')
const { createServer } = require('bottender/express')
const dotenv = require('dotenv')
dotenv.load({ path: '.env' })
const { getStatus } = require('./service')

const bot = new SlackBot({
  accessToken: process.env.SLACK_ACCESS_TOKEN,
  verificationToken: process.env.SLACK_VERFICATION_TOKEN,
  sessionStore: new RedisSessionStore()
})

const handler = new SlackHandler()
  .onEvent(async context => {
    let isReceiveText = context.event.isText
    let receiveText = context.event.text

    // TODO 注意只能 添加到 public channel
    // TODO 增加所有 BP P2P 列表
    // TODO 解决消息重复两次的问题

    // 检测第一次加入 channel 发出声音
    if (context.event._rawEvent.subtype === 'channel_join') {
      await context.sendText('Hi, 我是 Fibos BP 机器人阿东，请多指教。\r\n 请输入你的 12 位 BP 名，以便订阅通知。')

    // 用户输入了 BP 名进行验证
    } else if (isReceiveText && receiveText.length === 12) {
      let { bpName, rank, isRegBP, isOnline } = await getStatus(receiveText) //eslint-disable-line
      if (bpName && (rank > 0)) {
        context.setState({ bpName })
        await context.sendText(`订阅节点 ${bpName} 成功，当节点状态变化时，阿东会及时发送信息，请保持 slack 畅通。`)
      } else {
        await context.sendText(`未查到你的 BP 节点，请重新输入 BP 名，或联系 liuqiangdong 。`)
      }
    } else {
      await context.typing(100) // TODO 解决模拟用户输入
      await context.sendText(`I don't know what you say, please say Chinese, Man!`)
    }
  })
  .onError(async context => {
    await context.sendText('Aha, holy shit! Something wrong happened... feel free to contact liuqiangdong.')
  })

bot.onEvent(handler)
const server = createServer(bot)

server.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT} port...`)
})
