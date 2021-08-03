<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "lanplay_gui",
};
</script>

<style>
/* CSS */
@import url("../../static/iconfont.css");
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Microsoft YaHei";
  overflow: hidden;
}
#app {
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
  border-right: 2px solid #76c9b6;
  border-left: 2px solid #76c9b6;
  border-bottom: 2px solid #76c9b6;
}
</style>
