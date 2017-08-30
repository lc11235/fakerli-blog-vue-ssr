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
    async 'getArticleList'({ commit, rootState: { global, route: { fullPath }}}, config) {
        const path = fullPath;
        console.log(state);
        if (state.lists.data.length > 0 && path === state.lists.path && config.page === 1) {
            global.progress = 100;
            return;
        }

        const { data: { data, code }} = await api.get('frontend/article/list', { ...config, cache: true });
        if (data && code === 200) {
            commit('receiveArticleList', {
                ...config,
                ...data,
                path
            });
        }
    },
    async 'getArticleItem'({ commit, rootState: { route: { path, params: { title }}}}) {
        if (path === state.item.path) {
            global.progress = 100;
            return;
        }
        const { data: { data, code }} = await api.get('frontend/article/item', { title, markdown: 1, cache: true });
        if (data && code === 200) {
            commit('receiveArticleItem', {
                data,
                path
            });
        }
    }
};

const mutations = {
    'receiveArticleList'(states, { list, hasNext, hasPrev, page, path }) {
        let tempList;
        if (page === 1) {
            tempList = [].concat(list);
        } else {
            tempList = states.lists.data.concat(list);
        }

        states.lists = {
            data: tempList, hasNext, hasPrev, page, path
        };
    },
    'receiveArticleItem'(states, { data, path }) {
        states.item = {
            data, path, isLoad: true
        };
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