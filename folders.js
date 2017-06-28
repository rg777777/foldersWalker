const fs = require('fs')
const Path = require('path')
const Promise = require('bluebird')

const fileCallback = (path) => {
  return new Promise((resolve, reject) => {
    console.log('+++'.repeat(1).repeat(5), path)
    return resolve(path)
  })
}

const folerCallback = (path) => {
  return new Promise((resolve, reject) => {
    console.log('FOLDER \n', fs.readdirSync(path))
    return resolve(path)
  })
}

const isDirectory = (path) => {
  return !!fs.statSync(Path.resolve(path)).isDirectory()
}

const walker = (dir, dircb, filecb) => {
  return new Promise((resolve, reject) => {
    const files = fs.readdirSync(dir)
    return dircb(dir).then(() => {
      return Promise.map(files, file => {
        const curentPath = Path.join(dir, file)
        if (isDirectory(curentPath)) {
          return walker(curentPath, dircb, filecb)
        } else {
          return resolve(filecb(curentPath))
        }
      })
    })
  })
}
walker('../../../Downloads/testfolder', folerCallback, fileCallback)
