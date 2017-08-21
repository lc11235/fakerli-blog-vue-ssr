<template>
    <div class="settings-main card">
        <div>
            <Table border :columns="columns" :data="data"></Table>
        </div>
    </div>
</template>

<script lang="babel">
    import api from '~api';
    import { mapGetters } from 'vuex';
    const fetchInitialData = async (store) => {
        await store.dispatch('global/tag/getTagList');
    };

    export default {
        name: 'backend-tag-list',
        data () {
            return {
                columns: [
                    {
                        title: '标签名称',
                        key: 'tag_name'
                    },
                    {
                        title: '标签数量',
                        key: 'tag_num'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
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
        computed: {
            ...mapGetters({
                tags: 'global/tag/getTagList'
            })
        },
        methods: {
            async recover(index) {
                let tag_name = this.data[index].tag_name;
                const {data: {code, message}} = await api.get('backend/tag/recover', {tag_name});
                if(code === 200) {
                    this.$Message.success({
                        content: message,
                        duration: 3
                    });
                    this.$store.commit('global/tag/recoverTag', tag_name);
                } else {
                    this.$Message.error({
                        content: message,
                        duration: 3
                    });
                }
            },
            async deletes(index) {
                let tag_name = this.data[index].tag_name;
                const {data: {code, message}} = await api.get('backend/tag/delete', {tag_name});
                if(code === 200) {
                    this.$Message.success({
                        content: message,
                        duration: 3
                    });
                    this.$store.commit('global/tag/deleteTag', tag_name);
                } else {
                    this.$Message.error({
                        content: message,
                        duration: 3
                    });
                }
            },
            go(index){
                this.$router.push({name:'tag_modify', params: {tag_name: this.data[index].tag_name}});
            }
        },
        mounted() {
            if(this.tags.length <= 0) {
                fetchInitialData(this.$store);
            } else {
                this.data = this.tags;
            }
        },
        watch: {
            tags(val) {
                this.data = val;
            }
        }
    }
</script>