<template>
    <div class="feed-content">
        <div class="feed-content-item">
            <span class="feed-time">{{ resizeDate(item.update_date)}}</span>
            <span class="feed-source">
                来自分类 <router-link :to="'/category/' + item.category" v-text="item.category_name" class="feed-minor-link"></router-link>
            </span>
            <div class="feed-main-link-wrap">
                <router-link :to="'/article/' + item._id" v-text="item.title" class="feed-main-link"></router-link>
            </div>
            <div class="feed-desc-wrap">
                <div class="feed-article-content markdonw-body" v-text="item.content"></div>
            </div>
            <actions :item="item"></actions>
        </div>
    </div>
</template>

<script lang="babel">
    import actions from './item-actions.vue';
    export default {
        name: 'index-item',
        serverCacheKey: props => {
            return `frontend::topics::item::${props.item._id}`;
        },
        props: ['item'],
        data() {
            return {
                showMore: false
            };
        },
        components: {
            actions
        },
        methods: {
            resizeDate(date) {
                return date.substring(0, 10);
            }
        }
    }
</script>