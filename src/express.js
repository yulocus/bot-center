'use strict'

const bodyParser = require('body-parser'),
  express = require('express'),
  crypto = require('crypto'),
  path = require('path'),
  config = require('config'),
  globby = require('globby')

var app = express()
app.set('port', process.env.PORT || 5000)
app.set('view engine', 'ejs')
app.use(bodyParser.json({ verify: verifyRequestSignature }))
app.use(express.static('./public'))

globby.sync(['./src/routes/**/*.js']).forEach(function (routePath) {
  require(path.resolve(routePath))(app)
})
/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature (req, res, buf) {
  var signature = req.headers['x-hub-signature']

  const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
    process.env.MESSENGER_APP_SECRET :
    config.get('appSecret')

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.")
  } else {
    var elements = signature.split('=')
    var method = elements[0]
    var signatureHash = elements[1]

    var expectedHash = crypto.createHmac('sha1', APP_SECRET)
      .update(buf)
      .digest('hex')

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.")
    }
  }
}

module.exports = app
