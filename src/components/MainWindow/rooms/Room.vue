<template>
  <el-popover
    placement="bottom"
    title="玩家列表"
    width="170"
    trigger="hover"
    style="display:block;"
  >
    <div class="tip" slot v-html="tip"></div>
    <div class="container" slot="reference">
      <div class="group">
        <div class="title" v-if="hostPlayerName">房主</div>
        <img
          v-if="icon"
          :src="require(`/public/icons/${icon}.png`)"
          id="userIcon"
          alt=""
          draggable="false"
        />
        <div class="content" v-if="hostPlayerName" style="max-width:90px;">
          {{ hostPlayerName }}
        </div>
        <component
          id="playerID"
          v-if="advertiseData"
          v-bind:is="`room${room.contentId}`"
          :advertiseData="advertiseData"
        />
      </div>
      <div class="group">
        <div class="title">玩家</div>
        <div class="content">{{ room.nodeCount }}/{{ room.nodeCountMax }}</div>
      </div>
      <div class="group">
        <div class="title">游戏</div>
        <img
          v-if="game.icon"
          :src="game.icon"
          id="gameIcon"
          alt=""
          draggable="false"
        />
        <div class="content" style="max-width:230px;">
          {{ gameName }}
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script>
import room0100b04011742000 from "./0100b04011742000.vue";
import room0100d71004694000 from "./0100d71004694000.vue";
import room01005ee0036ec000 from "./01005ee0036ec000.vue";
import room01006f8002326000 from "./01006f8002326000.vue";
import { getGameId, getGame, getGameName } from "../../../assets/utils/games";
import {
  getHostPlayerName,
  getPlayers,
  getAdvertiseData,
} from "../../../assets/utils/rooms";
import { getPlayerIcon } from "../../../assets/utils/icons";

export default {
  components: {
    room0100b04011742000,
    room0100d71004694000,
    room01005ee0036ec000,
    room01006f8002326000,
  },
  props: {
    room: Object,
  },
  data() {
    return {
      games: this.$store.state.servers.games,
    };
  },
  computed: {
    gameId() {
      return getGameId(this.room.contentId);
    },
    game() {
      return getGame(this.games, this.gameId);
    },
    gameName() {
      return getGameName(this.game);
    },
    hostPlayerName() {
      return getHostPlayerName(this.room);
    },
    icon() {
      return getPlayerIcon(this.gameId, this.hostPlayerName);
    },
    advertiseData() {
      return getAdvertiseData(this.room);
    },
    tip() {
      let players = getPlayers(this.room).join("<br/>");
      return players;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.container > .group {
  height: 25px;
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
}
#userIcon {
  height: 25px;
  width: 20px;
  padding-left: 0px;
  padding-right: 0px;
  padding: 3px;
}
.group > .title {
  font-size: 13px;
  font-weight: bold;
  display: inline-block;
  height: 25px;
  line-height: 25px;
  padding-right: 5px;
}
.group > .content {
  font-size: 13px;
  color: #606060;
  display: inline-block;
  height: 25px;
  line-height: 25px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#playerID {
  display: inline-block;
  height: 25px;
  color: #707070;
  font-size: 13px;
  line-height: 25px;
  max-width: 80px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#playerID::before {
  content: "(";
}
#playerID::after {
  content: ")";
}
#gameIcon {
  width: 30px;
  height: 25px;
  padding-top: 3px;
  padding-bottom: 3px;
}
.tip {
  font-size: 13px;
}
</style>
