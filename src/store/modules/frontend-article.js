import api from '~api';

const state = {
    lists: {
        data: [],
        hasNext: 0,
        page: 1,
        path: ''
    },
    item: {
        data: {},
        path: '',
        isLoad: false
    }
};

const actions = {
    async ['getArticleList']({commit, state, rootState: {global, route: { fullPath }}}, config) {
        const path = fullPath;
        if(state.lists.data.length > 0 && path === state.lists.path && config.page === 1) {
            global.progress = 100;
            return;
        }

        const {data: {data, code}} = await api.get('frontend/article/list', {...config, cache: true});
        if(data && code === 200) {
            commit('receiveArticleList', {
                ...config,
                ...data,
                path
            });
        }
    },
    async ['getArticleItem']({commit, state, rootState: {route: { path, params: { title }}}}) {
        if(path === state.item.path) {
            global.progress = 100;
            return;
        }
        const {data: {data, code}} = await api.get('frontend/article/item', {title, markdown: 1, cache: true});
        if(data && code === 200) {
            commit('receiveArticleItem', {
                data,
                path
            });
        }
    }
};

const mutations = {
    ['receiveArticleList'](state, {list, hasNext, hasPrev, page, path}) {
        if(page === 1) {
            list = [].concat(list);
        } else {
            list = state.lists.data.concat(list);
        }

        state.lists = {
            data: list, hasNext, hasPrev, page, path
        };
    },
    ['receiveArticleItem'](state, {data, path}) {
        state.item = {
            data, path, isLoad: true
        };
    }
};

const getters = {
    ['getArticleList'](state) {
        return state.lists;
    },
    ['getArticleItem'](state) {
        return state.item
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};