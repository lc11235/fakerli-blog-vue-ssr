import Vue from 'vue';
import VueRouter from 'vue-router';
import cookies from 'js-cookie';

import { inBrowser } from '../utils';

const login = r => require.ensure([], () => r(require('../pages/backend-login.vue')), 'chunk-backend-login');
const aritcleList = r => require.ensure([], () => r(require('../pages/backend-article-list.vue')), 'chunk-backend-article');
const articleInsert = r => require.ensure([], () => r(require('../pages/backend-article-insert.vue')), 'chunk-backend-article');
const articleModify = r => require.ensure([], () => r(require('../pages/backend-article-modify.vue')), 'chunk-backend-article');
const articleComment = r => require.ensure([], () => r(require('../pages/backend-article-comment.vue')), 'chunk-backend-article');

const tagList = r => require.ensure([], () => r(require('../pages/backend-tag-list.vue')), 'chunk-backend-tag');
const tagInsert = r => require.ensure([], () => r(require('../pages/backend-tag-insert.vue')), 'chunk-backend-tag');
const tagModify = r => require.ensure([], () => r(require('../pages/backend-tag-modify.vue')), 'chunk-backend-tag');

const adminList = r => require.ensure([], () => r(require('../pages/backend-admin-list.vue')), 'chunk-backend-admin');
const adminModify = r => require.ensure([], () => r(require('../pages/backend-admin-modify.vue')), 'chunk-backend-admin');

Vue.use(VueRouter);

const scrollBehavior = to => {
    const position = {};
    if(to.hash) {
        position.selector = to.hash;
    }
    if(to.matched.some(mm => mm.meta.scrollToTop)) {
        position.x = 0;
        position.y = 0;
    }
    return position;
};

const guardRoute = (to, from, next) => {
    const token = cookies.get('b_user') || !inBrowser;
    if(!token) {
        next('/');
    } else {
        next();
    }
};

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    scrollBehavior,
    routes: [
        {name: 'login', path: '/backend', component: login},

        {name: 'admin_list', path: '/backend/admin/list', component: adminList, meta: {scrollToTop: true}, beforeEnter: guardRoute},
        {name: 'admin_modify', path: '/backend/admin/modify/:id', component: adminModify, meta: {scrollToTop: true}, beforeEnter: guardRoute},

        {name: 'article_list', path: '/backend/article/list', component: aritcleList, meta: {scrollToTop: true}, beforeEnter: guardRoute},
        {name: 'article_insert', path: '/backend/article/insert', component: articleInsert, meta: {scrollToTop: true}, beforeEnter: guardRoute},
        {name: 'article_modify', path: '/backend/article/modify/:id', component: articleModify, meta: {scrollToTop: true}, beforeEnter: guardRoute},
        {name: 'article_comment', path: '/backend/article/comment/:id', component: articleComment, meta: {scrollToTop: true}, beforeEnter: guardRoute},

        {name: 'tag_list', path: '/backend/tag/list', component: tagList, meta: {scrollToTop: true}, beforeEnter: guardRoute},
        {name: 'tag_insert', path: '/backend/tag/insert', component: tagInsert, meta: {scrollToTop: true}, beforeEnter: guardRoute},
        {name: 'tag_modify', path: '/backend/tag/modify/:id', component: tagModify, meta: {scrollToTop: true}, beforeEnter: guardRoute},

        {path: '*', redirect: { name: 'login'}}
    ]
});

export default router;
