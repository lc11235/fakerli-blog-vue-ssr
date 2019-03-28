import {
    getTagList,
    insertTagSingle,
    deleteTagSingle,
    modifyTagSingle,
    getTagSingle,
    recoverTagSingle,
    deleteTagCompletelySingle,
    getClassifyTagList,
    insertClassifyTagSingle,
    deleteClassifyTagSingle,
    modifyClassifyTagSingle,
    getClassifyTagSingle,
    recoverClassifyTagSingle,
    deleteClassifyTagCompletelySingle
} from '@/api/tag';

const state = {
    tagLists: {
        data: [],
        total: 0,
        page: 1
    },
    tagSingle: {},
    classifyTagLists: {
        data: [],
        total: 0,
        page: 1
    },
    classifyTagSingle: {}
};

const mutations = {
    'getTagList'(states, payload) {
        states.tagLists.data = [].concat(payload.list);
        states.tagLists.total = payload.total;
        states.tagLists.page = payload.page;
    },
    'insertTagSingle'(states, data) {
        states.tagSingle = data;
    },
    'deleteTagSingle'(states, tagId) {
        const obj = states.tagLists.data.find(ii => ii._id === tagId);
        if (obj) obj.is_delete = 1;
    },
    'modifyTagSingle'(states, data) {
        states.tagSingle = data;
    },
    'getTagSingle'(states, data) {
        states.tagSingle = data;
    },
    'recoverTagSingle'(states, tagId) {
        const obj = states.tagLists.data.find(ii => ii._id === tagId);
        if (obj) obj.is_delete = 0;
    },
    'deleteTagCompletelySingle'(states, tagId) {
        const obj = states.tagLists.data.findIndex(ii => ii._id === tagId);
        if (obj > -1) states.tagLists.data.splice(obj, 1);
    },
    'getClassifyTagList'(states, payload) {
        states.classifyTagLists.data = [].concat(payload.list);
        states.classifyTagLists.total = payload.total;
        states.classifyTagLists.page = payload.page;
    },
    'insertClassifyTagSingle'(states, data) {
        states.classifyTagSingle = data;
    },
    'deleteClassifyTagSingle'(states, tagId) {
        const obj = states.classifyTagLists.data.find(ii => ii._id === tagId);
        if (obj) obj.is_delete = 1;
    },
    'modifyClassifyTagSingle'(states, data) {
        states.classifyTagSingle = data;
    },
    'getClassifyTagSingle'(states, data) {
        states.classifyTagSingle = data;
    },
    'recoverClassifyTagSingle'(states, tagId) {
        const obj = states.classifyTagLists.data.find(ii => ii._id === tagId);
        if (obj) obj.is_delete = 0;
    },
    'deleteClassifyTagCompletelySingle'(states, tagId) {
        const obj = states.classifyTagLists.data.findIndex(ii => ii._id === tagId);
        if (obj > -1) states.classifyTagLists.data.splice(obj, 1);
    },
};

const getters = {
    'getTagList'(states) {
        return states.tagLists;
    },
    'getTagSingle'(states) {
        return states.tagSingle;
    },
    'getClassifyTagList'(states) {
        return states.classifyTagLists;
    },
    'getClassifyTagSingle'(states) {
        return states.classifyTagSingle;
    }
};

const actions = {
    handleGetTagList({ commit }, config) {
        return new Promise((resolve, reject) => {
            getTagList(config).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('getTagList', data.data);
                    resolve();
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleInsertTagSingle({ commit }, { tagName, tagDesc, tagClassify }) {
        return new Promise((resolve, reject) => {
            insertTagSingle({
                tagName,
                tagDesc,
                tagClassify
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('insertTagSingle', {
                        ...data.data
                    });
                    resolve();
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleDeleteTagSingle({ commit }, { tagId }) {
        return new Promise((resolve, reject) => {
            deleteTagSingle({
                tagId
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('deleteTagSingle', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleModifyTagSingle({ commit }, { tagId, tagName, tagDesc, tagClassify }) {
        return new Promise((resolve, reject) => {
            modifyTagSingle({
                tagId,
                tagName,
                tagDesc,
                tagClassify
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('modifyTagSingle', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleGetTagSingle({ commit }, { tagId }) {
        return new Promise((resolve, reject) => {
            getTagSingle({ tagId }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('getTagSingle', data.data);
                    resolve();
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleRecoverTagSingle({ commit }, { tagId }) {
        return new Promise((resolve, reject) => {
            recoverTagSingle({
                tagId
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('recoverTagSingle', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleDeleteTagCompletelySingle({ commit }, { tagId }) {
        return new Promise((resolve, reject) => {
            deleteTagCompletelySingle({
                tagId
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('deleteTagCompletelySingle', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleGetClassifyTagList({ commit }, config) {
        return new Promise((resolve, reject) => {
            getClassifyTagList(config).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('getClassifyTagList', data.data);
                    resolve();
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleInsertClassifyTagSingle({ commit }, { tagName, tagDesc, tagClassify }) {
        return new Promise((resolve, reject) => {
            insertClassifyTagSingle({
                tagName,
                tagDesc,
                tagClassify
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('insertClassifyTagSingle', {
                        ...data.data
                    });
                    resolve();
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleDeleteClassifyTagSingle({ commit }, { tagId }) {
        return new Promise((resolve, reject) => {
            deleteClassifyTagSingle({
                tagId
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('deleteClassifyTagSingle', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleModifyClassifyTagSingle({ commit }, { tagId, tagName, tagDesc, tagClassify }) {
        return new Promise((resolve, reject) => {
            modifyClassifyTagSingle({
                tagId,
                tagName,
                tagDesc,
                tagClassify
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('modifyClassifyTagSingle', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleGetClassifyTagSingle({ commit }, { tagId }) {
        return new Promise((resolve, reject) => {
            getClassifyTagSingle({ tagId }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('getClassifyTagSingle', data.data);
                    resolve();
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleRecoverClassifyTagSingle({ commit }, { tagId }) {
        return new Promise((resolve, reject) => {
            recoverClassifyTagSingle({
                tagId
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('recoverClassifyTagSingle', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleDeleteClassifyTagCompletelySingle({ commit }, { tagId }) {
        return new Promise((resolve, reject) => {
            deleteClassifyTagCompletelySingle({
                tagId
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('deleteClassifyTagCompletelySingle', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
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