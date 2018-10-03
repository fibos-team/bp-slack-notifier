/*
 * @Author: PaddingMe (BP:liuqiangdong)
 * @Date: 2018-09-27 18:55:37
 * @Last Modified by: PaddingMe
 * @Last Modified time: 2018-10-03 18:51:54
 */

const { createServer } = require('bottender/express')
const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const compression = require('compression')
const logger = require('morgan')
const chalk = require('chalk')
const errorHandler = require('errorhandler')
const mongoose = require('mongoose')
const expressStatusMonitor = require('express-status-monitor')
const path = require('path')

dotenv.load({ path: '.env' })

const slackController = require('./controllers/slack')

const { bot, monitor } = require('./services')
const app = createServer(bot)

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('error', (err) => {
  console.error(err)
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'))
  process.exit()
})

app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0')
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }))

app.use(compression())
app.use(expressStatusMonitor())
app.use(logger('dev'))
app.disable('x-powered-by')

setInterval(() => monitor(), 30000)

app.use('/auth', slackController.getAuth)

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler())
} else {
  app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send('Server Error')
  })
}
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'))
  console.log('Press CTRL-C to stop\n')
})
