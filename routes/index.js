'use strict'

var express = require('express');
var router = express.Router();
const path = require('path')
const faceService = require('../services/faceService')
const voiceService = require('../services/voiceService')

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/test', function (req, res) {

  let imgPath = path.join(__dirname, '../faces/uploads/jk.jpg')

  faceService.multiIdentify(imgPath).then(names => voiceService.composeGreeting(names)).then(content => voiceService.text2Audio(content)).catch((err) => {
    if (err) {
      console.log(err)
    }
  })
  res.send('123')
})

module.exports = router
