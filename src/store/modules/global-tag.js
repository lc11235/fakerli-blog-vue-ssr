import api from '~api';

const state = {
    lists: [],
    item: {}
};

const actions = {
    async 'getTagList'({ commit }) {
        // if (state.lists.length) return;
        const { data: { data, code }} = await api.get('backend/tag/list', { cache: true });
        if (data && code === 200) {
            commit('receiveTagList', data.list);
        }
    },
    async 'getTagItem'({ commit, rootState: { route: { params: { tag_name }}}}) {
        const { data: { data, code }} = await api.get('backend/tag/item', { tag_name });
        if (data && code === 200) {
            commit('receiveTagItem', data);
        }
    }
};

const mutations = {
    'receiveTagList'(states, payload) {
        states.lists = payload;
    },
    'receiveTagItem'(states, data) {
        states.item = data;
    },
    'insertTagItem'(states, data) {
        states.item = data;
    },
    'updateTagItem'(states, data) {
        states.item = data;
    },
    'deleteTag'(states, tag_name) {
        const obj = states.lists.find(ii => ii.tag_name === tag_name);
        if (obj) obj.is_delete = 1;
    },
    'deleteTagCompletely'(states, tag_name) {
        const obj = states.lists.findIndex(ii => ii.tag_name === tag_name);
        if (obj > -1) states.lists.splice(obj, 1);
    },
    'recoverTag'(states, tag_name) {
        const obj = states.lists.find(ii => ii.tag_name === tag_name);
        if (obj) obj.is_delete = 0;
    }
};

const getters = {
    'getTagList'(states) {
        return states.lists;
    },
    'getTagItem'(states) {
        return states.item;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};