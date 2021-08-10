module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                "productName": "LanPlay_Electron",
                "appId": "com.elton11220.lanplay_electron",
                "extraResources": {
                    "from": "./build/extraResources/",
                    "to": "extraResources"
                }
            }
        }
    }
}