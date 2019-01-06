import Vue from 'vue';
import Vuex from 'vuex';
import backendAdmin from './modules/backend-admin';
import backendArticle from './modules/backend-article';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        backend: {
            namespaced: true,
            modules: {
                admin: backendAdmin,
                article: backendArticle
            }
        }
    }
});