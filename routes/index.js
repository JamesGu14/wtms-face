'use strict'

var express = require('express');
var router = express.Router();
const fs = require('fs')
const common = require('../util/common')
const baiduSDK = require('baidu-aip-sdk')
const AipSpeechClient = require("baidu-aip-sdk").speech;
var player = require('play-sound')()
const path = require('path')
const config = require('config')
const baiduConfig = config.get('baiduConfig')


/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/test', function (req, res) {

  var aipFace = new baiduSDK.face(baiduConfig.APP_NAME, baiduConfig.APP_KEY, baiduConfig.APP_SECRET)

  let imgPath = path.join(__dirname, '../faces/uploads/顾嘉晟.png')
  console.log(imgPath)
  let stream = common.base64Encode(imgPath)
  
  var options = {};
  options["max_face_num"] = "5";
  options["face_fields"] = "age,beauty,expression,faceshape,gender,glasses,landmark,race,qualities";

  aipFace.multiIdentify(baiduConfig.GROUP_ID, stream).then((result) => {
    if (result.result.length > 0) {
      
    }
  })

  res.send('123')
})

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
