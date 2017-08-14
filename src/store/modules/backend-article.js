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
    async ['getArticleList'] ({commit, rootState: {global, route: { fullPath }}}, config) {
        const path = fullPath;
        if(state.lists.data.length > 0 && path === state.lists.path && config.page === 1){
            global.progress = 100;
            return;
        }
        const {data: {data, code}} = await api.get('backend/article/list', config);
        if(data && code === 200) {
            commit('receiveArticleList', {
                ...data,
                path,
                page: config.page
            });
        }
    },
    async ['getArticleItem'] ({commit, rootState: {global, route: {path, params: {title}}}}) {
        if(path === state.item.path) {
            global.progress = 100;
            return;
        }
        const {data: {data, code}} = await api.get('backend/article/item', {title});
        if(data && code === 200) {
            commit('receiveArticleItem', {
                data,
                path
            });
        }
    },
    async ['deleteArticle'] ({commit}, config) {
        const {data: {code}} = await api.get('backend/article/delete', config);
        if(code === 200) {
            commit('deleteArticle', config.id);
        }
    },
    async ['recoverArticle'] ({commit}, config) {
        const {data: { code }} = await api.get('backend/article/recover', config);
        if(code === 200) {
            commit('recoverArticle', config.id);
        }
    }
};

const mutations = {
    ['receiveArticleList'](state, {list, path, hasNext, hasPrev, page}) {
        if(page === 1) {
            list = [].concat(list);
        } else {
            list = state.lists.data.concat(list);
        }
        state.lists = {
            data: list, path, hasNext, hasPrev, page
        };
    },
    ['receiveArticleItem'] (state, {data, path}) {
        state.item = {
            data, path
        };
    },
    ['insertArticleItem'](state, data) {
        state.item.data = data;
    },
    ['updateArticleItem'](state, data) {
        state.item.data = data;
    },
    ['deleteArticle'](state, title) {
        const obj = state.lists.data.find(ii => ii.title === title);
        if(obj) obj.is_delete = 1;
    },
    ['recoverArticle'] (state, title) {
        const obj = state.lists.data.find(ii => ii.title === title);
        if(obj) obj.is_delete = 0;
    }
};

const getters = {
    ['getArticleList'](state) {
        return state.lists;
    },
    ['getArticleItem'](state) {
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