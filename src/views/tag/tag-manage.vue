<template>
    <div>
        <Card>
            <Tabs value="name1" type="card">
                <TabPane label="普通标签管理" name="name1">
                    <tables ref="tables" editable searchable search-place="top" :loading="loading" v-model="tableData" :columns="columns" @on-delete-completely="deleteCompletely"/>
                    <div style="margin: 10px;overflow: hidden;">
                        <div style="float: right;">
                            <Page :total="total" :current="current" @on-change="changePage"></Page>
                        </div>
                    </div>
                </TabPane>
                <TabPane label="分类标签管理" name="name2">
                    <tables ref="tablesClassify" editable searchable search-place="top" :loading="loadingClassify" v-model="tableDataClassify" :columns="columnsClassify" @on-delete-completely="deleteCompletelyClassify"/>
                    <div style="margin: 10px;overflow: hidden;">
                        <div style="float: right;">
                            <Page :total="totalClassify" :current="currentClassify" @on-change="changePageClassify"></Page>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </Card>
    </div>
</template>

<script>
import Tables from '~components/tables';
import { mapGetters, mapActions } from 'vuex';
const fetchInitialData = async (store, config = { page: 1, limit: 10 }) => {
    await store.dispatch('global/tag/handleGetTagList', config);
};
const fetchInitialDataClassify = async (store, config = { page: 1, limit: 10 }) => {
    await store.dispatch('global/tag/handleGetClassifyTagList', config);
};
export default {
    name: 'backend-tag-manage',
    components: {
        Tables
    },
    data () {
        return {
            loading: false,
            total: 0,
            current: 1,
            columns: [
                {title: '标签名称', key: 'tag_name'},
                {title: '标签数量', key: 'tag_num'},
                {title: '标签描述', key: 'tag_desc', editable: true},
                {title: '标签类型', key: 'tag_classify', editable: true},
                {title: '更新时间', key: 'update_date'},
                {
                    title: '操作', 
                    key: 'handle', 
                    button: [
                        (h, params, vm) => {
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
                                        this.deleteDemo(params.index);
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
                                        vm.$emit('on-delete-completely', params.index);
                                    }
                                }
                            }, '删除');
                            if (this.tableData[params.index].is_delete) {
                                return h('div', [recoverButton, deteleCompletelyButton]);
                            } else {
                                return h('div', [deleteButton, deteleCompletelyButton]);
                            }
                        }
                    ]
                }
            ],
            tableData: [],
            loadingClassify: false,
            totalClassify: 0,
            currentClassify: 1,
            columnsClassify: [
                {title: '标签名称', key: 'tag_name'},
                {title: '标签数量', key: 'tag_num'},
                {title: '标签描述', key: 'tag_desc', editable: true},
                {title: '标签类型', key: 'tag_classify', editable: true},
                {title: '更新时间', key: 'update_date'},
                {
                    title: '操作', 
                    key: 'handle', 
                    button: [
                        (h, params, vm) => {
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
                                        this.recoverClassify(params.index);
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
                                        this.deleteDemoClassify(params.index);
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
                                        vm.$emit('on-delete-completely', params.index);
                                    }
                                }
                            }, '删除');
                            if (this.tableDataClassify[params.index].is_delete) {
                                return h('div', [recoverButton, deteleCompletelyButton]);
                            } else {
                                return h('div', [deleteButton, deteleCompletelyButton]);
                            }
                        }
                    ]
                }
            ],
            tableDataClassify: [],
        };
    },
    methods: {
        ...mapActions({
            handleDeleteTagSingle: 'global/tag/handleDeleteTagSingle',
            handleRecoverTagSingle: 'global/tag/handleRecoverTagSingle',
            handleDeleteTagCompletelySingle: 'global/tag/handleDeleteTagCompletelySingle',
            handleDeleteClassifyTagSingle: 'global/tag/handleDeleteClassifyTagSingle',
            handleRecoverClassifyTagSingle: 'global/tag/handleRecoverClassifyTagSingle',
            handleDeleteClassifyTagCompletelySingle: 'global/tag/handleDeleteClassifyTagCompletelySingle',
        }),
        deleteDemo(index) {
            let tagId = this.tableData[index]._id;
            this.handleDeleteTagSingle({ tagId }).then(res => {
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
        recover(index) {
            let tagId = this.tableData[index]._id;
            this.handleRecoverTagSingle({ tagId }).then(res => {
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
        deleteCompletely(index) {
            let tagId = this.tableData[index]._id;
            this.handleDeleteTagCompletelySingle({ tagId }).then(res => {
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
        go(index) {
            this.$router.push({ name: 'tag_modify', params: { tagId: this.tableData[index]._id }});
        },
        changePage(page) {
            this.loading = true;
            this.current = page;
            fetchInitialData(this.$store, { page: page, limit: 10});
        },
        deleteDemoClassify(index) {
            let tagId = this.tableDataClassify[index]._id;
            this.handleDeleteClassifyTagSingle({ tagId }).then(res => {
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
        recoverClassify(index) {
            let tagId = this.tableDataClassify[index]._id;
            this.handleRecoverClassifyTagSingle({ tagId }).then(res => {
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
        deleteCompletelyClassify(index) {
            let tagId = this.tableDataClassify[index]._id;
            this.handleDeleteClassifyTagCompletelySingle({ tagId }).then(res => {
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
        goClassify(index) {
            this.$router.push({ name: 'tag_modify', params: { tagId: this.tableDataClassify[index]._id }});
        },
        changePageClassify(page) {
            this.loadingClassify = true;
            this.current = page;
            fetchInitialData(this.$store, { page: page, limit: 10});
        }
    },
    computed: {
        ...mapGetters({
            tagList: 'global/tag/getTagList',
            classifyTagList: 'global/tag/getClassifyTagList',
        })
    },
    mounted() {
        if (this.tagList.data.length <= 0) {
            fetchInitialData(this.$store);
        } else {
            this.tableData = this.tagList.data;
            this.total = this.tagList.total;
        }
        if (this.classifyTagList.data.length <= 0) {
            fetchInitialDataClassify(this.$store);
        } else {
            this.tableDataClassify = this.classifyTagList.data;
            this.totalClassify = this.classifyTagList.total;
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.path !== '/') {
                fetchInitialDataClassify(vm.$store);
            }
        });
    },
    watch: {
        'tagList.data'(val) {
            this.tableData = val;
            this.loading = false;
        },
        'tagList.total'(val) {
            this.total = val;
        },
        'classifyTagList.data'(val) {
            this.tableDataClassify = val;
            this.loadingClassify = false;
        },
        'classifyTagList.total'(val) {
            this.totalClassify = val;
        }
    } 
}
</script>
