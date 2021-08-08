<template>
  <div>
    <el-tabs class="panel" v-model="activeName" tab-position="left">
      <el-tab-pane label="基本设置" name="first">
        <div class="common">
          <div class="item">
            <div class="left">
              <div class="title">
                自动刷新
              </div>
              <div class="description">设置是否开启自动刷新服务器列表</div>
            </div>
            <div class="right">
              <div class="content">
                <el-switch
                  v-model="savedsettings.common.autorefresh"
                  active-color="#76c9b6"
                  inactive-color="#c0c0c0"
                >
                </el-switch>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">
                自动刷新时长
              </div>
              <div class="description">
                当开启自动刷新时，自动刷新服务器列表的时长(8-30秒)
              </div>
            </div>
            <div class="right">
              <div class="content">
                <el-input-number
                  v-model="savedsettings.common.autointerval"
                  :min="8"
                  :max="30"
                  size="mini"
                  :disabled="!savedsettings.common.autorefresh"
                ></el-input-number>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">
                隐藏侧边栏
                <!-- <span style="color:#FF9900">&nbsp;&nbsp;#DEV_ENV_VISIBLE#</span> -->
              </div>
              <div class="description">设置侧边栏是否收缩</div>
            </div>
            <div class="right">
              <div class="content">
                <el-switch
                  v-model="savedsettings.common.hideSideBar"
                  active-color="#76c9b6"
                  inactive-color="#c0c0c0"
                >
                </el-switch>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">
                隐藏LanPlay窗口
              </div>
              <div class="description">
                连接到服务器后隐藏LanPlay的控制台窗口
              </div>
            </div>
            <div class="right">
              <div class="content">
                <el-switch
                  v-model="savedsettings.common.hideLanPlayConsole"
                  active-color="#76c9b6"
                  inactive-color="#c0c0c0"
                >
                </el-switch>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="LanPlay设置" name="second">
        <div class="common">
          <div class="item">
            <div class="left">
              <div class="title">网络适配器</div>
              <div class="description">选择LanPlay作用的网络适配器</div>
            </div>
            <div class="right">
              <div class="content">
                <el-select
                  v-model="savedsettings.lanplay.interface"
                  placeholder="请选择"
                  size="mini"
                  :loading="savedsettings.lanplay.interfaces.length <= 1"
                >
                  <el-option
                    v-for="item in savedsettings.lanplay.interfaces"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">
                BroadCast
              </div>
              <div class="description">LanPlay启动参数--broadcast</div>
            </div>
            <div class="right">
              <div class="content">
                <el-switch
                  v-model="savedsettings.lanplay.broadcast"
                  active-color="#76c9b6"
                  inactive-color="#c0c0c0"
                >
                </el-switch>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">
                Fake Internet
              </div>
              <div class="description">LanPlay启动参数--fake-internet</div>
            </div>
            <div class="right">
              <div class="content">
                <el-switch
                  v-model="savedsettings.lanplay.fakeinternet"
                  active-color="#76c9b6"
                  inactive-color="#c0c0c0"
                >
                </el-switch>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">
                自定义PMTU
              </div>
              <div class="description">
                LanPlay启动参数--pmtu xxxx
              </div>
            </div>
            <div class="right">
              <div class="content">
                <el-switch
                  v-model="savedsettings.lanplay.pmtu.enable"
                  active-color="#76c9b6"
                  inactive-color="#c0c0c0"
                >
                </el-switch>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">
                PMTU
              </div>
              <div class="description">
                设置启动参数PMTU的值
              </div>
            </div>
            <div class="right">
              <div class="content">
                <el-input-number
                  v-model="savedsettings.lanplay.pmtu.value"
                  :min="0"
                  size="mini"
                  :disabled="!savedsettings.lanplay.pmtu.enable"
                ></el-input-number>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">
                代理
              </div>
              <div class="description">
                LanPlay启动参数----socks5-server-addr proxy
              </div>
            </div>
            <div class="right">
              <div class="content">
                <el-switch
                  v-model="savedsettings.lanplay.proxy.enable"
                  active-color="#76c9b6"
                  inactive-color="#c0c0c0"
                >
                </el-switch>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <div class="title">
                代理服务器
              </div>
              <div class="description">
                设置代理服务器的地址
              </div>
            </div>
            <div class="right">
              <div class="content">
                <el-input
                  size="mini"
                  placeholder="请输入内容"
                  suffix-icon="el-icon-monitor"
                  v-model="savedsettings.lanplay.proxy.value"
                  :disabled="!savedsettings.lanplay.proxy.enable"
                ></el-input>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="更新日志" name="third">
        <div class="block">
          <el-timeline>
            <el-timeline-item timestamp="2021/8/8" placement="top">
              <el-card>
                <h4>LanPlay GUI v1.0.0.210808_rc</h4>
                <p>绿胡子大叔 2021/8/8</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2021/3/12" placement="top">
              <el-card>
                <h4>VLAN Online Platform Qt</h4>
                <p>绿胡子大叔 2021/3/12</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2020/8/18" placement="top">
              <el-card>
                <h4>VLAN Online Platform CSharp</h4>
                <p>绿胡子大叔 2020/8/18</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
      <el-tab-pane label="关于" name="fourth">
        <div class="container">
          <div class="softInfo">
            <div class="icon iconfont icon-nintendoswitch"></div>
            <div class="title">LanPlay GUI</div>
            <div class="github fa fa-github">
              <p style="font-family:'Arial';display:inline;">
                This software is an open source software complying with GPL v3
              </p>
            </div>
          </div>
          <div class="info">
            <img class="meImg" src="../../../assets/me.png" draggable="false" />
            <div class="meName">绿胡子大叔</div>
            <div class="meUrl">https://gitee.com/elton11220/</div>
          </div>
          <div class="refInfo">
            <div class="baseSoft">
              <p>switch-lan-play copyright © spacemeowx2 2021</p>
              <p>https://github.com/spacemeowx2/switch-lan-play</p>
            </div>
          </div>
          <div class="refInfo">
            <div class="baseSoft">
              <p>lan-play-status copyright © GreatWizard 2021</p>
              <p>https://github.com/GreatWizard/lan-play-status</p>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  data() {
    return {
      activeName: "first",
    };
  },
  watch: {
    hideSidebar: function(newVal) {
      this.$store.commit("changeSidebar", { state: newVal });
    },
    proxyEnable: function(newVal) {
      if (newVal) {
        this.$message({
          message: "注意：错误的代理服务器地址将导致连接失败",
          type: "warning",
        });
      }
    },
  },
  computed: {
    savedsettings() {
      return this.$store.state.settings.settings;
    },
    hideSidebar() {
      return this.$store.state.settings.settings.common.hideSideBar;
    },
    proxyEnable() {
      return this.$store.state.settings.settings.lanplay.proxy.enable;
    },
  },
  beforeDestroy() {
    ipcRenderer.send("saveLocalSettings", this.savedsettings);
    this.$message({
      message: "设置保存成功",
      type: "success",
    });
  },
};
</script>

<style lang="scss" scoped>
.panel {
  height: 100%;
  user-select: none;
}
.container {
  position: relative;
  height: calc(100vh - 80px);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.container > .softInfo {
  position: relative;
  width: 400px;
  height: 100px;
}
.softInfo > .icon {
  font-size: 40px;
  color: #707070;
  position: absolute;
  left: calc(40% - 50px);
  top: 35%;
  transform: translateY(-50%);
}
.softInfo > .title {
  color: #707070;
  font-size: 22px;
  position: absolute;
  left: 40%;
  top: 35%;
  transform: translateY(-50%);
  width: 130px;
}
.softInfo > .github {
  color: #909090;
  font-size: 13px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  top: 65%;
}
.container > .info {
  position: relative;
  height: 115px;
  width: 300px;
}
.info > .meImg {
  width: 100px;
  height: 100px;
  top: 5px;
  position: absolute;
  left: 5px;
}
.info > .meName {
  color: #707070;
  font-size: 18px;
  font-weight: bold;
  position: absolute;
  top: 35px;
  left: 150px;
}
.info > .meUrl {
  font-size: 12px;
  color: #909090;
  position: absolute;
  top: 65px;
  left: 105px;
}
.container > .refInfo {
  position: relative;
  height: 55px;
  width: 400px;
}
.refInfo > .baseSoft {
  color: #909090;
  font-size: 12px;
  position: absolute;
  text-align: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  line-height: 18px;
}
.common {
  width: 610px;
  margin-left: auto;
  margin-right: auto;
  height: calc(100vh - 80px);
  position: relative;
  display: flex;
  flex-direction: column;
}
.common > .item {
  width: 610px;
  padding: 12px;
  padding-top: 15px;
  padding-bottom: 15px;
}
.common > .item:hover {
  background-color: rgba(192, 192, 192, 0.3);
}
.common > .item > .left {
  float: left;
  max-width: 60%;
  height: 35px;
}
.common > .item > .left > .title {
  font-size: 13px;
  font-weight: bold;
  color: #505050;
}
.common > .item > .left > .description {
  font-size: 11px;
  color: #707070;
}
.common > .item > .right {
  float: right;
  max-width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
}
.common > .item > .right > .content {
  float: right;
  display: flex;
  justify-content: center;
  align-items: center;
}
.block {
  width: 610px;
  margin-left: auto;
  margin-right: auto;
}
</style>
