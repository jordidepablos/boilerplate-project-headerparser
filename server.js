// server.js
// where your node app starts

// init project
require('dotenv').config();

const fs = require('fs');
const http = require('http');
const https = require('https');

const privateKey = fs.existsSync('certs/privkey.pem')
                      ? fs.readFileSync('certs/privkey.pem', 'utf8')
                      : undefined;
const certificate = fs.existsSync('certs/cert.pem')
                      ? fs.readFileSync('certs/cert.pem', 'utf8')
                      : undefined;
const credentials = privateKey !== undefined && certificate !== undefined
                      ? { key: privateKey, cert: certificate }
                      : undefined;

const express = require('express');
const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api/whoami', (req, res, next) => {
  res.json({
    ipaddress: req.ip,
    language: req.headers['accept-language'],
    software: req.headers['user-agent']
  });
});

// listen for requests :)
let apiServer;
if (credentials)
  apiServer = https.createServer(credentials, app);
else
  apiServer = http.createServer(app);

apiServer.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + apiServer.address().port);
});

/*
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
*/