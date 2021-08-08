# LanPlay GUI

## 项目介绍

这是一个使用electron开发的LanPlay的界面程序，支持房间列表显示

程序中使用了[GitHub - spacemeowx2/switch-lan-play](https://github.com/spacemeowx2/switch-lan-play)，房间列表模块使用了[GitHub - GreatWizard/lan-play-status](https://github.com/GreatWizard/lan-play-status)

项目目前正在开发中

## 项目部署

### 加载项目依赖

```
npm install
```

### 编译调试项目
```
npm run dev
或
npm run electron:serve
```

### 编译打包项目
```
npm run electron:build
```

## 更新服务部署

### Node.js

软件使用nodejs编写了简易的更新服务器脚本，当然您也选择可以自行编写服务器程序

```javascript
//nodejs 服务端代码
const express = require('express')

var app = express()

app.get('/', (req, res) => {
    res.write(JSON.stringify({
        major_version:1.1,
        sub_version:1,
        upd_date:"20210808",
        upd_url:"https://www.baidu.com/",
        upd_level:1,
        new_server:""
    }))
    res.end()
})

app.listen(10000)
```

### JSON格式

```json
{
    "major_version":1.0, //主版本号
    "sub_version":0,  //次要版本号
    "upd_date":"20210808", //更新日期
    "upd_url":"https://www.baidu.com/", //更新包下载链接
    "upd_level":1, //是否强制更新 0否 1是
    "new_server":"" //备用更新服务器地址
}
```

> 当准备更换更新服务器时，可以在new_server中填写新服务器地址，并在新版本中修改更新模块相应代码。老版本客户端将从新服务器中接收更新信息

## 联系方式

[elton11220@foxmail.com](mailto:elton11220@foxmail.com)

![sc1](https://images.gitee.com/uploads/images/2021/0808/112631_bdec99bb_7872762.png "sc1.png")
![sc2](https://images.gitee.com/uploads/images/2021/0808/112644_93497a49_7872762.png "sc2.png")
![sc3](https://images.gitee.com/uploads/images/2021/0808/112703_e9f0874b_7872762.png "sc3.png")