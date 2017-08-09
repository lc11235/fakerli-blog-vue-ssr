import api from '~api';

const state = {
    lists: [],
    item: {}
};

const actions = {
    async ['getTagList']({commit, state}) {
        if(state.lists.length) return;
        const {data: {data, code}} = await api.get('backend/tag/list', {cache: true});
        if(data && code === 200) {
            commit('receiveTagList', data.list);
        }
    },
    async ['getTagItem']({commit, rootState: {route: {params: {tag_name}}}}) {
        const {data: {data, code}} = await api.get('backend/tag/item', {tag_name});
        if(data && code === 200) {
            commit('receiveTagItem', data);
        }
    }
};

const mutations = {
    ['receiveTagList'](state, payload) {
        state.lists = payload;
    },
    ['receiveTagItem'](state, data) {
        state.item = data;
    },
    ['insertTagItem'](state, data) {
        state.item = data;
    },
    ['updateTagItem'](state, data) {
        state.item = data;
    },
    ['deleteTag'](state, tag_name) {
        const obj = state.lists.data.find(ii => ii.tag_name === tag_name);
        if(obj) obj.is_delete = 1;
    },
    ['recoverTag'] (state, tag_name) {
        const obj = state.lists.data.find(ii => ii.tag_name === tag_name);
        if(obj) obj.is_delete = 0;
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