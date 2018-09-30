const { SlackBot, MongoSessionStore, SlackHandler } = require('bottender')
const getStatus = require('./status')

// TODO take a test
// OAUTH:teamId & acess_token => persistence
// mapTeamToAccessToken getAccessTokenByTeamId
const mapTeamToAccessToken = teamId => {
  switch (teamId) {
    case 'TD2HPMCTU':
      return process.env.SLACK_ACCESS_TOKEN_2
    case 'T9NJM4GBF':
      return process.env.SLACK_ACCESS_TOKEN_1
    default:
      return process.env.SLACK_ACCESS_TOKEN_1
  }
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
    let token = mapTeamToAccessToken(teamId)

    // TODO 注意只能 添加到 public channel
    // TODO 增加所有 BP P2P 列表
    // TODO 解决消息重复两次的问题

    // 检测第一次加入 channel 发出声音
    if (context.event._rawEvent.subtype === 'channel_join') {
      await context.sendText('Hi, 我是 Fibos BP 机器人阿东，请多指教。\r\n 请输入你的 12 位 BP 名，以便订阅通知。', { token })

    // 用户输入了 BP 名进行验证
    } else if (isReceiveText && receiveText.length === 12) {
      let { bpName, rank, isRegBP, isOnline } = await getStatus(receiveText) //eslint-disable-line
      if (bpName && (rank > 0)) {
        context.setState({ bpName })
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
    let token = mapTeamToAccessToken(teamId)
    await context.sendText('Aha, holy shit! Something wrong happened... feel free to contact liuqiangdong.', { token })
  })

bot.onEvent(handler)

module.exports = bot
