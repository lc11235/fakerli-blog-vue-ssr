<template>
    <div>
        <Card>
            <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete-completely="deleteCompletely"/>
            <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
        </Card>
    </div>
</template>

<script>
import Tables from '~components/tables';
import { mapGetters, mapActions } from 'vuex';
const fetchInitialData = async (store) => {
        await store.dispatch('global/tag/getTagList');
};
export default {
    name: 'backend-tag-manage',
    components: {
        Tables
    },
    data () {
        return {
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
            tableData: []
        };
    },
    methods: {
        ...mapActions({
            recoverTag: 'global/tag/handleRecoverTag',
            deleteTag: 'global/tag/handleDeleteTag',
            deleteCompletelyTag: 'global/tag/handleDeleteCompletelyTag'
        }),
        recover(index) {
            let tag_name = this.tableData[index].tag_name;
            this.recoverTag({ tag_name }).then(res => {
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
        deleteDemo(index) {
            let tag_name = this.tableData[index].tag_name;
            this.deleteTag({ tag_name }).then(res => {
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
            let tag_name = this.tableData[index].tag_name;
            this.deleteCompletelyTag({ tag_name }).then(res => {
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
            this.$router.push({ name: 'tag_modify', params: { tag_name: this.tableData[index].tag_name }});
        },
        exportExcel () {
            this.$refs.tables.exportCsv({
                filename: `table-${(new Date()).valueOf()}.csv`
            });
        }
    },
    computed: {
        ...mapGetters({
            tags: 'global/tag/getTagList'
        })
    },
    mounted() {
        if (this.tags.length <= 0) {
            fetchInitialData(this.$store);
        } else {
            this.tableData = this.tags;
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
        tags(val) {
            this.tableData = val;
        }
    } 
}
</script>
