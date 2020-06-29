'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');

const API_YANDEX_KEY = 'dict.1.1.20200629T110424Z.820c51d0c3c6ce08.edfcf3c77862c014dce8158ae4581d8a842e9b30';

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/translate', async (req, res) => {
  const { query } = req;
  if (!query.text) {
    return res.status(404).send({
      status: 404,
      err: 'Нет query параметра'
    });
  }
  const {data} = await axios.get(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${API_YANDEX_KEY}&lang=en-ru&text=${query.text}`);
  
  const result = {
    text: query.text,
    translate: data.def[0].tr[0].text,
  }
  
  res.send(result);
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
