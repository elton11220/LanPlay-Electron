<template>
  <div>
    <div class="container">
      <!-- {{ $route.query.serverID }} -->
      <div class="checkConn" v-show="!checked">
        <div class="title">已连接到服务器，请按以下步骤进行设置</div>
        <div class="card">
          <div class="description">
            <div class="para">1.将 Switch 和电脑连接在同一路由器或交换机下</div>
            <div class="para">
              2.互联网->互联网设置->有线连接/WiFi->更改设置
            </div>
            <div class="para">
              3.正确填写并保存，这时候设备会开始通过你的电脑上网
            </div>
            <div class="connTip">
              <div class="row">
                <div class="group">
                  <div class="title">IP地址:</div>
                  <div class="content">10.13.x.x</div>
                </div>
                <div class="group">
                  <div class="title">子网掩码:</div>
                  <div class="content">255.255.0.0</div>
                </div>
              </div>
              <div class="row">
                <div class="group">
                  <div class="title">网关:</div>
                  <div class="content">10.13.37.1</div>
                </div>
                <div class="group">
                  <div class="title">DNS1:</div>
                  <div class="content">114.114.114.114</div>
                </div>
              </div>
            </div>
            <div class="para">
              4.设置后启动游戏，然后按 L+R+LStick 进入局域网联机模式
            </div>
          </div>
        </div>
        <div class="checking">
          <span class="icon fa fa-spinner fa-pulse"></span>
          <span class="title">正在检查您是否已设置成功…</span>
        </div>
        <div class="cancelConn" @click="onbtnCancelConnClick()">取消连接</div>
      </div>
      <div class="connCont" v-show="checked">
        <div class="connection">
          <div class="serverInfo">
            <div class="url">服务器URL</div>
            <div class="name">服务器备注信息</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { spawn } from "child_process";
import { ipcRenderer } from "electron";
const { app } = require("electron").remote;
export default {
  components: {},
  data() {
    return {
      checked: false,
      lanplay: undefined,
      lanplayData: "",
    };
  },
  computed: {
    connID() {
      return this.$store.state.settings.settings.states.playingID;
    },
    connData() {
      return this.$store.state.servers.serverList.filter(
        (value) => value.id == this.connID
      );
    },
    settings() {
      return this.$store.state.settings.settings;
    },
  },
  mounted() {
    this.$store.commit("changeSidebar", { state: true });
    let pathArr = app.getAppPath("exe").split("\\");
    let path = pathArr.slice(0, pathArr.length - 1).join("\\");
    ipcRenderer.send("showMsg", this.connData);
    let lanPlayParams = ["--relay-server-addr " + this.connData.url];
    if (this.settings.lanplay.interface != 0)
      lanPlayParams.push("--netif " + this.settings.lanplay.interface);
    this.lanplay = spawn(path + "\\lan-play-win64.exe", lanPlayParams);
    this.lanplay.stdout.on("data", (data) => {
      if (this.lanplayData == "") this.checked = true;
      this.lanplayData += data.toString();
      ipcRenderer.send("showMsg", "[lanplaydata]" + data.toString());
    });
  },
  destroyed() {
    this.lanplay.kill();
    this.$store.commit("changeSidebar", { state: false });
  },
  methods: {
    onbtnCancelConnClick() {
      this.$router.push("/serverList");
      this.$store.commit("updatePlayingID", -1);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  user-select: none;
  height: 100%;
  position: relative;
  padding: 10px;
}
.container > .checkConn {
  height: 100%;
  width: 700px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}
.checkConn > .title {
  color: #76c9b6;
  position: absolute;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  top: 50px;
}
.checkConn > .card {
  box-shadow: 0 0 10px rgba(170, 170, 170, 0.5);
  background-color: rgba(170, 170, 170, 0.1);
  border-radius: 5px;
  width: 560px;
  height: 280px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 100px;
  position: relative;
  padding: 20px;
  padding-left: 35px;
  padding-right: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.checkConn > .card > .description {
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}
.checkConn > .card > .description > .para {
  font-size: 14px;
  font-weight: bold;
  color: #707070;
}
.checkConn > .card > .description > .connTip {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: inset 0 0 10px rgba(200, 200, 200, 0.7);
  height: 80px;
  width: calc(100% - 10px);
  margin-left: 5px;
  margin-right: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.checkConn > .checking {
  height: 40px;
  width: 250px;
  line-height: 40px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 25px;
}
.checkConn > .cancelConn {
  color: #707070;
  text-decoration: underline;
  font-size: 13px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 30px;
}
.checkConn > .cancelConn:hover {
  color: #505050;
}
.checking > .icon {
  top: 2px;
  position: relative;
  color: #505050;
  font-size: 14px;
}
.checking > .title {
  font-size: 14px;
  margin-left: 4px;
  color: #505050;
}
.connTip > .row {
  height: 30px;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  line-height: 30px;
}
.connTip > .row > .group {
  width: 190px;
  height: 30px;
}
.connTip > .row > .group > .title {
  display: inline-block;
  color: #707070;
  width: 60px;
  font-size: 13px;
  text-align: right;
}
.connTip > .row > .group > .content {
  display: inline-block;
  font-size: 13px;
  color: 505050;
}
.container > .connCont {
  width: 700px;
  height: calc(100% - 20px);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 10px;
}
.connCont > .connection {
  height: 100%;
  width: 100%;
  border: 1px solid blue;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}
.connCont > .connection > .serverInfo {
  border: 1px solid black;
  width: 400px;
  height: 100px;
}
.serverInfo > .url {
  font-size: 25px;
}
</style>
