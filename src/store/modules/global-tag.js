import api from '~api';

import {
    getTagList,
    postTagInsert,
    getTagClassifyList,
    getRecoverTag,
    getDeleteTag,
    getDeleteCompletelyTag
} from '@/api/tag';

const state = {
    lists: [],
    item: {},
    classifyLists: []
};

const mutations = {
    'receiveTagList'(states, payload) {
        states.lists = payload;
    },
    'receiveClassifyList'(states, payload) {
        states.classifyLists = payload;
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
    'insertClassifyItem'(states, data) {
        states.classifyLists.push(data);
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
    },
    'getClassifyList'(states) {
        return states.classifyLists;
    }
};

const actions = {
    getTagList({ commit }) {
        // if (state.lists.length) return;
        return new Promise((resolve, reject) => {
            getTagList().then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('receiveTagList', data.data.list);
                    resolve();
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    async getTagItem({ commit, rootState: { route: { params: { tag_name }}}}) {
        const { data: { data, code }} = await api.get('backend/tag/item', { tag_name });
        if (data && code === 200) {
            commit('receiveTagItem', data);
        }
    },
    getClassifyList({ commit }) {
        // if (state.lists.length) return;
        return new Promise((resolve, reject) => {
            getTagClassifyList().then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('receiveClassifyList', data.data.list);
                    resolve();
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleInsertTag({ commit }, { tag_name, tag_desc, tag_classify }) {
        return new Promise((resolve, reject) => {
            postTagInsert({
                tag_name,
                tag_desc,
                tag_classify
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('insertTagItem', {
                        ...data.data
                    });
                    if (tag_classify !== '') {
                        commit('insertClassifyItem', data.data);
                    }
                    resolve();
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleRecoverTag({ commit }, { tag_name }) {
        return new Promise((resolve, reject) => {
            getRecoverTag({
                tag_name
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('recoverTag', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleDeleteTag({ commit }, { tag_name }) {
        return new Promise((resolve, reject) => {
            getDeleteTag({
                tag_name
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('deleteTag', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleDeleteCompletelyTag({ commit }, { tag_name }) {
        return new Promise((resolve, reject) => {
            getDeleteCompletelyTag({
                tag_name
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('deleteTagCompletely', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};