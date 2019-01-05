<template>
    <div class="main wrap body-wrap">
        <topics-item-none v-if="!topics.path">加载中，请稍等...</topics-item-none>
        <template v-else-if="topics.data.length > 0">
            <topics-item v-for="item in topics.data" :item="item" :key="item._id"></topics-item>
            <nav class="page-navi">
                <router-link :to="{ path: '/', query: { pn: pn - 1}}" v-show="topics.hasPrev" class="prev">上一页</router-link>
                <router-link :to="{ path: '/', query: { pn: pn + 1 }}" v-show="topics.hasNext" class="next">下一页</router-link>
                <div class="page-center">
                    <router-link to="/archives" >
                        博客归档
                    </router-link>
                </div>
            </nav>
        </template>
        <topics-item-none v-else>当前标签还没有文章...</topics-item-none>
    </div>
</template>

<script lang="babel">
    import store2 from 'store2';
    import { mapGetters } from 'vuex';
    import topicsItem from '~views/frontend/topics-item.vue';
    import topicsItemNone from '~views/frontend/topics-item-none.vue';
    import { ssp } from '~utils';
    import metaMixin from '~mixins';

    const fetchInitialData = async (store, config = { page: 1 }) => {
        const { path } = store.state.route;
        const base = { ...config, limit: 10 };
        await store.dispatch('frontend/article/getArticleList', base);
        if (config.page === 1) ssp(path);
    };

    export default {
        name: 'frontend-index',
        data() {
            return {
                pn: 1
            };
        },
        prefetch: fetchInitialData,
        mixins: [metaMixin],
        components: {
            topicsItem, topicsItemNone
        },
        computed: {
            ...mapGetters({
                topics: 'frontend/article/getArticleList'
            })
        },
        mounted() {
            let page = this.$route.query.pn || 1;
            this.pn = page;
            fetchInitialData(this.$store, { page });
        },
        watch: {
            '$route'() {
                let page = this.$route.query.pn || 1;
                this.pn = page;
                fetchInitialData(this.$store, { page });
            }
        },
        beforeRouteLeave(to, from, next) {
            const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            const path = from.path;
            if (scrollTop) {
                store2.set(path, scrollTop);
            } else {
                store2.remove(path);
            }
            next();
        },
        metaInfo() {
            let title = '学习是为了探索这个世界的本质';
            return {
                title,
                meta: [{ vmid: 'description', name: 'description', content: title }]
            };
        }
    };
</script>