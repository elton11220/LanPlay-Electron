<template>
  <div class="container">
    <title-bar></title-bar>
    <div class="side" :style="this.collapse ? 'width:66px' : 'width:200px;'">
      <side-bar :isMenuCollapse="this.collapse"></side-bar>
    </div>
    <router-view
      class="main"
      :style="
        this.collapse
          ? 'width:calc(100vw - 68px);margin-left:68px;'
          : 'width:calc(100vw - 202px);margin-left:202px;'
      "
    ></router-view>
  </div>
</template>

<script>
import TitleBar from "./MainWindow/titleBar.vue";
import SideBar from "./MainWindow/sideBar.vue";
import { spawn, exec } from "child_process";
import { ipcRenderer } from "electron";
import { fetchWithTimeout } from "../assets/utils/fetch";
const { app } = require("@electron/remote");
const Estore = require("electron-store");
import path from "path";
export default {
  components: {
    TitleBar,
    SideBar,
  },
  data() {
    return {};
  },
  computed: {
    collapse() {
      return this.$store.state.settings.settings.states.sidebar;
    },
  },
  mounted() {
    if (this.$store.state.settings.settings.lanplay.interfaces.length > 1)
      return;
    else {
      //lanplay
      let lanPlayFileName = "";
      let lanPlayPath;
      if (process.platform == "win32") {
        lanPlayFileName = "lan-play-win64.exe";
        lanPlayPath = path.join(
          process.cwd(),
          "/resources/extraResources",
          lanPlayFileName
        );
      } else if (process.platform == "darwin") {
        lanPlayFileName = "lan-play-macos";
        lanPlayPath = path.join(
          __dirname.replace("app.asar", ""),
          "/extraResources",
          lanPlayFileName
        );
      }
      if (process.env.NODE_ENV === "development") {
        lanPlayPath = path.join(
          process.cwd(),
          "/build/extraResources",
          lanPlayFileName
        );
      }
      //
      const interfaceLanPlay = spawn(lanPlayPath, ["--list-if"]);
      let interfaces;
      interfaceLanPlay.stdout.on("data", (data) => {
        interfaces = data
          .toString()
          .split(/\d+\.+\s/)
          .map((value, index) => {
            return {
              value: index,
              label: value.replace("\r\n\t", "").replace("\r\n", ""),
            };
          });
        interfaces.shift();
        if (interfaces.length > 0) {
          this.interface = interfaces;
          ipcRenderer.send("showMsg", interfaces);
          this.$store.dispatch("AsyncUpdateInterface", interfaces);
        }
      });
      //load local settings from json
      let estore = new Estore();
      let tempSettings = {};
      tempSettings.common = estore.get("common", {
        autorefresh: true,
        autointerval: 10,
        hideSideBar: false,
        hideLanPlayConsole: true,
      });
      tempSettings.lanplay = estore.get("lanplay", {
        interface: 0,
        broadcast: false,
        fakeinternet: false,
        pmtu: {
          enable: false,
          value: 1500,
        },
        proxy: {
          enable: false,
          value: "",
        },
      });
      tempSettings.states = estore.get("states", {
        playingID: -1,
        sidebar: false,
      });
      tempSettings.lanplay.interfaces = [{ value: 0, label: "全选" }];
      this.$store.commit("assignSettings", tempSettings);
      let tempServerList = estore.get("servers", []);
      if (tempServerList.length > 0) {
        tempServerList.forEach((value) => {
          this.$store.commit("addServer", value);
        });
      }
      //updater
      let updServer = estore.get("alt_updServer", "");
      if (updServer === "") updServer = "http://elton1122.top:10000"; //default update server address
      let major_version = 1.0;
      let sub_version = 0;
      if (updServer === "http://elton1122.top:10000")
        //updServer === "alternate server address"
        //When the alternate server address in the local JSON file is the same as the address in quotation marks, the alternate server address in JSON will be empty
        estore.set({ alt_updServer: "" });
      ipcRenderer.send("showMsg", "update start");
      fetchWithTimeout(updServer)
        .then((res) => res.json())
        .then((resp) => {
          if (
            major_version < resp.major_version ||
            (major_version == resp.major_version &&
              sub_version < resp.sub_version)
          ) {
            if (resp.new_server != "") {
              estore.set({ alt_updServer: resp.new_server });
              this.$message("更新服务地址已更换，将在下次启动时生效");
            }
            this.$confirm(
              `检测到 ${
                resp.upd_date
              } 发布的新版本 ${resp.major_version.toFixed(1).toString()}.${
                resp.sub_version
              }，是否下载？`,
              `检测到更新`,
              {
                confirmButtonText: "是",
                cancelButtonText: "否",
                type: "warning",
                closeOnPressEscape: false,
                closeOnClickModal: false,
                closeOnHashChange: false,
                showClose: false,
              }
            )
              .then(() => {
                if (process.platform == "win32") exec(`start ${resp.upd_url}`);
                else if (process.platform == "darwin")
                  exec(`open ${resp.upd_url}`);
                app.quit();
              })
              .catch(() => {
                if (resp.upd_level == 1) {
                  this.$alert(
                    "此版本含有强制更新标记，拒绝更新将退出程序",
                    "警告",
                    {
                      confirmButtonText: "确定",
                      showClose: false,
                      closeOnClickModal: false,
                      closeOnPressEscape: false,
                      closeOnHashChange: false,
                      callback: () => {
                        app.quit();
                      },
                    }
                  );
                }
              });
          }
        })
        .catch(() => {
          this.$message.error("检查更新失败");
        });
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 600px;
  width: 960px;
}
.container > .side {
  height: calc(100vh - 60px);
  position: absolute;
  left: 0;
  top: 60px;
}
.container > .main {
  height: calc(100vh - 60px);
  position: relative;
  padding: 10px;
}
</style>
