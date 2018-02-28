'use strict'

var express = require('express')
var router = express.Router()
const path = require('path')
const faceService = require('../services/faceService')
const voiceService = require('../services/voiceService')
const multer = require('multer');
const upload = multer({
  dest: 'faces/uploads'
})
const uuidv1 = require('uuid/v1')
const fs = require('fs')

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Express'
  })
})

router.post('/image', upload.single('file'), function (req, res) {
  let filename = req.file.filename
  let filepath = req.file.path
  let newname = 'img-' + uuidv1() + '.png'
  let newpath = filepath.replace(filename, newname)

  fs.rename(filepath, newpath, function (err) {
    if (err) {
      throw err
    }
    faceService.multiIdentify(newpath).then(names => voiceService.composeGreeting(names)).then(content => voiceService.text2Audio(content)).catch((err) => {
      if (err) {
        console.log(err)
      }

      res.json({
        status: 'success'
      })
    })
  })
})

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