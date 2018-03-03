'use strict'

const path = require('path')
const fs = require('fs')
const Async = require('async')
var express = require('express')
var router = express.Router()
const faceService = require('../services/faceService')
const voiceService = require('../services/voiceService')
const uuidv1 = require('uuid/v1')
const multer = require('multer');
const upload = multer({
  dest: 'public/faces/uploads'
})

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Express'
  })
})

router.post('/detect', upload.single('file'), function (req, res) {

  var maxSize = 0.3 * 1000 * 1000 // 300kb max
  if (req.file.size > maxSize) {
    return res.send('上传失败，文件超过2MB')
  }

  let filename = req.file.filename
  let filepath = req.file.path
  let newname = 'img-' + uuidv1() + '.png'
  let newpath = filepath.replace(filename, newname)

  fs.rename(filepath, newpath, function (err) {
    if (err) {
      throw err
    }
    faceService.multiIdentify(newpath)
      .then(users => voiceService.filterRecentGreeted(users))
      .then(users => voiceService.composeGreeting(users))
      .then(userContentCombo => voiceService.queueAudioMessage(userContentCombo.content, userContentCombo.users))
      .then(() => {
        return res.json({
          status: 'success'
        })
      })
      .catch((err) => {
        if (err) {
          console.log(err)
        }

        return res.send('失败')
      })
  })
})

module.exports = router