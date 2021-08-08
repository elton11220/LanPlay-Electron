# LanPlay GUI

## Introduction

This is a lanplay GUI developed with electron, which supports room list display

[GitHub - spacemeowx2/switch-lan-play](https://github.com/spacemeowx2/switch-lan-play) is used in the program，and [GitHub - GreatWizard/lan-play-status](https://github.com/GreatWizard/lan-play-status) is used in the room list module

The project is currently under development

## Build Setup

### Install dependencies

```
npm install
```

### Serve with hot reload
```
npm run dev
或
npm run electron:serve
```

### Build electron application for production
```
npm run electron:build
```

## Update service deployment

### Node.js

We wrote a simple update server script with Node.js. Of course, you can also choose to write your own server

```javascript
//nodejs server
const express = require('express')

var app = express()

app.get('/', (req, res) => {
    res.write(JSON.stringify({
        major_version:1.1,
        sub_version:1,
        upd_date:"20210808",
        upd_url:"https://github.com/",
        upd_level:1,
        new_server:""
    }))
    res.end()
})

app.listen(10000)
```

### JSON  format

```json
{
    "major_version":1.0, //Major version
    "sub_version":0,  //Sub version
    "upd_date":"20210808", //Update Date
    "upd_url":"https://www.baidu.com/", //Download link
    "upd_level":1, //Force update  0 false | 1 true
    "new_server":"" //alternate update server address
}
```

> When you are ready to replace the update server, you can fill in the new_server field with your new update server address, and modify the corresponding code of the update module in the new version. The old version client will receive update information from the new server

## Concact

[elton11220@foxmail.com](mailto:elton11220@foxmail.com)

![sc1](https://images.gitee.com/uploads/images/2021/0808/112631_bdec99bb_7872762.png "sc1.png")
![sc2](https://images.gitee.com/uploads/images/2021/0808/112644_93497a49_7872762.png "sc2.png")
![sc3](https://images.gitee.com/uploads/images/2021/0808/112703_e9f0874b_7872762.png "sc3.png")