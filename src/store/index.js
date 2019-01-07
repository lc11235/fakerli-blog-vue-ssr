import Vue from 'vue';
import Vuex from 'vuex';
import frontendArticle from './modules/frontend-article';
import frontendArchives from './modules/frontend-archives';
import global from './modules/global';
import globalTag from './modules/global-tag';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        frontend: {
            namespaced: true,
            modules: {
                article: frontendArticle,
                archive: frontendArchives
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