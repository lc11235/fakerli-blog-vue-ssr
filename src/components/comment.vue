<template>
    <div id="gitalk-container"></div>
</template>

<script lang="babel">
    import Gitalk from 'gitalk';
    export default {
        name: 'comment',
        mounted() {
            if (window !== 'undefine') {
                const gitalk = new Gitalk({
                    clientID: '2effbaeca8853aeb7ec1',
                    clientSecret: '69455714d1912e8a704e364b8253c852a469d57b',
                    repo: 'fakerli-blog-vue-ssr',
                    owner: 'lc11235',
                    admin: ['lc11235'],
                    id: 'comment',
                    distractionFreeMode: true
                });
                gitalk.render('gitalk-container');
            }
        }
    };
</script>
