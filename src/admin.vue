<template>
    <div id="app" class="g-doc">
        <backend-header v-if="!isLogin" />
        <div class="backend-center">
            <backend-menu v-if="!isLogin"></backend-menu>
            <backendPage v-if="!isLogin" :pageTitle="getTitle" />
            <div class="back-wrap" :class="{'back-left': !isLogin, 'back-height': isLogin}">
                <transition name="fade" mode="out-in">
                    <router-view :key="key"></router-view>
                </transition>
            </div>
        </div>
        <footer-item v-if="!isLogin" />
    </div>
</template>

<script lang="babel">
    import { mapGetters } from 'vuex';
    import NProgress from 'nprogress';
    import backendMenu from './components/backend-menu.vue';
    import footerItem from './components/footer.vue';
    import backendHeader from './components/backend-header.vue';
    import backendPage from './components/backend-page-header.vue';

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
                let title = '';
                switch (this.$route.path) {
                    case '/backend/article/list':
                        title = '管理文章';
                        break;
                    case '/backend/article/insert':
                        title = '发布文章';
                        break;
                    case '/backend/tag/list':
                        title = '管理标签';
                        break;
                    case '/backend/tag/insert':
                        title = '添加标签';
                        break;
                    default:
                        title = '管理账号';
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