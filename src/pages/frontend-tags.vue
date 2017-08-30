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
                <div class="load-more-wrap">
                    <a v-if="topics.hasNext" @click="loadMore()" href="javascript:;" class="load-more">
                        更多
                        <i class="icon icon-cicle-loading"></i>
                    </a>
                </div>
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
    const fetchInitialData = async (store, tag) => {
        await store.dispatch('global/tag/getTagList');
        const base = { page: 1 };
        if (tag) {
            base.tag = tag;
        }
        await store.dispatch('frontend/article/getArticleList', base);
    };

    export default {
        name: 'frontend-tags',
        prefetch: fetchInitialData,
        mixins: [metaMixin],
        components: {
            topicsItem, topicsItemNone
        },
        beforeRouteEnter(to, from, next) {
            // does NOT have access to `this` component instance
            next(vm => {
                if (to.path.match(/\/tags\//g)) {
                    if (to.params.tag) {
                        fetchInitialData(vm.$store, to.params.tag);
                    }
                } else {
                    fetchInitialData(vm.$store);
                }
            });
        },
        beforeRouteUpdate(to, from, next) {
            fetchInitialData(this.$store, to.params.tag);
            next();
        },
        computed: {
            ...mapGetters({
                tags: 'global/tag/getTagList',
                topics: 'frontend/article/getArticleList'
            })
        },
        mounted() {
            if (this.tags.length <= 0) {
                fetchInitialData(this.$store);
            } else {
                this.$store.dispatch('global/gProgress', 100);
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
