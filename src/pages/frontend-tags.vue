<template>
    <div class="main wrap body-wrap">
        <div class="entry-content">
            <section>
                <router-link :to="'/tags'">所有</router-link>
                <router-link v-for="tag in tags" :to="'/tags/' + tag.tag_name" :key="tag.tag_num">{{tag.tag_name + '(' + tag.tag_num +')'}}</router-link>
            </section>
        </div>
        <div class="watelfall-item">
            <topics-item-none v-if="!topics.path">加载中，请稍等...</topics-item-none>
            <template v-else-if="topics.data.length > 0">
                <topics-item v-for="item in topics.data" :item="item" :key="item._id"></topics-item>
                <nav class="page-navi">
                    <router-link :to="{ path: '/tags/' + tagName, query: { pn: pn - 1}}" v-show="topics.hasPrev" class="prev">上一页</router-link>
                    <router-link :to="{ path: '/tags/' + tagName, query: { pn: pn + 1 }}" v-show="topics.hasNext" class="next">下一页</router-link>
                    <div class="page-center">
                        <router-link to="/archives" >
                            博客归档
                        </router-link>
                    </div>
                </nav>
            </template>
            <topics-item-none v-else>当前标签还没有文章...</topics-item-none>
        </div>
    </div>
</template>

<script lang="babel">
    import { mapGetters } from 'vuex';
    import topicsItem from '../components/topics-item.vue';
    import topicsItemNone from '../components/topics-item-none.vue';
    import metaMixin from '~mixins';
    const fetchInitialData = async (store, tag, page) => {
        await store.dispatch('global/tag/getTagList');
        const base = { page: 1 };
        if (tag) {
            base.tag = tag;
        }
        if (page) {
            base.page = page;
        }
        await store.dispatch('frontend/article/getArticleList', base);
    };

    export default {
        name: 'frontend-tags',
        data() {
            return {
                pn: 1,
                tagName: ''
            };
        },
        prefetch: fetchInitialData,
        mixins: [metaMixin],
        components: {
            topicsItem, topicsItemNone
        },
        computed: {
            ...mapGetters({
                tags: 'global/tag/getTagList',
                topics: 'frontend/article/getArticleList'
            })
        },
        mounted() {
            let page = this.$route.query.pn || 1;
            let tag = this.$route.params.tag;
            this.pn = page;
            this.tagName = tag ? tag + '/' : '';
            fetchInitialData(this.$store, tag, page);
        },
        watch: {
            '$route'() {
                let page = this.$route.query.pn || 1;
                let tag = this.$route.params.tag;
                this.pn = page;
                this.tagName = tag ? tag + '/' : '';
                fetchInitialData(this.$store, tag, page);
            }
        },
        metaInfo() {
            const title = '学习是为了探索这个世界的本质';
            return {
                title,
                meta: [{ vmid: 'description', name: 'description', content: title }]
            };
        }
    };
</script>
