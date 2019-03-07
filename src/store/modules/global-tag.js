import {
    getTagList,
    getTagClassifyList,
    insertTagSingle,
    getTagSingle,
    deleteTagSingle,
    recoverTagSingle,
    deleteCompletelyTagSingle
} from '@/api/tag';

const state = {
    tagLists: {
        data: [],
        total: 0,
        page: 1
    },
    tagItem: {},
    classifyLists: []
};

const mutations = {
    'receiveTagList'(states, payload) {
        states.tagLists.data = [].concat(payload.list);
        states.tagLists.total = payload.total;
        states.tagLists.page = payload.page;
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
    'receiveClassifyList'(states, payload) {
        states.classifyLists = payload;
    },
    'insertClassifyList'(states, data) {
        states.classifyLists.push(data);
    },
    'deleteTag'(states, tag_name) {
        const obj = states.tagLists.data.find(ii => ii.tag_name === tag_name);
        if (obj) obj.is_delete = 1;
    },
    'deleteTagCompletely'(states, tag_name) {
        const obj = states.tagLists.data.findIndex(ii => ii.tag_name === tag_name);
        if (obj > -1) states.tagLists.data.splice(obj, 1);
    },
    'recoverTag'(states, tag_name) {
        const obj = states.tagLists.data.find(ii => ii.tag_name === tag_name);
        if (obj) obj.is_delete = 0;
    }
};

const getters = {
    'getTagList'(states) {
        return states.tagLists;
    },
    'getTagItem'(states) {
        return states.item;
    },
    'getClassifyList'(states) {
        return states.classifyLists;
    }
};

const actions = {
    getTagList({ commit }, config) {
        // if (state.lists.length) return;
        return new Promise((resolve, reject) => {
            getTagList(config).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('receiveTagList', data.data);
                    resolve();
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    getTagItem({ commit }, { tagId }) {
        return new Promise((resolve, reject) => {
            getTagSingle({ tagId }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('receiveTagItem', data.data);
                    resolve();
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
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
            insertTagSingle({
                tag_name,
                tag_desc,
                tag_classify
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('insertTagItem', {
                        ...data.data
                    });
                    if (tag_classify === 'classify') {
                        commit('insertClassifyList', data.data);
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
            recoverTagSingle({
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
            deleteTagSingle({
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
            deleteCompletelyTagSingle({
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