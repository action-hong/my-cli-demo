#!/usr/bin/env node

const program = require('commander')

program.version('1.0.0')
      .usage('<command> [项目名称]')
      .command('init', 'init new project')
      .command('i18n <locale path> [ignore file]', 'generate i18n excel')
      .command('sheet2js <sheet path>', 'i18n sheet to js file')
      .parse(process.argv)

