## 使用

```bash

# 链接到全局(以后如果该模块发布出去了, 直接npm install <模块> -g 就好了)
npm link

cd xx/米家插件项目/projects
crl init <项目名称>
```

## 模板的目录结构

```
│  custom.js(做一些自定义的操作, 当前针对android平台对所有Text添加默认字体)                 
│  index.ios.js(ios入口)
│  index.js(android入口)
│  package.json
│  project.json
│  ratio.js(尺寸适配相关)
│  README.md
│  router.js(路由声明)
│  style.js(通用样式文件)
│  
├─i18n(语言适配, 如果要加其他语言, 自行添加并在index.js引入)
│      en.js
│      index.js(导出所有语言)
│      ko.js
│      zh-hk.js
│      zh-tw.js
│      zh.js
│      
├─page(页面文件夹, 需要的可自行再添加)
│      CommonSetting.js(通用设置页面, 已处理好米家规范内所需添加的内容, 以及固件升级的提示等)
│      MainPage.js(首页)
│      
├─resources(资源目录, 存放图片等)
│  └─raw(存放一些中英文的用户协议, 隐私协议, 新建项目后, 需要替换好这些内容)
│          agreement-zh.html
│          agreement.html
│          privacy-zh.html
│          privacy.html
│          
└─util
        LocalizedStrings.js(语言适配功能模块, 直接从米家demo项目中抽出来的, 无需修改)
        privacy.js(处理隐私等相关内容首次进入弹窗的模块)
```

## 注意

### 关于隐私协议相关的

- 模板项目中, 默认引入了中英文的隐私, 用户协议, 可见`i18/zh.js`, `i18n/en.js`, 新项目只需替换好`resource/raw`下的相关文件, 如若需要其他语言的隐私协议, 可按照`zh.js`的写法引入相应文件
- 已经处理好撤销授权后, 自动退出插件
- 已经处理好首次进入插件弹出授权提示及通用界面内引入隐私政策(**参加`i18/zh.js`, `i18n/en.js`**的内容)
```
// zh.js
export default {
  agreement: require('../resources/raw/agreement-zh.html'), // 用户协议
  privacy: require('../resources/raw/privacy-zh.html'), // 隐私政策
  hello: '你好'
}
```

这里要注意的是, 项目组引用隐私的地方都是按`agreement`, `privacy` 这两个key来引用的, 所有不要去删除或修改

### 关于语言适配

```
// 引入
import i18n from 'xxx/xx/i18n'

// 使用, 可参加MainPage中的使用
i18n.hello
```

[更多的语言模板用法点击查看](https://github.com/stefalda/ReactNativeLocalization)

### 关于自定义设置

在`CommonSetting.js`中添加需要的设置项, 注意要符合米家规范
