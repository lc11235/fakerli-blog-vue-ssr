import Vue from 'vue';
import App from './admin.vue';
import store from './store';
import router from './router/admin';
import { sync } from 'vuex-router-sync';
import * as filters from './filters';
import iView from 'iview';

import './assets/css/style.css';
import './assets/css/font-awesome.css';
import './assets/less/backend.less';
import 'toastr/build/toastr.css';
import 'nprogress/nprogress.css';
import 'iview/dist/styles/iview.css';

Vue.use(iView);

sync(store, router);

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

const app = new Vue({
    router,
    store,
    render: h => h(App)
});

app.$mount('#app');