import toastr from 'toastr';
import { inBrowser } from '~utils';

toastr.options.positionClass = 'toast-top-center';

const state = {
    loading: false,
    progress: 0,
    title: `Fakerli's Blog`
};

const actions = {
    'gProgress'({ commit }, payload) {
        commit('progress', payload);
    },
    'showMsg'(store, config) {
        let content;
        let type;
        if (typeof config === 'string') {
            content = config;
            type = 'error';
        } else {
            content = config.content;
            type = config.type;
        }
        if (inBrowser) toastr[type](content);
    },
    'hideMsg'() {
        toastr.clear();
    },
    'changeTitle'({ commit }, changeTitle) {
        commit('title', changeTitle);
    }
};

const mutations = {
    'progress'(states, payload) {
        states.progress = payload;
    },
    'title'(states, changeTitle) {
        states.title = changeTitle;
    }
};

const getters = {
    'getGlobal'(states) {
        return states;
    }
};

export default {
    actions,
    state,
    mutations,
    getters
};