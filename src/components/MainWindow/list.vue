<template>
  <div class="container">
    <div class="empty" v-show="servers.length == 0">
      {{ !favour ? "服务器列表为空，点击下方按钮添加服务器" : "收藏列表为空" }}
    </div>
    <div class="items">
      <div
        class="item"
        v-for="(item, index) in servers"
        :key="item.id"
        v-if="
          (favour ? (item.favour ? true : false) : true) && servers.length > 0
        "
      >
        <div style="height:50px;position:relative;">
          <span
            :class="item.favour ? 'favour fa fa-heart' : 'favour fa fa-heart-o'"
            :style="item.favour ? 'color:#f35336;' : ''"
            @click="onbtnFavourClick(index)"
          ></span>
          <div
            class="url"
            :style="
              item.name == '' ? 'transform:translateY(-50%);top:50%;' : ''
            "
          >
            {{ item.url }}
          </div>
          <div class="name">{{ item.name }}</div>
          <div class="states">
            <div class="state">
              <div class="stateGroup">
                <span
                  :class="
                    item.online != -1
                      ? 'icon fa fa-check-circle'
                      : 'icon fa fa-times-circle'
                  "
                  :style="
                    item.online != -1 ? 'color:#67C23A;' : 'color:#F56C6C;'
                  "
                ></span>
                <span class="title">{{
                  item.online != -1 ? "正常" : "异常"
                }}</span>
              </div>
              <div class="stateGroup">
                <span
                  class="icon fa fa-wifi"
                  :style="
                    item.ping < 60 && item.ping >= 0
                      ? 'color:#67c23a;'
                      : item.ping >= 60 && item.ping < 140
                      ? 'color:#e6a23c'
                      : item.ping >= 140
                      ? 'color:#f56c6c'
                      : 'color:#C0C0C0'
                  "
                ></span>
                <span class="title">{{ item.ping }}</span>
              </div>
              <div class="stateGroup">
                <span
                  class="icon fa fa-user"
                  :style="item.ping != -1 ? 'color:#409eff;' : 'color:#C0C0C0;'"
                ></span>
                <span class="title">{{ item.online - item.idle }}</span>
                <span>/</span>
                <span
                  class="icon fa fa-user"
                  :style="item.ping == -1 ? 'color:#C0C0C0;' : ''"
                ></span>
                <span class="title">{{ item.idle }}</span>
              </div>
            </div>
          </div>
          <div class="settings">
            <div
              :class="{ subSettings: true, Active: servers[index].menuOpen }"
            >
              <span
                class="icon el-icon-more"
                style="color:#409eff;"
                @click="
                  servers[index].menuOpen ? onbtnInfoClick(index) : () => false
                "
              ></span>
              <el-popover
                placement="bottom"
                width="170"
                :disabled="!servers[index].menuOpen"
              >
                <span
                  slot="reference"
                  class="icon el-icon-delete-solid"
                  style="color:#f35336;position:relative;top:2px;"
                ></span>
                <p>确定要删除服务器吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" @click="onbtnDelClick(index)"
                    >确定</el-button
                  >
                </div>
              </el-popover>
            </div>
            <span
              :class="{
                icon: true,
                iconSet: true,
                'el-icon-setting': true,
                Active: servers[index].menuOpen,
              }"
              @click="onbtnSetClick(index)"
            ></span>
            <span
              class="icon el-icon-caret-right"
              style="color:#76c9b6;font-size:22px;"
              @click="onbtnPlayClick(index)"
            ></span>
          </div>
        </div>
        <div class="rooms" v-if="item.rooms.length > 0">
          <Room
            class="room"
            v-for="room in item.rooms"
            :room="room"
            :key="`${room.hostPlayerName}:${room.contentId}`"
          />
        </div>
      </div>
    </div>
    <div class="control">
      <div class="btn" @click="getAllServerInfo()">
        <span
          class="el-icon-refresh"
          style="color:#C0C0C0;font-size:15px;font-weight:bold;"
        ></span>
      </div>
      <div class="btn" v-if="!favour" @click="onbtnAddServerClick()">
        <span
          class="el-icon-plus"
          style="color:#C0C0C0;font-size:15px;font-weight:bold;"
        ></span>
      </div>
    </div>
    <el-drawer
      title="服务器信息"
      :visible.sync="infoDrawer"
      direction="rtl"
      :modal="false"
      style="border-top-right-radius:10px;border-bottom-right-radius:10px;"
      @closed="onDrawerClosed()"
      @opened="onDrawerOpened()"
    >
      <div class="drawer" style="height:100%;width:100%;" v-if="infoDrawer">
        <div class="info">
          <div class="head">
            <div class="title">{{ servers[drawerID].url }}</div>
            <div class="content">{{ servers[drawerID].name }}</div>
          </div>
          <div class="group">
            <div class="title">版本：</div>
            <div class="icon fa fa-link" style="color:#707070;"></div>
            <div class="content">
              {{ servers[drawerID].version }}
            </div>
          </div>
          <div class="group">
            <div class="title">状态：</div>
            <div
              :class="
                servers[drawerID].online != -1
                  ? 'icon fa fa-check-circle'
                  : 'icon fa fa-times-circle'
              "
              :style="
                servers[drawerID].online != -1
                  ? 'color:#67C23A;'
                  : 'color:#F56C6C;'
              "
            ></div>
            <div class="content">
              {{ servers[drawerID].online == -1 ? "异常" : "正常" }}
            </div>
          </div>
          <div class="group">
            <div class="title">延迟：</div>
            <div
              class="icon fa fa-wifi"
              :style="
                servers[drawerID].ping < 60 && servers[drawerID].ping >= 0
                  ? 'color:#67c23a;'
                  : servers[drawerID].ping >= 60 && servers[drawerID].ping < 140
                  ? 'color:#e6a23c'
                  : servers[drawerID].ping >= 140
                  ? 'color:#f56c6c'
                  : 'color:#C0C0C0'
              "
            ></div>
            <div class="content">{{ servers[drawerID].ping }}</div>
          </div>
          <div class="group">
            <div class="title">活跃人数：</div>
            <div
              class="icon fa fa-user"
              :style="
                servers[drawerID].ping != -1
                  ? 'color:#409eff;'
                  : 'color:#c0c0c0;'
              "
            ></div>
            <div class="content">
              {{ servers[drawerID].online - servers[drawerID].idle }}
            </div>
          </div>
          <div class="group">
            <div class="title">挂机人数：</div>
            <div
              class="icon fa fa-user"
              :style="servers[drawerID].ping == -1 ? 'color:#C0C0C0;' : ''"
            ></div>
            <div class="content">
              {{ servers[drawerID].idle }}
            </div>
          </div>
        </div>
        <div :class="{ control: true, Active: editor }">
          <div class="btn" style="margin-left:0px;" @click="onbtnEditClick()">
            <span
              class="el-icon-edit"
              style="color:#C0C0C0;font-size:15px;font-weight:bold;"
            ></span>
          </div>
        </div>
        <div :class="{ editor: true, Active: editor }">
          <div class="group">
            <span class="title">备注</span>
            <el-input
              v-model="editorText"
              placeholder="输入服务器备注"
              size="mini"
              style="width:200px;"
              maxlength="25"
            ></el-input>
          </div>
          <div class="group">
            <div class="btn" @click="onbtnCloseEditorClick()">
              <span
                class="el-icon-close"
                style="color:#C0C0C0;font-size:14px;font-weight:bold;"
              ></span>
            </div>
            <div class="btn" @click="onbtnConfirmEditClick()">
              <span
                class="el-icon-check"
                style="color:#C0C0C0;font-size:14px;font-weight:bold;"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    <div class="addServer" v-if="addServer.open">
      <div class="msgbox">
        <div class="title">添加服务器</div>
        <div class="form">
          <div class="group">
            <div class="title">地址:</div>
            <el-input
              class="inputbox"
              v-model="addServer.url"
              placeholder="请输入服务器地址 (不含http://)"
              size="mini"
              maxlength="40"
            ></el-input>
          </div>
          <div class="group">
            <div class="title">备注:</div>
            <el-input
              class="inputbox"
              v-model="addServer.name"
              placeholder="请输入备注"
              size="mini"
              maxlength="25"
              show-word-limit
            ></el-input>
          </div>
        </div>
        <div class="submitServer">
          <div class="btn" @click="onbtnAddServerClose()">
            <span
              class="el-icon-close"
              style="color:#C0C0C0;font-size:15px;font-weight:bold;"
            ></span>
          </div>
          <div class="btn" @click="onbtnAddServerSubmit()">
            <span
              class="el-icon-check"
              style="color:#C0C0C0;font-size:15px;font-weight:bold;"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchWithTimeout } from "../../assets/utils/fetch";
import { ipcRenderer } from "electron";
import { sanitizeData } from "../../assets/utils/rooms";
import Room from "./rooms/Room.vue";
export default {
  methods: {
    onbtnAddServerClick() {
      this.addServer.url = "";
      this.addServer.name = "";
      this.addServer.open = true;
    },
    onbtnAddServerClose() {
      this.addServer.url = "";
      this.addServer.name = "";
      this.addServer.open = false;
    },
    onbtnAddServerSubmit() {
      if (this.addServer.url.length == 0) {
        this.$message({
          message: "服务器地址不能为空",
          type: "warning",
          duration: 1000,
        });
      } else {
        this.$store.commit("addServer", {
          id: Date.now(),
          url: this.addServer.url.trim(),
          name: this.addServer.name.trim(),
        });
        this.getAllServerInfo();
        this.onbtnAddServerClose();
        this.$message({
          message: "添加成功",
          type: "success",
          duration: 1000,
        });
      }
    },
    onbtnSetClick(index) {
      this.servers[index].menuOpen = !this.servers[index].menuOpen;
      for (let i in this.servers) {
        if (i == index) continue;
        else this.servers[i].menuOpen = false;
      }
    },
    onbtnDelClick(index) {
      this.$store.commit("removeServer", this.servers[index].id);
    },
    onbtnInfoClick(index) {
      this.drawerID = index;
      this.infoDrawer = true;
    },
    onDrawerClosed() {
      this.editorText = "";
      this.editor = false;
    },
    onDrawerOpened() {
      this.servers[this.drawerID].menuOpen = false;
    },
    onbtnEditClick() {
      if (!this.editor) {
        this.editorText = "";
        this.editor = true;
      }
    },
    onbtnCloseEditorClick() {
      if (this.editor) {
        this.editorText = "";
        this.editor = false;
      }
    },
    onbtnConfirmEditClick() {
      if (this.editor) {
        let index = this.drawerID;
        let content = this.editorText;
        this.$store.commit("updateServer", {
          index: index,
          data: { name: content.trim() },
        });
        this.onbtnCloseEditorClick();
      }
    },
    onbtnFavourClick(index) {
      if (!this.servers[index].favour) {
        this.$message({
          message: "收藏成功",
          type: "success",
          duration: 1000,
          center: true,
        });
      }
      this.$store.commit("updateServer", {
        index: index,
        data: { favour: !this.servers[index].favour },
      });
    },
    onbtnPlayClick(index) {
      const loading = this.$loading({
        lock: true,
        text: "正在连接",
        spinner: "el-icon-loading",
        background: "rgba(255,255,255,0.7)",
      });
      this.$store.commit("updatePlayingID", this.servers[index].id);
      this.$router.push("/connection");
      loading.close();
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
    getAllServerInfo() {
      if (this.servers.length == 0) return;
      this.servers.forEach((value, index) => {
        let startTime = Date.now();
        this.getServerInfo(value.url)
          .then((res) => {
            let deltaTime = Math.ceil((Date.now() - startTime) * 0.3);
            if (res.online == -1) deltaTime = -1;
            Object.assign(res, { ping: deltaTime });
            ipcRenderer.send("fetched", JSON.stringify(res));
            this.$store.commit("updateServer", {
              index: index,
              data: res,
            });
            if (res.online != -1) {
              this.getRoomInfo(value.url).then((resp) => {
                this.$store.commit("updateServer", {
                  index: index,
                  data: {
                    rooms: resp.data.room.map((room) => sanitizeData(room)),
                  },
                });
                ipcRenderer.send(
                  "fetched-room",
                  JSON.stringify(this.servers[index].rooms)
                );
              });
            }
          })
          .catch(() => {
            this.$store.commit("updateServer", {
              index: index,
              data: JSON.parse(
                `{"online":-1,"idle":-1,"version":"-","ping":-1}`
              ),
            });
          });
      });
    },
    onAutoRefreshTick() {
      ipcRenderer.send("showMsg", Date.now() + "ticked");
    },
  },
  props: {
    favour: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      infoDrawer: false,
      drawerID: -1,
      editorText: "",
      editor: false,
      autoRefresh: undefined,
      addServer: {
        open: false,
        url: "",
        name: "",
      },
    };
  },
  computed: {
    servers() {
      return this.$store.state.servers.serverList;
    },
    settings() {
      return this.$store.state.settings.settings;
    },
  },
  components: {
    Room,
  },
  mounted() {
    if (this.settings.states.firstRun && this.servers.length > 0) {
      this.getAllServerInfo();
    }
    this.$store.commit("setState", { firstRun: false });
    // auto refresh server info and rooms data
    // let autoRefreshTimer = setInterval(() => {

    // }, 10000);
    // this.$once("hook:beforeDestroy", () => {
    //   clearInterval(autoRefreshTimer);
    // });
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  position: relative;
  padding: 10px;
  user-select: none;
}
.container > .empty {
  color: #707070;
  position: absolute;
  left: 50%;
  top: 45%;
  font-size: 13px;
  transform: translate(-50%, -50%);
}
.container > .items {
  height: calc(100% - 60px);
  position: relative;
  width: 100%;
  padding: 15px;
  overflow: auto;
}
::-webkit-scrollbar {
  width: 3px;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(192, 192, 192, 0.6);
}
.items > .item {
  width: 100%;
  min-height: 50px;
  box-shadow: 0 0 8px rgba(192, 192, 192, 0.6);
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 5px;
  position: relative;
}
.item .favour {
  font-size: 15px;
  color: #505050;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 15px;
}
.item .url {
  color: #707070;
  font-size: 13px;
  font-weight: bold;
  position: absolute;
  width: 280px;
  overflow: hidden;
  left: 45px;
  top: 7px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item .name {
  color: #c0c0c0;
  font-size: 11px;
  position: absolute;
  left: 45px;
  top: 26px;
  width: 280px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item .states {
  height: 30px;
  width: 210px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: calc(325px + (100% - 325px - 115px) / 2 - 105px);
  background-color: rgba(192, 192, 192, 0.1);
  border-radius: 25px;
  box-shadow: inset 0 0 5px rgba(192, 192, 192, 0.6);
}
.states > .state {
  width: 100%;
  height: 100%;
  position: relative;
  color: #909090;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.state > .stateGroup {
  display: inline-block;
}
.state > .stateGroup > .icon {
  transform: translateY(2px);
  margin-right: 2px;
}
.item .settings {
  height: 30px;
  width: 115px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.settings > .iconSet {
  transform: rotate(0deg);
  transition: all 0.25s linear;
}
.settings > .iconSet.Active {
  transform: rotate(60deg);
}
.settings .icon {
  height: 28px;
  width: 28px;
  font-size: 17px;
  text-align: center;
  line-height: 28px;
}
.settings > .subSettings {
  width: 60px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  transition: all 0.2s linear;
  position: relative;
  left: 15px;
  opacity: 0;
}
.settings > .subSettings.Active {
  left: 0px;
  opacity: 1;
}
.item > .rooms {
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  min-height: 29px;
  max-height: 87px;
  overflow: auto;
}
.rooms .room {
  height: 25px;
  margin-top: 2px;
  margin-bottom: 2px;
  width: 100%;
  overflow: hidden;
}
.container > .control {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 55px;
  padding-right: 25px;
}
.control > .btn,
.group > .btn,
.submitServer > .btn {
  height: 30px;
  min-width: 60px;
  border-radius: 20px;
  box-shadow: 0 0 8px rgba(160, 160, 160, 0.6);
  text-align: center;
  line-height: 30px;
  position: relative;
  margin-left: 20px;
}
.control > .btn:hover,
.group > .btn:hover,
.submitServer > .btn:hover {
  box-shadow: 0 0 8px rgba(160, 160, 160, 0.8);
}
.control > .btn:active,
.group > .btn:active,
.submitServer > .btn:active {
  box-shadow: 0 0 8px rgba(160, 160, 160, 1);
}
.drawer > .info {
  width: 260px;
  height: 250px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.drawer > .info > .head {
  width: 240px;
  height: 50px;
  line-height: 25px;
  margin-bottom: 10px;
}
.drawer > .info > .head > .title {
  font-size: 16px;
  text-align: center;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.drawer > .info > .head > .content {
  color: #505050;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.drawer > .info > .group {
  width: 240px;
  height: 25px;
}
.info > .group > .title {
  font-size: 13px;
  display: inline-block;
  height: 25px;
  line-height: 25px;
  width: 70px;
  text-align: right;
  font-weight: bold;
}
.info > .group > .content {
  color: #505050;
  font-size: 13px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 25px;
  line-height: 25px;
  width: 140px;
}
.info > .group > .icon {
  line-height: 25px;
  height: 25px;
  width: 17px;
  display: inline-block;
  text-align: center;
  font-size: 14px;
}
.drawer > .control {
  height: 40px;
  width: 260px;
  position: absolute;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  transition: all 0.1s linear;
}
.drawer > .control.Active {
  opacity: 0;
}
.drawer > .editor {
  width: 260px;
  height: 80px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 75px;
  opacity: 0;
  transition: all 0.1s linear;
}
.drawer > .editor.Active {
  transform: translate(-50%, 5px);
  opacity: 1;
}
.editor > .group {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  line-height: 40px;
}
.group > .title {
  width: 50px;
  font-size: 12px;
  text-align: center;
  font-weight: bold;
  color: #707070;
}
.group > .btn {
  height: 25px;
  margin-left: 15px;
  margin-right: 15px;
}
.container > .addServer {
  width: calc(100% - 4px);
  height: calc(100% - 62px);
  position: fixed;
  top: 60px;
  left: 2px;
  background-color: rgba(0, 0, 0, 0.4);
  border-bottom-left-radius: 9px;
  border-bottom-right-radius: 9px;
}
.container > .addServer > .msgbox {
  width: 450px;
  height: 210px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.4);
  padding: 20px;
  padding-top: 15px;
}
.msgbox > .title {
  color: #505050;
  font-size: 18px;
  margin-left: 10px;
  font-weight: bold;
}
.msgbox > .form {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 10px;
  height: 100px;
}
.msgbox > .form > .group {
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: relative;
}
.msgbox > .form > .group > .title {
  font-size: 14px;
  margin-left: 30px;
  font-weight: normal;
}
.msgbox > .form > .group > .inputbox {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 85px;
  width: 290px;
}
.msgbox > .submitServer {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
}
.msgbox > .submitServer > .btn {
  margin-left: 30px;
  margin-right: 30px;
}
</style>
