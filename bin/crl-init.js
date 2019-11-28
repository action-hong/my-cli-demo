#!/usr/bin/env node

const program = require("commander");
const path = require("path");
const fs = require("fs");
const glob = require("glob");
const download = require("../lib/download");

// 遍历当前目录
const list = glob.sync("*");
const inquirer = require("inquirer");
// 这个模块可以获取node包的最新版本
const latestVersion = require("latest-version");
const generator = require('../lib/generator')
const chalk = require('chalk')
const logSymbols = require('log-symbols')
program.usage("<project-name>").parse(process.argv);

// 获取项目名称
let projectName = program.args[0];

if (!projectName) {
  // 必填的, 否则执行 --help, 显示help信息
  program.help();
  return;
}

let next;

let rootName = path.basename(process.cwd());
if (list.length) {
  if (
    list.filter(name => {
      const fileName = path.resolve(process.cwd(), path.join(".", name));
      const isDir = fs.statSync(fileName).isDirectory;
      return name.indexOf(projectName) !== -1 && isDir;
    }).length > 0
  ) {
    console.log(`项目${projectName}已经存在`);
    return;
  }
  next = Promise.resolve(projectName);
} else if (rootName === projectName) {
  // 空文件夹内, 且文件夹名与输入的项目名相同, 则直接在该目录创建
  next = inquirer
    .prompt([
      {
        name: "buildInCurrent",
        message:
          "当前目录为空, 且目录名称与项目名称相同, 是否直接在当前目录下创建新项目?",
        type: "confirm",
        default: true
      }
    ])
    .then(answer => {
      return Promise.resolve(answer.buildInCurrent ? "." : projectName);
    });
} else {
  next = Promise.resolve(projectName);
}

next && go();

function go() {
  next
    .then(projectRoot => {
      if (projectName !== ".") {
        fs.mkdirSync(projectRoot);
      }
      return download(projectRoot).then(target => {
        return {
          name: projectRoot,
          root: projectRoot,
          downloadTemp: target
        };
      });
    })
    .then(ctx => {
      return inquirer
        .prompt([
          {
            name: "projectName",
            message: "项目名称",
            default: ctx.name
          },
          {
            name: "projectVersion",
            message: "项目的版本号",
            default: "1.0.0"
          },
          {
            name: "projectDescription",
            message: "项目的简介",
            default: "A project name" + ctx.name
          }
        ])
        .then(answer => {
          return {
            ...ctx,
            metadata: {
              ...answer,
              projectHyphenName: 'project-' + answer.projectName.replace(/[.]/g, '-')
            }
          };
        });
    })
    .then(ctx => {
      // return generator(ctx.metadata, ctx.downloadTemp, ctx.metadata.projectName)
      return generator(ctx)
    })
    .then(ctx => {
      console.log(logSymbols.success, chalk.green('创建成功:)'))
      console.log(chalk.green('npm start'))
    })
    .catch(e => {
      console.error(logSymbols.error, chalk.red(`创建失败: ${e.message}`))
    });
}
