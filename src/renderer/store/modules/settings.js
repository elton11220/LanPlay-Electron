const state = {
    settings: {
        common: {
            autorefresh: false,
            autointerval: 5,
            sidebar: false,
            hideLanPlayConsole: true
        },
        lanplay: {
            showdetail: false,
            interface: 0,
            interfaces: [
                {
                    value: 0,
                    label:"全选"
                }
            ]
        },
        states: {
            firstRun: true,
            playingID:-1
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
        state.settings.common.sidebar = payload.state
    },
    updatePlayingID(state, n) {
        state.settings.states.playingID = n;
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