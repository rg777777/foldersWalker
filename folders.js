const fs = require('fs')
const Path = require('path')

const callback = (aaa) => {
  console.log('----'.repeat(20), aaa)
  return aaa
}

const isDirectory = (path) => {
  return !!fs.statSync(Path.resolve(path)).isDirectory()
}

const walker = (dir, cb) => {
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const curentPath = Path.join(dir, file)
    if (isDirectory(curentPath)) {
      return walker(curentPath, cb)
    } else {
      return cb(curentPath)
    }
  })
}

console.log(walker('../../../Downloads/testfolder', callback))
