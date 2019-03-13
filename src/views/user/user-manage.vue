<template>
    <div>
        <Card>
            <Tabs value="name1" type="card">
                <TabPane label="普通用户管理" name="name1">
                    <tables ref="tables" editable searchable search-place="top" :loading="loading" v-model="tableData" :columns="columns" @on-delete-completely="deleteCompletelyUser"/>
                    <div style="margin: 10px;overflow: hidden;">
                        <div style="float: right;">
                            <Page :total="total" :current="current" @on-change="changePage"></Page>
                        </div>
                    </div>
                </TabPane>
                <tabPane label="管理员用户管理" name="name2">
                    <tables ref="tablesAdmin" editable searchable search-place="top" :loading="loadingAdmin" v-model="tableDataAdmin" :columns="columnsAdmin" @on-delete-completely="deleteCompletelyAdmin"/>
                    <div style="margin: 10px;overflow: hidden;">
                        <div style="float: right;">
                            <Page :total="totalAdmin" :current="currentAdmin" @on-change="changePageAdmin"></Page>
                        </div>
                    </div>
                </tabPane>
            </Tabs>
        </Card>
    </div>
</template>
<script>
import Tables from '~components/tables';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'backend-user-manage',
    components: {
        Tables
    },
    data () {
        return {
            loading: false,
            total: 0,
            current: 1,
            columns: [
                {title: '用户姓名', key: 'username'},
                {title: '用户邮箱', key: 'email'},
                {title: '注册时间', key: 'create_date'},
                {title: '账号权限', key: 'access'},
                {title: '用户类型', key: 'user_level'},
                {title: '账号审核状态', key: 'is_confirm'},
                {title: '登录状态', key: 'is_login'},
                {title: '更新时间', key: 'update_date'},
                {
                    title: '操作', 
                    key: 'handle', 
                    button: [
                        (h, params, vm) => {
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
                                        this.modifyUser(params.index);
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
                                        this.recoverUser(params.index);
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
                                        this.deleteDemoUser(params.index);
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
                                return h('div', [modifyButton, recoverButton, deteleCompletelyButton]);
                            } else {
                                return h('div', [modifyButton, deleteButton, deteleCompletelyButton]);
                            }
                        }
                    ]
                }
            ],
            tableData: [],
            loadingAdmin: false,
            totalAdmin: 0,
            currentAdmin: 1,
            columnsAdmin: [
                {title: '用户姓名', key: 'username'},
                {title: '用户邮箱', key: 'email'},
                {title: '注册时间', key: 'create_date'},
                {title: '账号权限', key: 'access'},
                {title: '用户类型', key: 'user_level'},
                {title: '账号审核状态', key: 'is_confirm'},
                {title: '登录状态', key: 'is_login'},
                {title: '更新时间', key: 'update_date'},
                {
                    title: '操作', 
                    key: 'handle', 
                    button: [
                        (h, params, vm) => {
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
                                        this.modifyAdmin(params.index);
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
                                        this.recoverAdmin(params.index);
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
                                        this.deleteDemoAdmin(params.index);
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
                            if (this.tableDataAdmin[params.index].is_delete) {
                                return h('div', [modifyButton, recoverButton, deteleCompletelyButton]);
                            } else {
                                return h('div', [modifyButton, deleteButton, deteleCompletelyButton]);
                            }
                        }
                    ]
                }
            ],
            tableDataAdmin: [],
        };
    },
    methods: {
        modifyUser(index) {},
        recoverUser(index) {},
        deleteDemoUser(index) {},
        deleteCompletelyUser(index) {},
        changePage(page) {},
        modifyAdmin(index) {},
        recoverAdmin(index) {},
        deleteDemoAdmin(index) {},
        deleteCompletelyAdmin(index) {},
        changePageAdmin(page) {}
    }
}
</script>