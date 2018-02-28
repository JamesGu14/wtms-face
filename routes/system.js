'use strict'

const express = require('express')
const router = express.Router()
const multer = require('multer');
const upload = multer({ dest: 'faces/group/user' })
const uuidv1 = require('uuid/v1')
const fs = require('fs')
const db = require('../mysql/queries/index')
const faceService = require('../services/faceService')
const pinyin = require('pinyin')

router.get('/', function(req, res) {
  
  faceService.getUsers().then((users) => {

    res.render('system', {
      'title': '后台管理',
      'users': users
    })
  })
})

router.post('/face', upload.single('avatar'), function(req, res) {
  let filename = req.file.filename
  let filepath = req.file.path
  let newname = 'img-' + uuidv1() + '.png'
  let newpath = filepath.replace(filename, newname)
  let personName = req.body.personName
  let facesetTokenId = req.body.faceset

  fs.renameSync(filepath, newpath)

  faceService.detect(newpath).then((result) => {

    if (result.length !== 1) {
      res.json({
        'message': 'Nothing or more than 1 faces detected'
      })
      return
    }

    faceService.updateUser()
  })

          facepp.addFace(faceset.token, faces[0].face_token, function(success) {
            if (success) {
              // Save to DB
              mysql.Face.create({
                token: faces[0].face_token,
                title: personName,
                comment: newpath,
                facesetId: facesetTokenId
              })
            }
          })
        }
      })
    })
  })
  res.send('image received')
})

module.exports = router