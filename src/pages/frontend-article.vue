<template>
    <div class="main wrap clearfix">
        <div class="main-left">
            <template v-if="!article.isLoad">
                <div class="card card-answer">
                    <div class="answer-content">加载中，请稍等...</div>
                </div>
            </template>
            <template v-else-if="article.data.title">
                <div class="card-question-head">
                    <div class="question-content">
                        <h2 class="question-title">
                            <router-link :to="'/article/' +article.data.title" v-text="article.data.title" class="question-title-link"></router-link>
                        </h2>
                    </div>
                </div>
                <div class="card card-answer">
                    <div class="answer-content">
                        <div class="markdown-body editormd-preview-container" v-html="addTarget(article.data.html.replace(article.data.toc, ''))"></div>
                    </div>
                </div>
                <div class="article-tag-index">
                <div class="article-tag">
                    <i class="fa fa-tag tag-icon"></i>
                    <ul class="article-tag-list">
                        <li v-for="tag in article.data.tags" :key="tag" class="article-tag-list-item">
                            <router-link  :to="'/tag/' + tag" v-text="tag" class="tag-color"></router-link>
                        </li>
                    </ul>
                </div>
            </div>
            </template>
            <template v-else>
                <div class="card card-answer">
                    <div class="answer-content">该文章不存在，或者该文章已经被删除</div>
                </div>
            </template>
        </div>
        <comment />
        
        <aside class="post-widget" id="post-toc" v-show="isShow">
            <a @click="visible" href="javascript:;" class="toc-icon" id="toc-visible">
                <i class="fa fa-lg fa-bars"></i>
            </a>
            <div id="toc-main">
                <h4>TOC</h4>
                <div class="markdown-body editormd-preview-container" v-html="addTarget(article.data.toc)"></div>
            </div>           
        </aside>
    </div>
</template>

<script lang="babel">
    import { mapGetters } from 'vuex';
    import metaMixin from '~mixins';
    import comment from '../components/comment.vue';
    const fetchInitialData = async store => {
        await store.dispatch('frontend/article/getArticleItem');
    };

    export default {
        name: 'frontend-article',
        data() {
            return {
                isShow: false
            };
        },
        prefetch: fetchInitialData,
        mixins: [metaMixin],
        components: { comment },
        beforeRouteEnter(to, from, next) {
            // does NOT have access to `this` component instance
            next(vm => {
                fetchInitialData(vm.$store);
            });
        },
        beforeRouteUpdate(to, from, next) {
            if (to.path !== from.path) {
                this.$route.params.title = to.params.title;
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
                if (!content) return '';
                return content.replace(/<a(.*?)href="http/g, '<a$1target="_blank" href="http');
            },
            visible() {
                if ($('#toc-main.hide').length > 0 && $('#post-toc.hide').length > 0) {
                    $('#toc-main').removeClass('hide');
                    $('#post-toc').removeClass('hide');
                } else {
                    $('#toc-main').addClass('hide');
                    $('#post-toc').addClass('hide');
                }
            },
        },
        mounted() {
            if (!this.article) {
                fetchInitialData(this.$store);
            } else {
                this.$store.dispatch('global/gProgress', 100);
            }
            if (this.article.data.toc) {
                this.isShow = true;
            } else {
                this.isShow = false;
            }
        },
        metaInfo() {
            const title = this.article.data.title ? this.article.data.title + ' 学习是为了探索这个世界的本质' : '学习是为了探索这个世界的本质';
            return {
                title,
                meta: [{ vmid: 'description', name: 'description', content: title }]
            };
        },
        watch: {
            article(val) {
                if (val.data.toc) {
                    this.isShow = true;
                } else {
                    this.isShow = false;
                }
            }
        }
    };
</script>