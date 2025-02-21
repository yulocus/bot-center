'use strict'

module.exports.linkAccount = function (req, res) {
  var accountLinkingToken = req.query.account_linking_token
  var redirectURI = req.query.redirect_uri

  // Authorization Code should be generated per user by the developer. This will
  // be passed to the Account Linking callback.
  var authCode = '1234567890'

  // Redirect users to this URI on successful login
  var redirectURISuccess = redirectURI + '&authorization_code=' + authCode

  res.render('authorize', {
    accountLinkingToken: accountLinkingToken,
    redirectURI: redirectURI,
    redirectURISuccess: redirectURISuccess
  })
}
