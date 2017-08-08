import api from '~api';

const state = {
    lists: {
        data: [],
        path: ''
    }
};

const actions = {
    async ['getArticleList']({commit, state, rootState: {global, route: { fullPath }}}) {
        const path = fullPath;
        if(state.lists.data.length > 0 && path === state.lists.path) {
            global.progress = 100;
            return;
        }

        const {data: {data, code}} = await api.get('frontend/archive/listTitle', {cache: true});
        if(data && code === 200) {
            commit('receiveArticleList', {
                ...data,
                path
            });
        }
    }
};

const mutations = {
    ['receiveArticleList'](state, {list, path}) {
        // 因为不是分页查询，所以不需要进行数据的拼接
        //list = state.lists.data.concat(list);
        //list = state.lists.data;
        state.lists = {
            data: list, path
        };
    }
};

const getters = {
    ['getArticleList'](state) {
        return state.lists.data;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};