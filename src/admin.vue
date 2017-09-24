<template>
    <div id="app" class="g-doc">
        <backend-menu v-if="!isLogin"></backend-menu>
        <div id="backmain" class="back-wrap">
            <div id="backbodywrap" class="back-body-wrap">
                <transition name="fade" mode="out-in">
                    <router-view :key="key"></router-view>
                </transition>
            </div>
        </div>
        <footer-item />
    </div>
</template>

<script lang="babel">
    import { mapGetters } from 'vuex';
    import NProgress from 'nprogress';
    import backendMenu from './components/backend-menu.vue';
    import footerItem from './components/footer.vue';

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
            }
        },
        components: {
            backendMenu, footerItem
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