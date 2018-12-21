<template>
    <div class="main wrap body-wrap clearfix">
        <div class="card card-answer">
            <div class="answer-content">
                <div class="article-content">
                    <h3 class="about-title">关于作者</h3>
                    <div class="flex-item">
                        <div class="flex-label">姓名：</div>
                        <div class="flex-content">李畅</div>
                    </div>
                    <div class="flex-item">
                        <div class="flex-label">年龄：</div>
                        <div class="flex-content">1991.10</div>
                    </div>
                    <div class="flex-item">
                        <div class="flex-label">Github:</div>
                        <div class="flex-content">
                            <a href="https://github.com/lc11235" target="_blank">@lc11235</a>
                        </div>
                    </div>
                    <div class="flex-item">
                        <div class="flex-babel">技能：</div>
                        <div class="flex-content">
                            <ul class="about-ul">
                                <li>HTML5 +CSS3</li>
                                <li>Node.JS</li>
                                <li>Vue</li>
                                <li>ES6</li>
                                <li>WebPack</li>
                                <li>C#</li>
                            </ul>
                        </div>
                    </div>
                    <h3 class="about-title">关于网站</h3>
                    <p>本站服务端采用 express + mongoDB 搭建, 客户端采用 Vue2 的服务端渲染搭建</p>
                    <p>网站分成前台和后台, 前台采用 SSR 模式渲染, 后台采用 SPA 模式</p>
                    <p>主要功能包括: 管理员, 用户, 标签, 文章, 评论, 文章点赞</p>
                    <p>主要技术栈: express, mongoose, vue2, vue2-router, vuex, webpack, babel, eslint</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="babel">
    import metaMixin from '~mixins';

    export default {
        name: 'frontend-index',
        mixins: [metaMixin],
        mounted() {
            this.$store.dispatch('global/gProgress', 100);
        },
        metaInfo() {
            return {
                title: '学习是为了探索这个世界的本质',
                meta: [{ vmid: 'description', name: 'description', content: 'fakerli的博客' }]
            };
        }
    };
</script>