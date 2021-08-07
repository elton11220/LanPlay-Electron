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
import { spawn } from "child_process";
import { ipcRenderer } from "electron";
const { app } = require("@electron/remote");
const Estore = require("electron-store");
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
      let pathArr = app.getAppPath("exe").split("\\");
      let path = pathArr.slice(0, pathArr.length - 1).join("\\");
      const interfaceLanPlay = spawn(path + "\\lan-play-win64.exe", [
        "--list-if",
      ]);
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
      tempSettings.common = estore.get("common");
      tempSettings.lanplay = estore.get("lanplay");
      tempSettings.states = estore.get("states");
      tempSettings.lanplay.interfaces = [{ value: 0, label: "全选" }];
      this.$store.commit("assignSettings", tempSettings);
      let tempServerList = estore.get("servers");
      if (tempServerList.length > 0) {
        tempServerList.forEach((value) => {
          this.$store.commit("addServer", value);
        });
      }
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
