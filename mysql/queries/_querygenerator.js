'use strict'

const fs = require('fs')
const path = require('path')

var dir = './'
const templateContent = fs.readFileSync(path.join(__dirname, '_template.txt'), 'utf8')
const indexFile = path.join(__dirname, 'index.js')
const classes = []

fs.readdir(dir, function(err, files) {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  let indexContent = ''

  files.forEach(function(file, index) {
    if (!file.startsWith('_') && file != 'index.js') {

      let currentFile = path.join(__dirname, file)
      let itemName = file.substr(0, file.indexOf('.js'))
      let className = itemName.charAt(0).toUpperCase() + itemName.substr(1)
      
      if (fs.readFileSync(currentFile, 'utf8').length == 0) {
        fs.writeFileSync(currentFile, 
          templateContent.replace(/\[TABLENAME\]/g, className)
            .replace(/\[SINGLEITEM\]/g, itemName), 'utf8')
        console.log(file + ' is replaced')
      }

      indexContent = `${indexContent}const ${itemName} = require('./${itemName}')\n`
      classes.push(itemName)
      // fs.writeFileSync(currentFile, '')
    }
  })

  indexContent = `${indexContent}\n\nmodule.exports = {\n`
  classes.forEach(function(className, index) {
    indexContent = `${indexContent}  ${className} : ${className},\n`
  })
  indexContent = `${indexContent}}\n`
  fs.writeFileSync(indexFile, indexContent, 'utf8')
})
