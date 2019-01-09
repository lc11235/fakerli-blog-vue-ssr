import api from '~api';
import {
    getBreadCrumbList,
    setTagNavListInLocalstorage,
    getMenuByRouter,
    getTagNavListFromLocalstorage,
    getHomeRoute,
    getNextRoute,
    routeHasExist,
    routeEqual,
    getRouteTitleHandled,
    localSave,
    localRead
} from '@/libs/util';
import beforeClose from '@/router/before-close';
import { saveErrorLogger } from '@/api/data';
import router from '@/router';
import routers from '@/router/routers';
import config from '@/config';
const { homeName }  = config;

const closePage = (state, route) => {
    const nextRoute = getNextRoute(state.tagNavList, route);
    state.tagNavList = state.tagNavList.filter(item => {
        return !routeEqual(item, route);
    });
    router.push(nextRoute);
};

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
    },
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false
};

const getters = {
    'getArticleList'(states) {
        return states.lists;
    },
    'getArticleItem'(states) {
        return states.item;
    },
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.backend.admin.access),
    errorCount: state => state.errorList.length
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
    },
    setBreadCrumb(state, route) {
        state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
    },
    setHomeRoute(state, routes) {
        state.homeRoute = getHomeRoute(routes, homeName);
    },
    setTagNavList(state, list) {
        let tagList = [];
        if (list) {
            tagList = [...list];
        } else {
            tagList = getTagNavListFromLocalstorage() || [];
        }
        if (tagList[0] && tagList[0] !== homeName) {
            tagList.shift();
        }
        let homeTagIndex = tagList.findIndex(item => item.name === homeName);
        if (homeTagIndex > 0) {
            let homeTag = tagList.splice(homeTagIndex, 1)[0];
            tagList.unshift(homeTag);
        }
        state.tagNavList = tagList;
        setTagNavListInLocalstorage([...tagList]);
    },
    closeTag(state, route) {
        let tag = state.tagNavList.filter(item => routeEqual(item, route));
        route = tag[0] ? tag[0] : null;
        if (!route) return;
        if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
            new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
                if (close) {
                    closePage(state, route);
                }
            });
        } else {
            closePage(state, route);
        }
    },
    addTag(state, { route, type = 'unshift' }) {
        let router = getRouteTitleHandled(route);
        if (!routeHasExist(state.tagNavList, router)) {
            if (type === 'push') {
                state.tagNavList.push(router);
            } else {
                if (router.name === homeName) {
                    state.tagNavList.unshift(router);
                } else {
                    state.tagNavList.splice(1, 0, router);
                }
            }
            setTagNavListInLocalstorage([...state.tagNavList]);
        }
    },
    setLocal(state, lang) {
        localSave('local', lang);
        state.local = lang;
    },
    addError(state, error) {
        state.errorList.push(error);
    },
    setHasReadErrorLoggerStatus(state, status = true) {
        state.hasReadErrorPage = status;
    }
};

const actions = {
    async 'getArticleList'({ commit, rootState: { global, route: { fullPath }}}, config) {
        // const path = fullPath;
        // if (state.lists.data.length > 0 && path === state.lists.path && config.page === 1) {
        //     global.progress = 100;
        //     return;
        // }
        const { data: { data, code }} = await api.get('backend/article/list', config);
        if (data && code === 200) {
            commit('receiveArticleList', {
                ...data,
                fullPath,
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
    },
    addErrorLog({ commit, rootState }, info) {
        if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false);
        const { user: { token, userId, username }} = rootState;
        let data = {
            ...info,
            time: Date.parse(new Date()),
            token,
            userId,
            username
        };
        saveErrorLogger(info).then(() => {
            commit('addError', data);
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