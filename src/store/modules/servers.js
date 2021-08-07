import gamesSource from "/public/games.json"

const serverMapping = ({
  id,
  url,
  name = "",
  favour = false,
  online = 0,
  idle = 0,
  ping = 0,
  menuOpen = false,
  version = "",
  rooms = []
}) => {
  return {
  id,
  url,
  name,
  favour,
  online,
  idle,
  ping,
  menuOpen,
  version,
  rooms 
  };
};

const state = {
    serverList: [],
    games:gamesSource
}

const mutations = {
  removeServer(state, n) {
    let tempServers = state.serverList.filter(item => item.id != n)
    state.serverList = tempServers;
  },
  pushServer(state, payload) {
    state.serverList.push(payload);
  },
  updateServer(state, payload) {
    Object.assign(state.serverList[payload.index],payload.data)
  },
  resetServer(state) {
    state.serverList = [];
  },
  addServer(state, payload) {
    state.serverList.push(serverMapping(payload))
  }
}
const getters = {}
const actions = {}

export default {
    state,
    mutations,
    getters,
    actions
}