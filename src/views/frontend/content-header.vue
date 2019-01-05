<template>
    <header class="content-header">
        <div class="container fade-scale in">
            <h1 class="title">{{title}}</h1>
            <h5 class="subtitle">Web技术分享</h5>
        </div>
        <tooltip-box :content="content" v-show="isShow" />
    </header>
</template>

<script lang="babel">
    import tooltipBox from '~views/frontend/tooltip-box.vue';
    export default {
        name: 'content-header',
        data() {
            return {
                isShow: false,
                content: '罗滕伯格园内的葡萄园，德国巴登-符腾堡州 (© Werner Dieterich/plainpicture)'
            };
        },
        components: {
            tooltipBox
        },
        props: ['title'],
        mounted() {
            let _this = this;
            $('.content-header').mouseleave(function (e) {
                _this.isShow = false;
            });
            $('.content-header').mouseenter(function (e) {
                _this.isShow = true;
            });
            $('.top-header').mouseenter(function (e) {
                _this.isShow = true;
            });
            $('.top-header').mouseleave(function (e) {
                // 此处两个页面连接在一起，刚好上页面下侧出下页面进，上页面隐藏下页面显式。
                // 如果从上页面顶部出，则消失。
                _this.isShow = false;
            });
        }
    };
</script>