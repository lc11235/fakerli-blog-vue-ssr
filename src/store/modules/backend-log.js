import {
    getLogReqResList
} from '@/api/log';

const state = {
    logLists: {
        data: [],
        total: 0,
        page: 1
    },
};

const getters = {
    'getLogReqResList'(states) {
        return states.logLists;
    }
};

const mutations = {
    'getLogReqResList'(states, payload) {
        states.logLists.data = [].concat(payload.list);
        states.logLists.total = payload.total;
        states.logLists.page = payload.page;
    },
};

const actions = {
    handleGetLogReqResList({ commit }, config) {
        return new Promise((resolve, reject) => {
            getLogReqResList(config).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('getLogReqResList', data.data);
                    resolve();
                }
            }).catch(err => {
                reject(err);
            });
        });
    },

};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};