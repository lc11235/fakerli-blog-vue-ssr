<template>
    <div class="settings-main card">
        <div class="settings-main-content">
            <div class="list-section">
                <div class="list-title">标签名称</div>
                <div class="list-num">标签数量</div>
                <div class="list-action">操作</div>
            </div>
            <div v-for="tag in tags" :key="tag.tag_name" class="list-section">
                <div class="list-title">{{ tag.tag_name }}</div>
                <div class="list-num">{{ tag.tag_num }}</div>
                <div class="list-action">
                    <router-link :to="'/backend/tag/modify/' + tag.tag_name" class="badge badge-success">编辑</router-link>
                    <a v-if="tag.is_delete" @click="recover(tag.tag_name)" href="javascript:;">恢复</a>
                    <a v-else @click="deletes(tag.tag_name)" href="javascript:;">删除</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="babel">
    import { mapGetters } from 'vuex';
    const fetchInitialData = async (store) => {
        await store.dispatch('global/tag/getTagList');
    };

    export default {
        name: 'backend-tag-list',
        computed: {
            ...mapGetters({
                tags: 'global/tag/getTagList'
            })
        },
        methods: {
            async recover(tag_name) {
                const {data: {code, message}} = await api.get('backend/tag/recover', {tag_name});
                if(code === 200) {
                    this.$store.dispatch('global/showMsg', {
                        type: 'success',
                        content: message
                    });
                    this.$store.commit('global/tag/recoverTag', tag_name);
                }
            },
            async deletes(tag_name) {
                const {data: {code, message}} = await api.get('backend/tag/delete', {tag_name});
                if(code === 200) {
                    this.$store.dispatch('global/showMsg', {
                        type: 'success',
                        content: message
                    });
                    this.$store.commit('global/tag/deleteTag', tag_name);
                }
            }
        },
        mounted() {
            if(this.tags.length <= 0) {
                fetchInitialData(this.$store);
            }
        }
    }
</script>