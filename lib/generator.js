const metalsmith = require('metalsmith')
const handlebars = require('handlebars')
const rm = require('rimraf').sync
const fs = require('fs')
const path = require('path')
module.exports = function (ctx) {
  const metadata = ctx.metadata
  const src = ctx.downloadTemp
  const dest = './' + ctx.root
  if (!src) {
    return Promise.reject(new Error('无效的source:' + src))
  }

  return new Promise((resolve, reject) => {
    // 项目里有用到很多 style = {{  }} 之类的, 不加以处理也会被认为是模板
    // 就没有类似include的 只替换传进去的吗?

    metalsmith(process.cwd())
      .metadata(metadata)
      .clean(false)
      .source(src)
      .destination(dest)
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata()

        // 替换
        Object.keys(files).forEach(fileName => {
          const t = files[fileName].contents.toString()
          files[fileName].contents = Buffer.from(handlebars.compile(t, {
            knownHelpersOnly: true
          })(meta))
        })

        done()
      }).build(err => {
        // 读取 package.json, project.json 更换name
        let srcPackage = fs.readFileSync(path.join(src, 'package.json'), {
          encoding: 'utf8'
        })
        srcPackage = JSON.parse(srcPackage)
        srcPackage.name = metadata.projectHyphenName
        fs.writeFileSync(path.join(dest, 'package.json'), JSON.stringify(srcPackage))
    
        let srcProject = fs.readFileSync(path.join(src, 'project.json'), {
          encoding: 'utf8'
        })
        srcProject = JSON.parse(srcProject)
        srcProject.package_path = metadata.projectName
        fs.writeFileSync(path.join(dest, 'project.json'), JSON.stringify(srcProject))
        rm(src)
        err ? reject(err) : resolve(ctx)
      })
  })
}