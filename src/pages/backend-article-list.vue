<template>
    <div class="settings-main card">
        <div>
            <Table border :columns="columns" :data="data"></Table>
        </div>
        <div class="list-section list-header">
                <div class="list-title">标题</div>
                <div class="list-tag">标签</div>
                <div class="list-date">最后更新</div>
                <div class="list-action">操作</div>
            </div>
            <div v-for="item in topics.data" :key="item.title" class="list-section">
                <div class="list-title">{{ item.title }}</div>
                <div class="list-tag">{{ item.tags[0] }}</div>
                <div class="list-date">{{ item.update_date | timeAgo }}</div>
                <div class="list-action">
                    <router-link :to="'/backend/article/modify/' + item.title" class="badge badge-success">编辑</router-link>
                    <a v-if="item.is_delete" @click="recover(item.title, item.tags.join('|'))" href="javascript:;">恢复</a>
                    <a v-else @click="deletes(item.title, item.tags.join('|'))" href="javascript:;">删除</a>
                </div>
            </div>
        <div v-if="topics.hasNext" class="settings-footer clearfix">
            <a @click="loadMore()" class="admin-load-more" href="javascript:;">加载更多</a>
        </div>
    </div>
</template>

<script lang="babel">
    import api from '~api';
    import { mapGetters } from 'vuex';
    const fetchInitialData = async (store, config = { page: 1}) => {
        const base = {...config, limit: 10};
        await store.dispatch('backend/article/getArticleList', config);
    };

    export default {
        name: 'backend-article-list',
        data () {
            return {
                columns: [
                    {
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '标签',
                        key: 'tags[0]'
                    },
                    {
                        title: '最后更新日期',
                        key: 'update_date',
                        render: (h, params) => {
                            return this.data[params.index].update_date | timeAgo;
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            let buttons = [];
                            let modifyButton = h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.go(params.index);
                                        }
                                    }
                                }, '编辑'),
                                recoverButton =h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.recover(params.index);
                                        }
                                    }
                                }, '恢复') ,
                                deleteButton = h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deletes(params.index);
                                        }
                                    }
                                }, '删除');
                            if(this.data[params.index].is_delete){
                                return h('div', [modifyButton, recoverButton]);
                            } else{
                                return h('div', [modifyButton, deleteButton]);
                            }
                        }
                    }
                ],
                data: []
            }
        },
        computed : {
            ...mapGetters({
                topics: 'backend/article/getArticleList'
            })
        },
        methods: {
            loadMore(page = this.topics.page + 1) {
                fetchInitialData(this.$store, {page});
            },
            async recover(title, tagList) {
                const {data: {code, message}} = await api.get('backend/article/recover', {title, tagList});
                if(code === 200) {
                    this.$store.dispatch('global/showMsg', {
                        type: 'success',
                        content: message
                    });
                    this.$store.commit('backend/article/recoverArticle', title);
                }
            },
            async deletes(title, tagList) {
                const {data: {code, message}} = await api.get('backend/article/delete', {title, tagList});
                if(code === 200) {
                    this.$store.dispatch('global/showMsg', {
                        type: 'success',
                        content: message
                    });
                    this.$store.commit('backend/article/deleteArticle', title);
                }
            }
        },
        mounted() {
            if(this.topics.data.length <= 0){
                fetchInitialData(this.$store);
            } else {
                this.data = this.topics.data;
            }
        },
        watch: {
            topics(val) {
                this.data = val.data;
            }
        }
    }
</script>