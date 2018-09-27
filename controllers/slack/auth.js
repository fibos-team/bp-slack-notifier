/*
 * @Author: PaddingMe (BP: liuqiangdong)
 * @Date: 2018-09-28 02:32:02
 * @Last Modified by: PaddingMe
 * @Last Modified time: 2018-09-28 02:38:30
 */

const request = require('request')
const slackAccessUrl = 'https://slack.com/api/oauth.access'
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
  request.post(slackAccessUrl, data, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // TODO Get an auth token (and store the team_id / token)
      // storage.setItemSync(JSON.parse(body).team_id, JSON.parse(body).access_token);

      res.sendStatus(200)

      // TODO Show a nicer web page or redirect to Slack, instead of just giving 200 in reality!
      // res.redirect(__dirname + "/public/success.html");
    } else {
      res.sendStatus(401)
    }
  })
}

module.exports = getAuth
