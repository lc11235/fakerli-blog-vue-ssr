<template>
    <div class="settings-main card">
        <div class="settings-main-content">
            <div class="list-section">
                <div class="list-title">标签名称</div>
                <div class="list-time">标签排序</div>
                <div class="list-action">操作</div>
            </div>
            <div v-for="tag in tags" :key="tag.tag_name" class="list-section">
                <div class="list-title">{{ tag.tag_name }}</div>
                <div class="list-action">
                    <router-link :to="'/backend/tag/modify/' + tag.tag_name" class="badge badge-success">编辑</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="babel">
    import { mapGetters } from 'vuex';
    const fetchInitialData = async (store, config = {limit: 99}) => {
        await store.dispatch('global/tag/getTagList', config);
    };

    export default {
        name: 'backend-tag-list',
        computed: {
            ...mapGetters({
                tags: 'global/tag/getTagList'
            })
        },
        mounted() {
            if(this.tags.length <= 0) {
                fetchInitialData(this.$store);
            }
        }
    }
</script>