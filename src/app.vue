<template>
    <div id="app" class="g-doc">
        <Navigation />
        <main id="main">
            <top-header :title="global.title" />
            <content-header :title="global.title" />
            <transition name="fade" mode="out-in">
                <router-view :key="key" class="router"></router-view>
            </transition>
            <back-top />
            <footer-item />
        </main>
    </div>
</template>

<script lang="babel">
    import { mapGetters } from 'vuex';
    import NProgress from 'nprogress';
    import Navigation from './components/navigation.vue';
    import backTop from './components/backtop.vue';
    import topHeader from './components/top-header.vue';
    import contentHeader from './components/content-header.vue';
    import footerItem from './components/footer.vue';

    export default {
        name: 'app',
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
            footerItem
        },
        watch: {
            'global.progress'(val) {
                if(val === 0) {
                    NProgress.set(0);
                    NProgress.start();
                } else if(val === 100) {
                    NProgress.done();
                } else {
                    NProgress.set(val / 100);
                    NProgress.start();
                }
            }
        }
    }
</script>