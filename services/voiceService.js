'use strict'

const AipSpeechClient = require("baidu-aip-sdk").speech
const config = require('config')
const baiduConfig = config.get('baiduConfig')
const APP_ID = baiduConfig.APP_ID
const APP_KEY = baiduConfig.APP_KEY
const APP_SECRET = baiduConfig.APP_SECRET
const Promise = require('bluebird')
const path = require('path')
const fs = require('fs')
var player = require('play-sound')()

function composeGreeting(names) {
  
  return new Promise(function(resolve, reject) {

    if (names === null || names.length <= 0) {
      reject()
    }
    
    let content = ''
    if (names.length > 1) {
      content = `早上好，${names.join('，')} ${names.length}位小朋友，你们早上好呀`
    } else {
      content = `早上好，${names.join('，')} 小朋友，你长得真好看`
    }
    
    resolve(content)
  })
}

function text2Audio(content) {

  return new Promise(function(resolve, reject) {

    let speechClient = new AipSpeechClient(APP_ID, APP_KEY, APP_SECRET)
    let audioPath = path.join(__dirname, '../faces/audio.mp3')
    // 语音合成
    speechClient.text2audio(content).then(function (result) {
      if (result.data) {
        fs.writeFile(audioPath, result.data, function () {
          // $ mplayer foo.mp3 
          player.play(audioPath, function (err) {
            if (err) {
              reject(err)
            }
            resolve()
          })
        })
      } else {
        // 服务发生错误
        console.log(result)
        reject()
      }
    }, function (e) {
      // 发生网络错误
      console.log(e)
      reject(e)
    })
  })
}

module.exports = {
  composeGreeting: composeGreeting,
  text2Audio: text2Audio
}
