import Vue from 'vue';
import Vuex from 'vuex';
import backendAdmin from './modules/backend-admin';
import backendArticle from './modules/backend-article';
import global from './modules/global';
import globalTag from './modules/global-tag';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        backend: {
            namespaced: true,
            modules: {
                admin: backendAdmin,
                article: backendArticle
            }
        },
        global: {
            namespaced: true,
            ...global,
            modules: {
                tag: globalTag
            }
        }
    }
});