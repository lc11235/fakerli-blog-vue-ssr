<template>
    <div id="app" class="g-doc">
        <router-view/>
    </div>
</template>

<script lang="babel">
    import NProgress from 'nprogress';

    export default {
        name: 'backend',
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

<style lang="less">
    .size {
        width: 100%;
        height: 100%;
    }

    html, body {
        .size;
        overflow: hidden;
        margin: 0;
        padding: 0;
    }
    
    #app {
        .size;
    }
</style>