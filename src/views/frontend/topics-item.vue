<template>
    <div class="feed-content">
        <div class="feed-content-item">
            <div class="feed-time feed-bottom-margin">{{ resizeDate(item.update_date)}}</div>
            <div class="feed-main-link-wrap feed-bottom-margin">
                <router-link :to="'/article/' + item.title" v-text="item.title" class="post-title-link"></router-link>
            </div>
            <div class="feed-desc-wrap feed-bottom-margin">
                <div class="feed-article-content markdonw-body">
                    {{item.content}}
                </div>
            </div>
            <router-link :to="'/article/' + item.title">阅读全文 >></router-link>
            <div class="article-tag-index">
                <div class="article-tag">
                    <i class="fa fa-tag tag-icon"></i>
                    <ul class="article-tag-list">
                        <li v-for="tag in item.tags" :key="tag" class="article-tag-list-item">
                            <router-link  :to="'/tag/' + tag" v-text="tag" class="tag-color"></router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="babel">
    export default {
        name: 'index-item',
        serverCacheKey: props => {
            return `frontend::topics::item::${props.item.title}`;
        },
        props: ['item'],
        data() {
            return {
                showMore: false
            };
        },
        methods: {
            resizeDate(date) {
                return date.substring(0, 10);
            }
        }
    };
</script>