const fs = require('fs-extra')
const Path = require('path')
const Promise = require('bluebird')

const fileCallback = (src, dest) => {
  if (!fs.pathExistsSync(src)) {
    return Promise.reject('File dont exist')
  }
  console.log('src, dest', `\n ${src} \n ${dest}`)
  return fs.copy(src, dest)
}

const createFolder = (src, dest) => {
  return fs.ensureDir(dest)
}

const isDirectory = (path) => {
  return !!fs.statSync(Path.resolve(path)).isDirectory()
}

const walker = (srcDir, destDir, dircb, filecb) => {
  return Promise.coroutine(function * () {
    if (!fs.pathExistsSync(srcDir)) {
      return Promise.reject('srcDir dont exist')
    }
    const files = fs.readdirSync(srcDir)
    yield dircb(srcDir, destDir)
    return Promise.map(files, file => {
      const curentOldPath = Path.join(srcDir, file)
      const curentNewPath = Path.join(destDir, file)
      if (isDirectory(curentOldPath)) {
        return walker(curentOldPath, curentNewPath, dircb, filecb)
      } else {
        return filecb(curentOldPath, curentNewPath)
      }
    })
  })().catch(err => {
    console.log(err)
  })
}
walker('../../../Downloads/testfolder', '../../../Downloads/testfolder1', createFolder, fileCallback)
