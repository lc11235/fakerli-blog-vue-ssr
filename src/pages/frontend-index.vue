<template>
    <div class="main wrap body-wrap">
        <topics-item-none v-if="!topics.path">加载中，请稍等...</topics-item-none>
        <template v-else-if="topics.data.length > 0">
            <topics-item v-for="item in topics.data" :item="item" :key="item._id"></topics-item>
            <div class="load-more-wrap">
                <a v-if="topics.hasNext" @click="loadMore()" href="javascript:;" class="load-more">
                    更多
                    <i class="icon icon-cicle-loading"></i>
                </a>
            </div>
        </template>
        <topics-item-none v-else>当前标签还没有文章...</topics-item-none>
    </div>
</template>

<script lang="babel">
    import store2 from 'store2';
    import { mapGetters } from 'vuex';
    import topicsItem from '../components/topics-item.vue';
    import topicsItemNone from '../components/topics-item-none.vue';
    import { ssp } from '../utils';
    import metaMixin from '~mixins';

    const fetchInitialData = async (store, config = { page: 1 }) => {
        const { params: { title, by }, path } = store.state.route;
        const base = { ...config, limit: 10, title, by };
        await store.dispatch('frontend/article/getArticleList', base);
        if (config.page === 1) ssp(path);
    };

    export default {
        name: 'frontend-index',
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
        methods: {
            loadMore(page = this.topics.page + 1) {
                fetchInitialData(this.$store, { page });
            }
        },
        mounted() {
            fetchInitialData(this.$store, { page: 1 });
        },
        watch: {
            '$route'() {
                fetchInitialData(this.$store, { page: 1 });
            }
        },
        beforeRouteLeave(to, from, next) {
            const scrollTop = document.body.scrollTop;
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