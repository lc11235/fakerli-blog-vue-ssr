<template>
    <div id="app" class="g-doc">
        <Navigation />
        <main id="main">
            <top-header :title="global.title" :show.sync="isShow" />
            <content-header :title="global.title" />
            <transition name="fade" mode="out-in">
                <router-view :key="key" class="router"></router-view>
            </transition>
            <back-top />
            <footer-item />
        </main>
        <search :show.sync="isShow" />
    </div>
</template>

<script lang="babel">
    import { mapGetters } from 'vuex';
    import NProgress from 'nprogress';
    import Navigation from '~views/frontend/navigation.vue';
    import backTop from '~views/frontend/back-top.vue';
    import topHeader from '~views/frontend/top-header.vue';
    import contentHeader from '~views/frontend/content-header.vue';
    import search from '~views/frontend/search.vue';

    import footerItem from '~views/public/footer.vue';

    export default {
        name: 'app',
        data() {
            return {
                isShow: false
            };
        },
        computed: {
            ...mapGetters({
                global: 'global/getGlobal'
            }),
            key() {
                return this.$route.path.replace(/\//g, ' ');
            }
        },
        components: {
            Navigation,
            topHeader,
            contentHeader,
            backTop,
            footerItem,
            search
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