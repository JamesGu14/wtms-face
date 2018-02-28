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

function detect(imgPath) {

  return new Promise(function(resolve, reject) {

    let faceClient = new AipFaceClient(APP_NAME, APP_KEY, APP_SECRET)
    let stream = common.base64Encode(imgPath)

    var options = {
      'max_face_num': '2',
      'face_fields': 'age,gender'
    }

    faceClient.detect(stream, options).then(function(result) {

      resolve(result.result)
    }).catch(function(err) {
      console.log(err)
      reject(err)
    })
  })
}

function multiIdentify(imgPath) {

  return new Promise(function(resolve, reject) {
    
    let faceClient = new AipFaceClient(APP_NAME, APP_KEY, APP_SECRET)
    let stream = common.base64Encode(imgPath)
    
    // var options = {};
    // options["detect_top_num"] = "5";
    // options["face_fields"] = "age,beauty,expression,faceshape,gender,glasses,landmark,race,qualities";

    var options = {
      'detect_top_num': 5,
      'user_top_num': 5
    }

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
        db.child.getAll().whereIn('uid', uidArr).then(function(users) {
          
          resolve(users)
        })
        .catch(function(error) {
          console.error(error)
          reject(error)
        })
      }
    })
  })
}

function updateUser(uid, userInfo, imgPath) {

  return new Promise(function(resolve, reject) {

    let faceClient = new AipFaceClient(APP_NAME, APP_KEY, APP_SECRET)
    let stream = common.base64Encode(imgPath)
    
    var options = {
      'action_type': 'replace'
    }

    faceClient.updateUser(uid, userInfo, GROUP_ID, stream, options).then(function(result) {
      
      console.log(`Face saves succeed - ${JSON.stringify(result)}`)
      resolve(result)
    }).catch(function(err) {
      // 如果发生网络错误
      console.log(err);
      reject(err)
    })
  })
}

function getGrouplist() {

  return new Promise(function(resolve, reject) {
    
    let faceClient = new AipFaceClient(APP_NAME, APP_KEY, APP_SECRET)
    var options = {
      'start': 0,
      'num': 50
    }

    faceClient.getGrouplist(options).then(function(result) {
      resolve(result.result)
    }).catch(function(err) {
      console.log(err);
      reject(err)
    })
  })
}

function getGroupUsers(groupId) {

  return new Promise(function(resolve, reject) {

    let faceClient = new AipFaceClient(APP_NAME, APP_KEY, APP_SECRET)
    var options = {
      'start': 0,
      'num': 50
    }

    faceClient.getGroupUsers(groupId, options).then(function(result) {
      resolve(result.result)
    }).catch(function(err) {
      // 如果发生网络错误
      console.log(err);
      reject(err)
    })
  })
}

function getUsers() {

  return new Promise(function(resolve, reject) {
    
    db.child.getAll().then((faces) => {

      resolve(faces)
    }).catch(function(err) {
      console.log(err)
      reject(err)
    })
  })
}


module.exports = {
  detect: detect,
  multiIdentify: multiIdentify,
  updateUser: updateUser,
  getGrouplist: getGrouplist,
  getGroupUsers: getGroupUsers,
  getUsers: getUsers
}
