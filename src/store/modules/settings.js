const state = {
    settings: {
        common: {
            autorefresh: false,
            autointerval: 10,
            hideSideBar: false,
            hideLanPlayConsole: true
        },
        lanplay: {
            interface: 0,
            interfaces: [
                {
                    value: 0,
                    label:"全选"
                }
            ],
            broadcast: false,
            fakeinternet: false,
            pmtu: {
                enable: false,
                value: 1500
            },
            proxy: {
                enable: false,
                value: ""
            }
        },
        states: {
            firstRun: true,
            playingID: -1,
            sidebar: false,
        }
    },
}

const mutations = {
    resetSetting(state) {
        state.settings = {}
    },
    updateInterface(state, payload) {
        state.settings.lanplay.interfaces = [...state.settings.lanplay.interfaces, ...payload];
    },
    setState(state, payload) {
        Object.assign(state.settings.states, payload);
    },
    changeSidebar(state, payload) {
        state.settings.states.sidebar = payload.state
    },
    updatePlayingID(state, n) {
        state.settings.states.playingID = n;
    },
    assignSettings(state, payload) {
        Object.assign(state.settings,payload)
    }
}

const actions = {
    AsyncUpdateInterface(context,payload) {
        context.commit('updateInterface',payload)
    }
}

export default {
    state,
    mutations,
    actions
}