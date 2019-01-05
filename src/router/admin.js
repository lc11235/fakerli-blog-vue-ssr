// import Vue from 'vue';
// import VueRouter from 'vue-router';
// import cookies from 'js-cookie';

// import { inBrowser } from '../utils';

// const login = r => require.ensure([], () => r(require('../pages/backend/backend-login.vue')), 'chunk-backend-login');
// const register = r => require.ensure([], () => r(require('../pages/backend/backend-register.vue')), 'chunk-backend-register');

// const articleList = r => require.ensure([], () => r(require('../pages/backend/backend-article-list.vue')), 'chunk-backend-article');
// const articleInsert = r => require.ensure([], () => r(require('../pages/backend/backend-article-insert.vue')), 'chunk-backend-article');
// const articleModify = r => require.ensure([], () => r(require('../pages/backend/backend-article-modify.vue')), 'chunk-backend-article');

// const tagList = r => require.ensure([], () => r(require('../pages/backend/backend-tag-list.vue')), 'chunk-backend-tag');
// const tagInsert = r => require.ensure([], () => r(require('../pages/backend/backend-tag-insert.vue')), 'chunk-backend-tag');
// const tagModify = r => require.ensure([], () => r(require('../pages/backend/backend-tag-modify.vue')), 'chunk-backend-tag');

// const adminList = r => require.ensure([], () => r(require('../pages/backend/backend-admin-list.vue')), 'chunk-backend-admin');
// const adminModify = r => require.ensure([], () => r(require('../pages/backend/backend-admin-modify.vue')), 'chunk-backend-admin');

// Vue.use(VueRouter);

// const scrollBehavior = to => {
//    const position = {};
//    if (to.hash) {
//        position.selector = to.hash;
//    }
//    if (to.matched.some(mm => mm.meta.scrollToTop)) {
//        position.x = 0;
//        position.y = 0;
//    }
//    return position;
// };

// const guardRoute = (to, from, next) => {
//    const token = cookies.get('b_user') || !inBrowser;
//    if (!token) {
//        next('/backend/login');
//    } else {
//        next();
//    }
// };
// const router = new VueRouter({
//    mode: 'history',
//    base: __dirname,
//    scrollBehavior,
//    routes: [
//        { name: 'login', path: '/backend/login', component: login },
//        { name: 'register', path: '/backend/register', component: register },
//
//        { name: 'admin_list', path: '/backend/admin/list', component: adminList, meta: { scrollToTop: true }, beforeEnter: guardRoute },
//        { name: 'admin_modify', path: '/backend/admin/modify/:username', component: adminModify, meta: { scrollToTop: true }, beforeEnter: guardRoute },
//
//        { name: 'article_list', path: '/backend/article/list', component: articleList, meta: { scrollToTop: true }, beforeEnter: guardRoute },
//        { name: 'article_insert', path: '/backend/article/insert', component: articleInsert, meta: { scrollToTop: true }, beforeEnter: guardRoute },
//        { name: 'article_modify', path: '/backend/article/modify/:title', component: articleModify, meta: { scrollToTop: true }, beforeEnter: guardRoute },
//
//        { name: 'tag_list', path: '/backend/tag/list', component: tagList, meta: { scrollToTop: true }, beforeEnter: guardRoute },
//        { name: 'tag_insert', path: '/backend/tag/insert', component: tagInsert, meta: { scrollToTop: true }, beforeEnter: guardRoute },
//        { name: 'tag_modify', path: '/backend/tag/modify/:tag_name', component: tagModify, meta: { scrollToTop: true }, beforeEnter: guardRoute },
//
//        { path: '*', redirect: { name: 'login' }}
//    ]
// });

// export default router;
import Vue from 'vue';
import Router from 'vue-router';
import routes from './routers';
import store from '@/store';
import iView from 'iview';
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util.js';
import config from '@/config';
const { homeName } = config;

Vue.use(Router);
const router = new Router({
    routes,
    mode: 'history'
});
const LOGIN_PAGE_NAME = 'login';

const turnTo = (to, access, next) => {
    if (canTurnTo(to.name, access, routes)) next(); // 有权限，可访问
    else next({ replace: true, name: 'error_401' }); // 无权限，重定向到401页面
};

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    const token = getToken();
    if (!token && to.name !== LOGIN_PAGE_NAME) {
        // 未登录且要跳转的页面不是登录页
        next({
            name: LOGIN_PAGE_NAME   // 跳转到登录页
        });
    } else if (!token && to.name === LOGIN_PAGE_NAME) {
        // 未登录且要跳转的页面是登录页
        next(); // 跳转
    } else if (token && to.name === LOGIN_PAGE_NAME) {
        // 已登录且要跳转的页面是登录页
        next({
            name: homeName  // 跳转到homeName页
        });
    } else {
        if (store.state.user.hasGetInfo) {
            turnTo(to, store.state.user.access, next);
        } else {
            store.dispatch('getUserInfo').then(user => {
                // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问；
                // access必须是一个数组，如：['super_admin] ['super_admin', 'admin']
                turnTo(to, user.access, next);
            }).catch(() => {
                setToken('');
                next({
                    name: 'login'
                });
            });
        }
    }
});

router.afterEach(to => {
    setTitle(to, router.app);
    iView.LoadingBar.finish();
    window.scrolllTo(0, 0);
});

export default router;
