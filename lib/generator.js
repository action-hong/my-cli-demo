const metalsmith = require('metalsmith')
const handlebars = require('handlebars')
const rm = require('rimraf').sync

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

        Object.keys(files).forEach(fileName => {
          const t = files[fileName].contents.toString()
          files[fileName].contents = Buffer.from(handlebars.compile(t, {
            knownHelpersOnly: true
          })(meta))
        })
        done()
      }).build(err => {
        rm(src)
        err ? reject(err) : resolve()
      })
  })
}