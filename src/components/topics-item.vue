<template>
    <div class="feed-content">
        <div class="feed-content-item">
            <div class="feed-time feed-bottom-margin">{{ resizeDate(item.update_date)}}</div>
            <div class="feed-main-link-wrap feed-bottom-margin">
                <router-link :to="'/article/' + item._id" v-text="item.title" class="feed-main-link"></router-link>
            </div>
            <div class="feed-desc-wrap feed-bottom-margin">
                <div class="feed-article-content markdonw-body">
                    {{item.content}}
                    <router-link :to="'/article/' + item._id">[阅读全文]</router-link>
                </div>
                
            </div>
            <actions :item="item" class="feed-bottom-margin"></actions>
            <div class="feed-source feed-bottom-margin">
                <router-link :to="'/category/' + item.category" v-text="item.category_name" class="feed-minor-link"></router-link>
            </div>
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