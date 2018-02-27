'use strict'

var express = require('express');
var router = express.Router();
const fs = require('fs')
const common = require('../util/common')

var player = require('play-sound')()
const path = require('path')
const config = require('config')
const baiduConfig = config.get('baiduConfig')

const db = require('../mysql/queries/index')
const knex = require('../mysql/connection')
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
    if (err) console.log(err)
  })
  res.send('123')
})

// Compose audios and play
router.get('/s', function (req, res) {

  var speechClient = new AipSpeechClient(baiduConfig.APP_ID, baiduConfig.APP_KEY, baiduConfig.APP_SECRET)
  let audioPath = path.join(__dirname, '../faces/audio.mp3')
  // 语音合成
  speechClient.text2audio('Hi James，你今天看起来气色不错啊').then(function (result) {
    if (result.data) {
      fs.writeFile(audioPath, result.data, function () {
        // $ mplayer foo.mp3 
        player.play(audioPath, function (err) {
          if (err) throw err
        })
      });
    } else {
      // 服务发生错误
      console.log(result)
    }
  }, function (e) {
    // 发生网络错误
    console.log(e)
  });
  res.send('123')
})

module.exports = router
