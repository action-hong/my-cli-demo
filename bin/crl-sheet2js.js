const path = require('path')
const fs = require('fs')
const program = require('commander')
const XLSX = require('xlsx')
program.parse(process.argv)

let sheetPath = program.args[0] || 'i18n.xlsx'

if (!fs.existsSync(sheetPath)) {
  throw new Error(`File ${sheetPath} not found`)
}

const workbook = XLSX.readFile(sheetPath)
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const keys = XLSX.utils.sheet_to_json(sheet, { header: 1 })

// console.log(keys)

const res = {}

for (let i = 1; i < keys[0].length; i++) {
  const code = keys[0][i]
  const obj = {}
  for (let j = 1; j < keys.length; j++) {
    const key = keys[j][0]
    const value = keys[j][i]
    if (value) {
      obj[key] = value
    }
  }
  res[code] = obj
}

// console.log(res)

// 写入
Object.keys(res).forEach(code => {
  const obj = res[code]
  const filePath = path.resolve(process.cwd(), `${code}.js`)
  console.log('==> write file', filePath)
  fs.writeFileSync(filePath, `export default ${JSON.stringify(obj, null, 2)}`)
})