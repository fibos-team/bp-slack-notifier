/*
 * @Author: PaddingMe (BP: liuqiangdong)
 * @Date: 2018-09-28 02:32:02
 * @Last Modified by: PaddingMe
 * @Last Modified time: 2018-10-03 14:18:35
 */

const request = require('request')
const SLACK_ACCESS_URL = 'https://slack.com/api/oauth.access'
const Slack = require('../../models/Slack')
const getAuth = (req, res) => {
  if (!req.query.code) { // access denied
    console.log('Access denied')
    return false
  }
  const data = {
    form: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: req.query.code
    }
  }
  request.post(SLACK_ACCESS_URL, data, async (error, response, body) => {
    if (!error && response.statusCode === 200) {
      let obj = JSON.parse(body)
      const slack = new Slack({
        teamId: obj.team_id,
        accessToken: obj.access_token
      })

      let existingTeam = await Slack.findOne({ teamId: obj.team_id }).exec()

      if (!existingTeam) {
        await slack.save()
      }

      return res.send('授权成功，打开 slack 邀请 fibosbot 进入你的 public channel。')
      // TODO res.redirect(__dirname + "/public/success.html");
    } else {
      res.sendStatus(401)
    }
  })
}

module.exports = getAuth
