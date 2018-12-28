import Vue from 'vue';
import App from './admin.vue';
import router from './router/admin';
import store from './store';
import iView from 'iview';
import i18n from '@/locale';
import config from '@/config';
import importDirective from '@/directive';
import { directive as clickOutside } from 'v-click-outside-x';
import installPlugin from '@/plugin';
import './admin.less';
import '@assets/icons/iconfont.css';
import TreeTable from 'tree-table-vue';
import VOrgTree from 'v-org-tree';
import 'v-org-tree/dist/v-org-tree.css';
import { sync } from 'vuex-router-sync';
import * as filters from './filters';


// import './assets/css/style.css';
// import './assets/css/font-awesome.css';
// import './assets/less/backend.less';
// import 'toastr/build/toastr.css';
import 'nprogress/nprogress.css';
// import 'iview/dist/styles/iview.css';

Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
});
Vue.use(TreeTable);
Vue.use(VOrgTree);
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue);
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;
/**
 * 注册指令
 */
importDirective(Vue);
Vue.directive('clickOutside', clickOutside);

sync(store, router);

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

let newVue = new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App)
});

Vue.use(newVue);
