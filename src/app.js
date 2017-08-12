import Vue from 'vue';
import App from './app.vue';
import store from './store';
import router from './router';
import { sync } from 'vuex-router-sync';
import * as filters from './filters';

sync(store, router);

router.beforeEach((to, from, next) => {
    if(to.path === '/tags') {
        store.dispatch('global/changeTitle', `Tags`);
    } else if(to.path === '/') {
        store.dispatch('global/changeTitle', `Fakerli's Blog`);
    } else if(to.path === '/about') {
        store.dispatch('global/changeTitle', `About`);
    } else if(to.path === '/archives') {
        store.dispatch('global/changeTitle', `Archives`);
    } else if(to.path.match(/\/article\//g)){
        store.dispatch('global/changeTitle', to.params.title);
    }
    next();
})

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

const app = new Vue({
    router,
    store,
    render: h => h(App)
});

export { app, router, store };
