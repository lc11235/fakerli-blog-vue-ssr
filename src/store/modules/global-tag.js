import api from '~api';

const state = {
    lists: [],
    item: {}
};

const actions = {
    async ['getTagList']({commit, state}, config) {
        if(state.lists.length) return;
        const {data: {data, code}} = await api.get('backend/tag/list', {...config, cache: true});
        if(data && code === 200) {
            commit('receiveTagList', data.list);
        }
    },
    async ['getTagItem']({commit, rootState: {route: {params: {id}}}}) {
        const {data: {data, code}} = await api.get('backend/tag/item', {id});
        if(data && code === 200) {
            commit('receiveTagItem', data);
        }
    }
};

const mutations = {
    ['receiveTagList'](state, payload) {
        state.lists = payload;
    },
    ['receiveTagItem'](state, payload) {
        state.item = payload;
    },
    ['insertTagItem'](state, payload) {
        state.lists = [payload].concat(state.lists);
    },
    ['updateTagItem'](state, payload) {
        state.item = payload;
        const index = state.lists.findIndex(ii => ii._id === payload._id);
        if(index > -1) {
            state.lists.splice(index, 1, payload);
        }
    }
};

const getters = {
    ['getTagList'] (state) {
        return state.lists;
    },
    ['getTagItem'](state) {
        return state.item;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};