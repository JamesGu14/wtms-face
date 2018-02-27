'use strict'

const AipFaceClient = require('baidu-aip-sdk').face
const config = require('config')
const baiduConfig = config.get('baiduConfig')
const APP_NAME = baiduConfig.APP_NAME
const APP_KEY = baiduConfig.APP_KEY
const APP_SECRET = baiduConfig.APP_SECRET
const GROUP_ID = baiduConfig.GROUP_ID
const Promise = require('bluebird')
const common = require('../util/common')
const _ = require('lodash')
const db = require('../mysql/queries/index')


function multiIdentify(imgPath) {

  return new Promise(function(resolve, reject) {
    
    var faceClient = new AipFaceClient(APP_NAME, APP_KEY, APP_SECRET)

    console.log(imgPath)
    let stream = common.base64Encode(imgPath)
    
    // var options = {};
    // options["detect_top_num"] = "5";
    // options["face_fields"] = "age,beauty,expression,faceshape,gender,glasses,landmark,race,qualities";

    var options = {};
    options["detect_top_num"] = "5";
    options["user_top_num"] = "5";

    faceClient.multiIdentify(GROUP_ID, stream, options).then((result) => {
      if (result.result.length > 0) {
        let faces = _.filter(result.result, function(u) {
          return u.scores.length > 0 && u.scores[0] > 80
        })

        let uids = _.map(faces, function(f) {
          return _.pick(f, ['uid']);
        });

        let uidArr = []
        uids.forEach(i => {
          uidArr.push(i.uid)
        })

        // TODO: get kids' names from DB by uid
        db.child.getAll().whereIn('uid', uidArr).then(function(rows) {
          let names = []
          rows.forEach(r => {
            names.push(r.fullName)
          })

          resolve(names)
        })
        .catch(function(error) {
          console.error(error)
          reject(error)
        })
      }
    })
  })
}

module.exports = {
  multiIdentify: multiIdentify
}