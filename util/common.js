'use strict'

const fs = require('fs');
const _ = require('lodash')

// function to encode file data to base64 encoded string
function base64Encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

function clearDir(folderPath, noDeleteFiles) {

  var files = fs.readdirSync(folderPath); // Read dir
  files.forEach(function (file) {
    if (noDeleteFiles.indexOf(file) < 0) {
      var stats = fs.statSync(folderPath + '/' + file);
      if (stats.isDirectory()) {
        // Do not clear for now
        // clearDir(folderPath + '/' + file);
      } else {
        fs.unlinkSync(folderPath + '/' + file);
      }
    }
  })
  console.log(`Deleted all existing files at ${folderPath}`)
}

function getRandomFromList (list) {

  return list[_.random(0, list.length - 1)]
}


module.exports = {
  base64Encode,
  clearDir,
  getRandomFromList
}