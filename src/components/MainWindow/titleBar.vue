<template>
  <div>
    <div class="navigator">
      <div class="logo">
        <div class="icon iconfont icon-nintendoswitch"></div>
        <div class="title">LanPlay</div>
      </div>
      <div class="tip">#v1.0.0.210808_rc#</div>
      <div class="control">
        <div class="btn" @click="onbtnMinClick()">
          <div class="btnMin"></div>
        </div>
        <div class="btn iconfont icon-guanbi" @click="onbtnCloseClick()"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  methods: {
    onbtnMinClick() {
      ipcRenderer.send("min-app");
    },
    onbtnCloseClick() {
      ipcRenderer.send("close-app");
    },
  },
};
</script>

<style lang="scss" scoped>
.navigator {
  width: 100%;
  -webkit-app-region: drag;
  user-select: none;
  height: 60px;
  background-color: #76c9b6;
  position: relative;
}
.navigator > .tip {
  color: #409eff;
  font-size: 14px;
  position: absolute;
  left: 160px;
  top: 19px;
  font-weight: bold;
  background-color: #fff;
  border-radius: 4px;
  padding: 3px;
  padding-left: 6px;
  padding-right: 6px;
  display: none;
}
.navigator > .logo {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 20px;
  height: 40px;
  width: 180px;
  color: #fff;
}
.logo > .icon {
  font-size: 35px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.logo > .title {
  font-size: 23px;
  font-family: "Segoe UI";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 45px;
}
.navigator > .control {
  position: absolute;
  right: 20px;
  transform: translateY(-50%);
  top: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 55px;
  height: 20px;
}
.control > .btn {
  height: 15px;
  width: 15px;
  position: relative;
  font-size: 18px;
  line-height: 15px;
  text-align: center;
  color: #eee;
  -webkit-app-region: no-drag;
}
.btn > .btnMin {
  width: 100%;
  height: 2px;
  background-color: #eee;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.btn:hover {
  color: #fff;
  .btnMin {
    background-color: #fff;
  }
}
</style>
