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
import {
    getArticleList,
    insertArticleSingle,
    deleteArticleSingle,
    modifyArticleSingle,
    getArticleSingle,
    deleteCompletelyArticleSingle,
    recoverArticleSingle,
} from '@/api/article';
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
    articleLists: {
        data: [],
        total: 0,
        page: 1
    },
    articleSingle: {},
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false
};

const getters = {
    'getArticleList'(states) {
        return states.articleLists;
    },
    'getArticleSingle'(states) {
        return states.articleSingle;
    },
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.backend.admin.access),
    errorCount: state => state.errorList.length
};

const mutations = {
    'getArticleList'(states, payload) {
        states.articleLists.data = [].concat(payload.list);
        states.articleLists.total = payload.total;
        states.articleLists.page = payload.page;
    },
    'insertArticleSingle'(states, data) {
        states.articleSingle = data;
    },
    'deleteArticleSingle'(states, articleId) {
        const obj = states.articleLists.data.find(ii => ii._id === articleId);
        if (obj) obj.is_delete = 1;
    },
    'modifyArticleSingle'(states, data) {
        states.articleSingle = data;
    },
    'getArticleSingle'(states, data) {
        states.articleSingle = data;
    },
    'deleteCompletelyArticleSingle'(states, articleId) {
        const obj = states.articleLists.data.findIndex(ii => ii._id === articleId);
        if (obj > -1) states.articleLists.data.splice(obj, 1);
    },
    'recoverArticleSingle'(states, articleId) {
        const obj = states.articleLists.data.find(ii => ii._id === articleId);
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
        if (tagList[0] && tagList[0].name !== homeName) {
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
    handleGetArticleList({ commit }, config) {
        return new Promise((resolve, reject) => {
            getArticleList(config).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('getArticleList', data.data);
                    resolve();
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleInsertArticleSingle({ commit }, { tagString, content, html, title, tocHTML }) {
        return new Promise((resolve, reject) => {
            insertArticleSingle({
                tagString,
                content,
                html,
                title,
                tocHTML
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('insertArticleSingle', {
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
    handleDeleteArticleSingle({ commit }, { articleId, tagList }) {
        return new Promise((resolve, reject) => {
            deleteArticleSingle(
                articleId,
                tagList
            ).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('deleteArticleSingle', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleModifyArticleSingle({ commit }, { articleId, content, html, title, toc, tagListOld, tagListNew }) {
        return new Promise((resolve, reject) => {
            modifyArticleSingle({
                articleId,
                content,
                html,
                title,
                toc,
                tagListOld,
                tagListNew
            }).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('modifyArticleSingle', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleGetArticleSingle({ commit }, { articleId, tagList }) {
        return new Promise((resolve, reject) => {
            getArticleSingle(
                articleId,
                tagList
            ).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('getArticleSingle', data.data);
                    resolve();
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleRecoverArticleSingle({ commit }, { articleId, tagList }) {
        return new Promise((resolve, reject) => {
            recoverArticleSingle(
                articleId,
                tagList
            ).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('recoverArticleSingle', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
    },
    handleDeleteCompletelyArticleSingle({ commit }, { articleId, tagList }) {
        return new Promise((resolve, reject) => {
            deleteCompletelyArticleSingle(
                articleId,
                tagList
            ).then(res => {
                const data = res.data;
                if (data && data.code === 200) {
                    commit('deleteCompletelyArticleSingle', data.data);
                    resolve(data.message);
                } else {
                    reject(data.message);
                }
            }).catch(err => {
                reject(err);
            });
        });
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