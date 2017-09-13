import api from '~api';

const state = {
    lists: {
        data: [],
        path: '',
        hasNext: 0,
        hasPrev: 0,
        page: 1
    },
    item: {
        data: {},
        path: ''
    }
};

const actions = {
    async 'getArticleList'({ commit, rootState: { global, route: { fullPath }}}, config) {
        const path = fullPath;
        if (state.lists.data.length > 0 && path === state.lists.path && config.page === 1) {
            global.progress = 100;
            return;
        }
        const { data: { data, code }} = await api.get('backend/article/list', config);
        if (data && code === 200) {
            commit('receiveArticleList', {
                ...data,
                path,
                page: config.page
            });
        }
    },
    async 'getArticleItem'({ commit, rootState: { global, route: { path, params: { title }}}}) {
        if (path === state.item.path) {
            global.progress = 100;
            return;
        }
        const { data: { data, code }} = await api.get('backend/article/item', { title });
        if (data && code === 200) {
            commit('receiveArticleItem', {
                data,
                path
            });
        }
    },
    async 'deleteArticle'({ commit }, config) {
        const { data: { code }} = await api.get('backend/article/delete', config);
        if (code === 200) {
            commit('deleteArticle', config.id);
        }
    },
    async 'recoverArticle'({ commit }, config) {
        const { data: { code }} = await api.get('backend/article/recover', config);
        if (code === 200) {
            commit('recoverArticle', config.id);
        }
    }
};

const mutations = {
    'receiveArticleList'(states, { list, path, hasNext, hasPrev, page }) {
        let tempList;
        if (page === 1) {
            tempList = [].concat(list);
        } else {
            tempList = states.lists.data.concat(list);
        }
        states.lists = {
            data: tempList, path, hasNext, hasPrev, page
        };
    },
    'receiveArticleItem'(states, { data, path }) {
        states.item = {
            data, path
        };
    },
    'insertArticleItem'(states, data) {
        states.item.data = data;
    },
    'updateArticleItem'(states, data) {
        states.item.data = data;
    },
    'deleteArticle'(states, title) {
        const obj = states.lists.data.find(ii => ii.title === title);
        if (obj) obj.is_delete = 1;
    },
    'deleteArticleCompletely'(states, title) {
        const obj = states.lists.data.findIndex(ii => ii.title === title);
        if (obj > -1) states.lists.data.splice(obj, 1);
    },
    'recoverArticle'(states, title) {
        const obj = states.lists.data.find(ii => ii.title === title);
        if (obj) obj.is_delete = 0;
    }
};

const getters = {
    'getArticleList'(states) {
        return states.lists;
    },
    'getArticleItem'(states) {
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