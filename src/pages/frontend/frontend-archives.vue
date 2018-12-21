<template>
    <div class="main wrap body-wrap">
        <article class="archive">
            <div v-for="item in items" :key="item.month" class="entry-content-archive">
                <h3>{{item.month.substring(0, 4) + '年' + item.month.substring(5, 7) + '月' + '(' + item.titles.length +')'}}</h3>
                <ul>
                    <li v-for="title in item.titles" :key="title.title">
                        <router-link :to="'/article/' + title.title">
                            {{title.title}}
                        </router-link>
                        &nbsp;
                        <span class="date">{{title.update_date.substring(0, 7)}}</span>
                    </li>
                </ul>
            </div>
        </article>
    </div>
</template>

<script lang="babel">
    import { mapGetters } from 'vuex';
    import metaMixin from '~mixins';
    const fetchInitialData = async store => {
        await store.dispatch('frontend/archive/getArticleList');
    };

    export default {
        name: 'frontend-tags',
        prefetch: fetchInitialData,
        mixins: [metaMixin],
        beforeRouteEnter(to, from, next) {
            // does NOT have access to `this` component instance
            next(vm => {
                fetchInitialData(vm.$store);
            });
        },
        beforeRouteUpdate(to, from, next) {
            if (to.path !== from.path) {
                fetchInitialData(this.$store);
            } else {
                this.$store.dispatch('global/gProgress', 100);
                next();
            }
        },
        computed: {
            ...mapGetters({
                items: 'frontend/archive/getArticleList'
            })
        },
        mounted() {
            if (this.items.length <= 0) {
                fetchInitialData(this.$store);
            }
            this.$store.dispatch('global/gProgress', 100);
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