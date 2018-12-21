<template>
    <div id="app" class="g-doc">
        <backend-header v-if="!isLogin" />
        <div class="backend-center">
            <backend-menu v-show="!isLogin"></backend-menu>
            <div class="back-main">
                <backendPage v-show="!isLogin" :pageTitle="getTitle" />
                <div class="back-block">
                    <div class="back-wrap" :class="{'back-left': !isLogin, 'back-height': isLogin}">
                        <transition name="fade" mode="out-in">
                            <router-view :key="key"></router-view>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
        <footer-item v-show="!isLogin" />
    </div>
</template>

<script lang="babel">
    import { mapGetters } from 'vuex';
    import NProgress from 'nprogress';
    import backendMenu from '~components/backend/backend-menu.vue';
    import footerItem from '~components/public/footer.vue';
    import backendHeader from '~components/backend/backend-header.vue';
    import backendPage from '~components/backend/backend-page-header.vue';

    export default {
        name: 'backend',
        computed: {
            ...mapGetters({
                global: 'global/getGlobal'
            }),
            key() {
                return this.$route.path.replace(/\//g, '_');
            },
            backend() {
                return this.$route.path.indexOf('backend') >= 0;
            },
            isLogin() {
                return this.$route.path === '/backend/login' || this.$route.path === '/backend/register';
            },
            getTitle() {
                let title = {};
                switch (this.$route.path) {
                    case '/backend/article/list':
                        title.middle = '文章 ';
                        title.end = '/ 管理文章';
                        break;
                    case '/backend/article/insert':
                        title.middle = '文章 ';
                        title.end = '/ 发布文章';
                        break;
                    case '/backend/tag/list':
                        title.middle = '标签 ';
                        title.end = '/ 管理标签';
                        break;
                    case '/backend/tag/insert':
                        title.middle = '标签 ';
                        title.end = '/ 添加标签';
                        break;
                    default:
                        title.middle = '文章 ';
                        title.end = '/ 管理文章';
                }
                return title;
            }
        },
        components: {
            backendMenu, footerItem, backendHeader, backendPage
        },
        watch: {
            'global.progress'(val) {
                if (val === 0) {
                    NProgress.set(0);
                    NProgress.start();
                } else if (val === 100) {
                    NProgress.done();
                } else {
                    NProgress.set(val / 100);
                    NProgress.start();
                }
            }
        }
    };
</script>