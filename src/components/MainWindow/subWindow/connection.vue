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
          <span class="title">请按提示修改您机器的网络设置</span>
        </div>
        <div class="confirmConn" @click="onbtnConfirmConnClick()">我已阅读</div>
      </div>
      <div class="connCont" v-show="checked">
        <div class="connection">
          <div class="banner">
            <div class="url">已连接到 {{ this.connData.url }}</div>
            <div class="name">
              {{
                this.connData.name === "" ? "未命名服务器" : this.connData.name
              }}
            </div>
          </div>
          <div class="states">
            <div class="item">
              <div class="count">{{ this.connData.ping }}</div>
              <div class="title">
                <span
                  class="el-icon-timer"
                  style="color:#76c9b6;font-size:18px;transform:translateY(3px);"
                ></span>
                <span>即时延迟</span>
              </div>
            </div>
            <div class="item">
              <div class="count">
                {{ this.connData.online - this.connData.idle }}
              </div>
              <div class="title">
                <span
                  class="el-icon-user"
                  style="color:#76c9b6;font-size:18px;transform:translateY(3px);"
                ></span>
                <span>活跃人数</span>
              </div>
            </div>
            <div class="item">
              <div class="count">{{ this.connData.idle }}</div>
              <div class="title">
                <span
                  class="el-icon-user-solid"
                  style="color:#76c9b6;font-size:18px;transform:translateY(3px);"
                ></span>
                <span>挂机人数</span>
              </div>
            </div>
          </div>
          <div class="rooms" v-show="this.connData.rooms.length > 0">
            <Room
              class="room"
              v-for="room in this.connData.rooms"
              :room="room"
              :key="`${room.hostPlayerName}:${room.contentId}`"
            />
          </div>
          <div class="control">
            <div class="btn" @click="getConnectionInfo()">刷新</div>
            <div class="btn" @click="closeTip = true">断开连接</div>
          </div>
        </div>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="closeTip"
        width="30%"
        :show-close="false"
      >
        <span>确定要断开连接吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeTip = false">取 消</el-button>
          <el-button type="primary" @click="btnKillHandler()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { spawn,exec } from "child_process";
import { ipcRenderer } from "electron";
import { fetchWithTimeout } from "../../../assets/utils/fetch";
import { sanitizeData } from "../../../assets/utils/rooms";
import Room from "../rooms/Room.vue";
import path from 'path';
export default {
  components: {
    Room,
  },
  data() {
    return {
      checked: false,
      lanplay: undefined,
      lanplayData: "",
      closeTip: false,
    };
  },
  computed: {
    connID() {
      return this.$store.state.settings.settings.states.playingID;
    },
    connData() {
      return this.$store.state.servers.serverList.filter(
        (value) => value.id == this.connID
      )[0];
    },
    connUrl() {
      return this.$store.state.servers.serverList.filter(
        (value) => value.id == this.connID
      )[0].url;
    },
    connIndex() {
      let val;
      this.$store.state.servers.serverList.forEach((value, index) => {
        if (value.id == this.connID) val = index;
      });
      return val;
    },
    settings() {
      return this.$store.state.settings.settings;
    }
  },
  mounted() {
    if (!this.settings.common.hideSideBar)
      this.$store.commit("changeSidebar", { state: true });
    let lanPlayParams = [];
    lanPlayParams.push("--relay-server-addr");
    lanPlayParams.push(this.connUrl);
    //LanPlay parameters
    if (this.settings.lanplay.interface != 0)
      lanPlayParams.push(`--netif ${this.settings.lanplay.interface}`);
    if (this.settings.lanplay.broadcast) lanPlayParams.push("--broadcast");
    if (this.settings.lanplay.fakeinternet)
      lanPlayParams.push("--fake-internet");
    if (this.settings.lanplay.pmtu.enable)
      lanPlayParams.push(`--pmtu ${this.settings.lanplay.pmtu.value}`);
    if (this.settings.lanplay.proxy.enable)
      lanPlayParams.push(
        `--socks5-server-addr ${this.settings.lanplay.proxy.value}`
      );
    //child_process parameters windows only
    let cpPara = {
      shell: true,
      stdio: "inherit",
      detached: !this.settings.common.hideLanPlayConsole,
    };
    //lanplay
    let lanPlayFileName = "";
    let lanPlayPath;
    if(process.platform == "win32"){
      lanPlayFileName = "lan-play-win64.exe";
      lanPlayPath = path.join(process.cwd(), '/resources/extraResources',lanPlayFileName)
    }else if (process.platform == "darwin"){
      lanPlayFileName = "lan-play-macos"
      lanPlayPath = path.join(__dirname.replace("app.asar",""),"/extraResources",lanPlayFileName)
    }
    if (process.env.NODE_ENV === 'development') {
      lanPlayPath = path.join(process.cwd(), '/build/extraResources',lanPlayFileName)
    }
    //launch lanplay
    if(process.platform == "win32")
      this.lanplay = spawn(lanPlayPath, lanPlayParams, cpPara);
    else if(process.platform == "darwin"){
      let params = lanPlayParams.toString().split(",").join(" ");
      this.lanplay = exec(`osascript -e 'do shell script "sudo ${lanPlayPath} ${params}" with administrator privileges'`)
    }
    //
    ipcRenderer.send("showMsg", this.connData);
    let autoRefreshTimer = setInterval(() => {
      ipcRenderer.send("showMsg", "autorefresh");
      this.getConnectionInfo();
    }, 10000);
    this.$once("hook:beforeDestroy", () => {
      clearInterval(autoRefreshTimer);
    });
  },
  beforeDestroy() {
    if (!this.settings.common.hideSideBar)
      this.$store.commit("changeSidebar", { state: false });
  },
  methods: {
    onbtnConfirmConnClick() {
      if (this.lanplayData == "") this.checked = true;
      this.$message({
        message: "当检测到支持的游戏时，房间列表会自动显示",
        center: true,
      });
      this.getConnectionInfo();
    },
    btnKillHandler() {
      let kill;
      if(process.platform == "win32")
        kill = spawn("taskkill", ["/pid", this.lanplay.pid, "/f", "/t"]);
      else if (process.platform == "darwin"){
        let ps = spawn("ps",['aux']);
        let pids = [];
        ps.stdout.on('data',(data)=>{
          let arr = data.toString().split('\n').filter(value=>value.includes("lan-play-macos"));
          if(arr.length > 0)
            pids = [...pids,...arr.map(value=>value.split(/\s+/)[1])];
        })
        ps.stdout.on('close',()=>{
          exec(`osascript -e 'do shell script "kill -9 ${pids.toString().split(",").join(" ")}" with administrator privileges'`,()=>{
            this.closeTip = false;
            this.$router.push("/serverList");
            this.$store.commit("updatePlayingID", -1);
          })
        })
      }
      //win32
      kill.on("close", () => {
        this.lanplay.kill();
        this.closeTip = false;
        this.$router.push("/serverList");
        this.$store.commit("updatePlayingID", -1);
      });
    },
    async getServerInfo(host) {
      let url;
      if (!host.includes("http")) url = `http://${host}/info`;
      else url = `${host}/info`;
      try {
        var response = await fetchWithTimeout(url);
        let json = await response.json();
        return json;
      } catch (error) {
        return JSON.parse(`{"online":-1,"idle":-1,"version":"-","ping":-1}`);
      }
    },
    async getRoomInfo(host) {
      let url;
      if (!host.includes("http")) url = `http://${host}/`;
      else url = `${host}/`;
      try {
        var response = await fetchWithTimeout(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query:
              "{room{contentId hostPlayerName nodeCount nodeCountMax advertiseData nodes{playerName}}}",
          }),
        });
        let json = await response.json();
        return json;
      } catch (error) {
        return JSON.parse(`{"data":{"room":[]}}`);
      }
    },
    getConnectionInfo() {
      let startTime = Date.now();
      this.getServerInfo(this.connData.url)
        .then((res) => {
          let deltaTime = Math.ceil((Date.now() - startTime) * 0.3);
          if (res.online == -1) deltaTime = -1;
          Object.assign(res, { ping: deltaTime });
          this.$store.commit("updateServer", {
            index: this.connIndex,
            data: res,
          });
          if (res.online != -1) {
            this.getRoomInfo(this.connData.url).then((resp) => {
              this.$store.commit("updateServer", {
                index: this.connIndex,
                data: {
                  rooms: resp.data.room.map((room) => sanitizeData(room)),
                },
              });
              ipcRenderer.send(
                "fetched-room",
                JSON.stringify(this.servers[this.connIndex].rooms)
              );
            });
          }
        })
        .catch(() => {
          this.$store.commit("updateServer", {
            index: this.connIndex,
            data: JSON.parse(`{"online":-1,"idle":-1,"version":"-","ping":-1}`),
          });
          ipcRenderer.send("showMsg", "updErr");
        });
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
.checkConn > .confirmConn {
  color: #707070;
  text-decoration: underline;
  font-size: 13px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 30px;
}
.checkConn > .confirmConn:hover {
  color: #505050;
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
  // border: 1px dashed rgba(192, 192, 192, 0.5);
  position: relative;
}
.connection > .banner {
  position: relative;
  text-align: center;
  padding-top: 60px;
}
.connection > .banner > .url {
  color: #76c9b6;
  font-size: 17px;
  font-weight: bold;
}
.connection > .banner > .name {
  margin-top: 3px;
  color: #bbb;
  font-size: 13px;
}
.connection > .states {
  position: relative;
  margin-top: 40px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.connection > .states > .item {
  width: 180px;
  height: 180px;
  border-radius: 5px;
  background-color: rgba(192, 192, 192, 0.1);
  border: 1px solid #ccc;
  position: relative;
}
.connection > .states > .item > .title {
  text-align: center;
  font-size: 13px;
  color: #aaa;
  position: absolute;
  height: 25px;
  line-height: 25px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 25px;
}
.connection > .states > .item > .count {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 50px;
  font-size: 50px;
  color: #76c9b6;
  font-weight: bolder;
  font-family: "Arial";
}
.btn {
  height: 40px;
  min-width: 110px;
  border-radius: 20px;
  box-shadow: 0 0 8px rgba(160, 160, 160, 0.6);
  text-align: center;
  line-height: 40px;
  position: relative;
  margin-left: 20px;
  color: #999;
  font-size: 14px;
}
.btn:hover {
  box-shadow: 0 0 8px rgba(160, 160, 160, 0.8);
}
.btn:active {
  box-shadow: 0 0 8px rgba(160, 160, 160, 1);
}
.connection > .control {
  position: relative;
  display: flex;
  height: 50px;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 16px;
  padding-left: 70px;
  padding-right: 70px;
}
.rooms {
  width: 100%;
  margin-top: 10px;
  min-height: 29px;
  max-height: 87px;
  overflow: auto;
  background-color: #fff;
}
.rooms .room {
  height: 25px;
  margin-top: 2px;
  margin-bottom: 2px;
  width: 100%;
  overflow: hidden;
}
</style>
