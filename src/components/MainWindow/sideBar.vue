<template>
  <div>
    <el-menu
      default-active="/serverList"
      active-text-color="#76c9b6"
      text-color="#707070"
      :collapse-transition="false"
      style="height:calc(100vh - 60px);user-select: none;"
      :collapse="isMenuCollapse"
      router
    >
      <el-menu-item index="/serverList" :disabled="isPlaying">
        <i class="el-icon-menu"></i>
        <span slot="title">服务器列表</span>
      </el-menu-item>
      <el-menu-item index="/myFavour" :disabled="isPlaying">
        <i class="el-icon-star-on"></i>
        <span slot="title">我的收藏</span>
      </el-menu-item>
      <el-menu-item index="/customConn" :disabled="isPlaying">
        <i class="el-icon-s-promotion"></i>
        <span slot="title">自定义连接</span>
      </el-menu-item>
      <el-menu-item index="/settings" :disabled="isPlaying">
        <i class="el-icon-setting"></i>
        <span slot="title">设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    isMenuCollapse: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  computed: {
    isPlaying() {
      return this.$store.state.settings.settings.states.playingID != -1;
    },
  },
};
</script>

<style lang="scss" scoped></style>
