'use strict'

const AipSpeechClient = require("baidu-aip-sdk").speech
const config = require('config')
const baiduConfig = config.get('baiduConfig')
const programConfig = config.get('programConfig')
const APP_ID = baiduConfig.APP_ID
const APP_KEY = baiduConfig.APP_KEY
const APP_SECRET = baiduConfig.APP_SECRET
const Promise = require('bluebird')
const path = require('path')
const fs = require('fs')
const knex = require('../mysql/connection.js')
const common = require('../util/common')
const moment = require('moment')
const _ = require('lodash')
const uuidv1 = require('uuid/v1')

// Query db to check if any queue message
function queryQueueAudio() {

  return new Promise((resolve, reject) => {

    knex.from('greetingQueue').select('*').where({
        played: false
      }).orderBy('id', 'desc').limit(1)
      .then((greeting) => {

        if (greeting && greeting.length === 1) {

          text2Audio(greeting[0].message).then((audioPath) => {
            knex.from('greetingQueue').where({
                id: greeting[0].id
              }).update({
                played: true,
                playedAt: new Date()
              })
              .then(() => {
                resolve(audioPath)
              })
          })
        } else {
          reject('No unplayed messages')
        }
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

function filterRecentGreeted(users) {

  return new Promise((resolve, reject) => {

    if (users === null || users.length <= 0) {
      reject('No face found from DB')
    }

    let childIdArr = _.map(users, 'id')

    knex.from('greetingQueue').whereIn('childId', childIdArr)
      .andWhere('createdAt', '>', moment().subtract(programConfig.recoInterval, 'seconds').format('YYYY-MM-DD HH:mm:ss')).then((result) => {

        let recentPlayedChildId = _.map(result, 'childId')

        resolve(_.reject(users, function (o) {
          return recentPlayedChildId.indexOf(o.id) >= 0
        }))
      })
  })
}

// TODO: 随机生成问候内容
function composeGreeting(users) {

  return new Promise(function (resolve, reject) {

    if (users === null || users.length <= 0) {
      reject('No users not greeted lately')
    }

    let names = _.map(users, 'fullName')

    knex('greetingTemplate').select('*').then(results => {

      let content = common.getRandomFromList(results).template
      
      if (users.length > 1) {
        content = content.replace('{name}', `，${names.join('，')} ${names.length}`)
      } else {
        content = content.replace('{name}', `，${names} `)
      }
  
      resolve({
        content: content,
        users: users
      })
    }).catch(err => {
      console.log(err)
      return reject(err)
    })
  })
}

function queueAudioMessage(content, users) {

  return new Promise((resolve, reject) => {

    let newUsers = []
    users.forEach(u => {
      newUsers.push({
        message: content,
        createdAt: new Date(),
        childId: u.id,
        played: true
      })
    })
    newUsers[0].played = false

    knex('greetingQueue').insert(newUsers).then(() => {
      resolve()
    }).catch((err) => {
      reject(err)
    })
  })
}

// BAIDU API compose audio
function text2Audio(content) {

  return new Promise(function (resolve, reject) {

    let speechClient = new AipSpeechClient(APP_ID, APP_KEY, APP_SECRET)
    let audioPath = path.join(__dirname, '../public/faces/audio/')
    let audioName = `audio-${uuidv1()}.mp3`
    let newAudioPath = path.join(__dirname, `../public/faces/audio/${audioName}`)
    let returnPath = `/faces/audio/${audioName}`

    // Remove audio from last time
    common.clearDir(audioPath, [])
    
    // 语音合成
    speechClient.text2audio(content, {spd: 5, per: 4}).then(function (result) {
      if (result.data) {
        fs.writeFile(newAudioPath, result.data, function () {
          resolve(returnPath)
        })
      } else {
        // 服务发生错误
        console.log('Compose audio failed')
        reject()
      }
    }).catch(function (e) {
      // 发生网络错误
      console.log(e)
      reject(e)
    })
  })
}

module.exports = {
  composeGreeting: composeGreeting,
  text2Audio: text2Audio,
  queryQueueAudio: queryQueueAudio,
  queueAudioMessage: queueAudioMessage,
  filterRecentGreeted: filterRecentGreeted
}