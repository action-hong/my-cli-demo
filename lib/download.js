// 从远程下载模板

const download = require('download-git-repo')
const path = require('path')
const ora = require('ora')
// 模板所在的地址, 这个和在github上选中clone的地址不一样哦, 要注意!
// github.com:username/repo-name#branch-name
const url = 'github.com:action-hong/my-template#master'

module.exports = function (target) {
  target = path.join(target || '.', '.download-temp')
  return new Promise((resolve, reject) => {
    const spinner = ora(`正在下载项目模板, 原地址: ${url}`)
    spinner.start()
    download(url, target, { clone: true }, (err) => {
      if (err) {
        spinner.fail()
        reject(err)
      } else {
        spinner.succeed()
        // 下载的模板存放在一个临时路径下, 下载完成后, 可以向下通知这个临时路径
        resolve(target)
      }
    })
  })
}