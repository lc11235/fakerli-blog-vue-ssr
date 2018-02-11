<template>
    <div class="settings-main card">
        <div>
            <Table border :columns="columns" :data="data"></Table>
        </div>
        <div v-if="topics.hasNext" class="settings-footer clearfix">
            <a @click="loadMore()" class="admin-load-more" href="javascript:;">加载更多</a>
        </div>
    </div>
</template>

<script lang="babel">
    import api from '~api';
    import { timeAgo } from '../filters';
    import { mapGetters } from 'vuex';
    const fetchInitialData = async (store, config = { page: 1 }) => {
        const base = { ...config, limit: 10 };
        await store.dispatch('backend/article/getArticleList', base);
    };

    export default {
        name: 'backend-article-list',
        data() {
            return {
                columns: [
                    {
                        title: '标题',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '标签',
                        key: 'tagName',
                        align: 'center',
                        render: (h, params) => {
                            let _this = this;
                            let buttons = this.data[params.index].tags.map(function (item) {
                                return h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        marginBottom: '2px'
                                    },
                                    on: {
                                        click: () => {
                                            _this.goItem(item);
                                        }
                                    }
                                }, item);
                            });
                            return h('div', buttons);
                        }
                    },
                    {
                        title: '最后更新日期',
                        key: 'update_date',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('span', timeAgo(this.data[params.index].update_date))
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 250,
                        align: 'center',
                        render: (h, params) => {
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
                            }, '编辑');
                            let recoverButton = h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.recover(params.index);
                                    }
                                }
                            }, '恢复');
                            let deleteButton = h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.deletes(params.index);
                                    }
                                }
                            }, '失效');
                            let deteleCompletelyButton = h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.deleteCompletely(params.index);
                                    }
                                }
                            }, '删除');
                            if (this.data[params.index].is_delete) {
                                return h('div', [modifyButton, recoverButton, deteleCompletelyButton]);
                            } else {
                                return h('div', [modifyButton, deleteButton, deteleCompletelyButton]);
                            }
                        }
                    }
                ],
                data: []
            };
        },
        computed: {
            ...mapGetters({
                topics: 'backend/article/getArticleList'
            })
        },
        methods: {
            loadMore(page = this.topics.page + 1) {
                fetchInitialData(this.$store, { page });
            },
            async recover(index) {
                let title = this.data[index].title;
                let tagList = this.data[index].tags.join('|');
                const { data: { code, message }} = await api.get('backend/article/recover', { title, tagList });
                if (code === 200) {
                    this.$Message.success({
                        content: message,
                        duration: 3
                    });
                    this.$store.commit('backend/article/recoverArticle', title);
                } else {
                    this.$Message.error({
                        content: message,
                        duration: 3
                    });
                }
            },
            async deletes(index) {
                let title = this.data[index].title;
                let tagList = this.data[index].tags.join('|');
                const { data: { code, message }} = await api.get('backend/article/delete', { title, tagList });
                if (code === 200) {
                    this.$Message.success({
                        content: message,
                        duration: 3
                    });
                    this.$store.commit('backend/article/deleteArticle', title);
                } else {
                    this.$Message.error({
                        content: message,
                        duration: 3
                    });
                }
            },
            async deleteCompletely(index) {
                let title = this.data[index].title;
                let tagList = this.data[index].tags.join('|');
                const { data: { code, message }} = await api.get('backend/article/deleteCompletely', { title, tagList });
                if (code === 200) {
                    this.$Message.success({
                        content: message,
                        duration: 3
                    });
                    this.$store.commit('backend/article/deleteArticleCompletely', title);
                } else {
                    this.$Message.error({
                        content: message,
                        duration: 3
                    });
                }
            },
            goItem(item) {
                this.$router.push({ name: 'tag_modify', params: { tag_name: item }});
            },
            go(index) {
                this.$router.push({ name: 'article_modify', params: { title: this.data[index].title }});
            }
        },
        mounted() {
            if (this.topics.data.length <= 0) {
                fetchInitialData(this.$store);
            } else {
                this.data = this.topics.data;
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                if (from.path !== '/') {
                    fetchInitialData(vm.$store);
                }
            });
        },
        watch: {
            topics(val) {
                this.data = val.data;
            }
        }
    };
</script>