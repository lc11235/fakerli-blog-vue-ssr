import Vue from 'vue';
import VueRouter from 'vue-router';
import Meta from 'vue-meta';
// import cookies from 'js-cookie';

// import { inBrowser } from '../utils';

import index from '../pages/frontend-index.vue';
import article from '../pages/frontend-article.vue';
import about from '../pages/frontend-about.vue';
import tags from '../pages/frontend-tags.vue';
import archives from '../pages/frontend-archives.vue';

Vue.use(VueRouter);
Vue.use(Meta);

const scrollBehavior = to => {
    const position = {};
    if (to.hash) {
        position.selector = to.hash;
    }
    if (to.matched.some(mm => mm.meta.scrollToTop)) {
        position.x = 0;
        position.y = 0;
    }
    return position;
};

// const guardRoute = (to, from, next) => {
//    const token = cookies.get('user') || !inBrowser;
//    if(!token) {
//        next('/');
//    } else {
//        next();
//    }
// };

const router = new VueRouter({
    mode: 'history',
    scrollBehavior,
    routes: [
        { name: 'index', path: '/', component: index, meta: { scrollToTop: true }},
        { name: 'tags', path: '/tags', component: tags, meta: { scrollToTop: true }},
        { name: 'archives', path: '/archives', component: archives, meta: { scrollToTop: true }},
        { name: 'tag', path: '/tags/:tag', component: tags, meta: { scrollToTop: true }},
        { name: 'article', path: '/article/:title', component: article, meta: { scrollToTop: true }},
        { name: 'about', path: '/about', component: about, meta: { scrollToTop: true }}
    ]
});

export default router;