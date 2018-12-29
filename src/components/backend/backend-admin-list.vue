<template>
    <div class="settings-main card">
        <div class="settings-main-content">
            <Table border :columns="columns" :data="data"></Table>
        </div>
        <div v-if="admin.hasNext" class="settings-footer clearfix">
            <a @click="loadMore()" class="admin-load-more" href="javascript:;">加载更多</a>
        </div>
    </div>
</template>

<script lang="babel">
    import api from '~api';
    import { mapGetters } from 'vuex';
    const fetchInitialData = async (store, config = { page: 1 }) => {
        await store.dispatch('backend/admin/getAdminList', config);
    };

    export default {
        name: 'backend-admin-list',
        data() {
            return {
                columns: [
                    {
                        title: '用户名',
                        key: 'username'
                    },
                    {
                        title: '邮箱',
                        key: 'email'
                    },
                    {
                        title: '最后更新时间',
                        key: 'update_date'
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
                                        this.deletes(params.index);
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
                admin: 'backend/admin/getAdminList'
            })
        },
        methods: {
            loadMore(page = this.admin.page + 1) {
                fetchInitialData(this.$store, { page });
            },
            async recover(index) {
                let username = this.data[index].username;
                const { data: { code, message }} = await api.get('backend/admin/recover', { username });
                if (code === 200) {
                    this.$Message.success({
                        content: message,
                        duration: 3
                    });
                    this.$store.commit('backend/admin/recoverAdmin', username);
                } else {
                    this.$Message.error({
                        content: message,
                        duration: 3
                    });
                }
            },
            async deletes(index) {
                let username = this.data[index].username;
                const { data: { code, message }} = await api.get('backend/admin/delete', { username });
                if (code === 200) {
                    this.$Message.success({
                        content: message,
                        duration: 3
                    });
                    this.$store.commit('backend/admin/deleteAdmin', username);
                } else {
                    this.$Message.error({
                        content: message,
                        duration: 3
                    });
                }
            },
            async deleteCompletely(index) {
                let username = this.data[index].username;
                const { data: { code, message }} = await api.get('backend/admin/deleteCompletely', { username });
                if (code === 200) {
                    this.$Message.success({
                        content: message,
                        duration: 3
                    });
                    this.$store.commit('backend/admin/deleteAdminCompletely', username);
                } else {
                    this.$Message.error({
                        content: message,
                        duration: 3
                    });
                }
            },
            go(index) {
                this.$router.push({ name: 'admin_modify', params: { username: this.data[index].username }});
            }
        },
        mounted() {
            if (this.admin.data.length <= 0) {
                fetchInitialData(this.$store);
            } else {
                this.data = this.admin.data;
            }
        },
        watch: {
            admin(val) {
                this.data = val.data;
            }
        }
    };
</script>