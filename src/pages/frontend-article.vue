<template>
    <div class="main wrap clearfix">
        <div class="main-left">
            <template v-if="!article.isLoad">
                <div class="card card-answer">
                    <div class="answer-content">加载中，请稍等...</div>
                </div>
            </template>
            <template v-else-if="article.data.title">
                <div class="card card-question-head">
                    <div class="question-content">
                        <router-link v-for="tag in article.data.tags" :key="tag" :to="'/tag/' + tag" v-text="tag" class="topic-link-item"></router-link>
                        <h2 class="question-title">
                            <router-link :to="'/article/' +article.data.title" v-text="article.data.title" class="question-title-link"></router-link>
                        </h2>
                    </div>
                </div>
                <div class="card card-answer">
                    <div class="answer-content">
                        <div class="article-content markdown-body" v-html="addTarget(article.data.html)"></div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="card card-answer">
                    <div class="answer-content">该文章不存在，或者该文章已经被删除</div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="babel">
    import { mapGetters } from 'vuex';
    import metaMixin from '~mixins';
    const fetchInitialData = async store => {
        await store.dispatch('frontend/article/getArticleItem');
    };

    export default {
        name: 'frontend-article',
        prefetch: fetchInitialData,
        mixins: [metaMixin],
        beforeRouteUpdate(to, from, next) {
            if(to.path !== from.path) {
                fetchInitialData(this.$store);
            } else {
                this.$store.dispatch('global/gProgress', 100);
                next();
            }
        },
        computed: {
            ...mapGetters({
                article: 'frontend/article/getArticleItem'
            })
        },
        methods: {
            addTarget(content) {
                if(!content) return '';
                return content.replace(/<a(.*?)href="http/g, '<a$1target="_blank" href="http');
            }
        },
        mounted () {
            fetchInitialData(this.$store);
        },
        metaInfo() {
            const title = this.article.data.title ? this.article.data.title + ' 学习是为了探索这个世界的本质' : '学习是为了探索这个世界的本质';
            return {
                title,
                meta: [{vmid: 'description', name: 'description', content: title}]
            };
        }
    }
</script>