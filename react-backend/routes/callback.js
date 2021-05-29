const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const request = require('request');
var path = require('path');

router.get('/', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter
    const stateKey = 'spotify_auth_state';
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    // Env variables for Spotify API
    const redirect_uri = process.env.REDIRECT_URI;
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
  
    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
  
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
  
          const access_token = body.access_token,
              refresh_token = body.refresh_token;

          // we can also pass the token to the browser to make requests from there
          res.redirect(path.join(__dirname, 'client/build/#') +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  });

  module.exports = router;