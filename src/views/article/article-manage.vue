<template>
  <div>
    <Card>
        <tables ref="tables" editable searchable search-place="top" :loading="loading" v-model="tableData" :columns="columns"/>
        <div style="margin: 10px;overflow: hidden;">
            <div style="float: right;">
                <Page :total="total" :current="current" @on-change="changePage"></Page>
            </div>
        </div>
    </Card>
  </div>
</template>

<script>
import Tables from '~components/tables';
import { timeAgo } from '@/filters';
import { mapGetters, mapActions, mapMutations } from 'vuex';
const fetchInitialData = async (store, config = { page: 1, limit: 10 }) => {
  await store.dispatch('backend/article/handleGetArticleList', config);
};
export default {
    name: 'article_manage',
    components: {
        Tables
    },
    data () {
        return {
            loading: false,
            total: 0,
            current: 1,
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
                            let buttons = this.tableData[params.index].tags.map(function (item) {
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
                                h('span', timeAgo(this.tableData[params.index].update_date))
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
                                        this.modifyArticleSingle(params.index);
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
                                        this.recoverArticleSingle(params.index);
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
                                        this.deleteArticleSingle(params.index);
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
                                        this.deleteCompletelyArticleSingle(params.index);
                                    }
                                }
                            }, '删除');
                            if (this.tableData[params.index].is_delete) {
                                return h('div', [modifyButton, recoverButton, deteleCompletelyButton]);
                            } else {
                                return h('div', [modifyButton, deleteButton, deteleCompletelyButton]);
                            }
                        }
                    }
                ],
            tableData: [],
        }
    },
    methods: {
        ...mapActions({
            handleDeleteArticleSingle: 'backend/article/handleDeleteArticleSingle',
            handleRecoverArticleSingle: 'backend/article/handleRecoverArticleSingle',
            handleDeleteCompletelyArticleSingle: 'backend/article/handleDeleteCompletelyArticleSingle',
        }),
        ...mapMutations({
            insertArticleSingle: 'backend/article/insertArticleSingle',
        }),
        deleteArticleSingle(index) {
            let articleId = this.tableData[index]._id;
            let tagList = this.tableData[index].tags.join('|');
            this.handleDeleteArticleSingle({ articleId, tagList }).then(res => {
                this.$Message.success({
                    content: res,
                    duration: 3
                });
            }, reject => {
                this.$Message.error({
                    content: reject,
                    duration: 3
                });
            });
        },
        recoverArticleSingle(index) {
            let articleId = this.tableData[index]._id;
            let tagList = this.tableData[index].tags.join('|');
            this.handleRecoverArticleSingle({ articleId, tagList }).then(res => {
                this.$Message.success({
                    content: res,
                    duration: 3
                });
            }, reject => {
                this.$Message.error({
                    content: reject,
                    duration: 3
                });
            });
        },
        deleteCompletelyArticleSingle(index) {
            let articleId = this.tableData[index]._id;
            let tagList = this.tableData[index].tags.join('|');
            this.handleDeleteCompletelyArticleSingle({ articleId, tagList }).then(res => {
                this.$Message.success({
                    content: res,
                    duration: 3
                });
            }, reject => {
                this.$Message.error({
                    content: reject,
                    duration: 3
                });
            });
        },
        goItem(item) {
            this.$router.push({ name: 'tag_modify', params: { tag_name: item }});
        },
        modifyArticleSingle(index) {
            this.insertArticleSingle({
                _id: this.tableData[index]._id,
                title: this.tableData[index].title,
                tags: this.tableData[index].tags,
                content: this.tableData[index].content
            });
            this.$router.push({ name: 'article_modify', params: { title: this.tableData[index].title }});
        },
        exportExcel () {
            this.$refs.tables.exportCsv({
                filename: `table-${(new Date()).valueOf()}.csv`
            });
        },
        changePage(page) {
            this.loading = true;
            this.current = page;
            fetchInitialData(this.$store, { page: page});
        }
    },
    computed: {
        ...mapGetters({
            articles: 'backend/article/getArticleList'
        })
    },
    mounted () {
        if (this.articles.data.length <= 0) {
            fetchInitialData(this.$store);
        } else {
            this.tableData = this.articles.data;
            this.total = this.articles.total;
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
        'articles.data'(val) {
            this.tableData = val;
            this.loading = false;
        },
        'articles.total'(val) {
            this.total = val;
        }
    } 
}
</script>

<style>

</style>
