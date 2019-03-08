<template>
    <div>
        <Card>
            <Tabs value="name1" type="card">
                <TabPane label="普通标签" name="name1">
                    <Form ref="formTag" :model="formTag" :label-width="80" :rules="ruleInline">
                        <FormItem label="标签名称" prop="tagName">
                            <Input v-model="formTag.tagName" placeholder="请输入标签名称" style="width: 30%"></Input>
                        </FormItem>
                        <FormItem label="标签描述" prop="tagDesc">
                            <Input v-model="formTag.tagDesc" placeholder="请输入标签描述" style="width: 30%"></Input>
                        </FormItem>
                        <FormItem label="标签分类">
                            <Select v-model="formTag.tagClassify" transfer style="width: 30%" placeholder="请选择标签分类">
                                <Option v-for="item in classify_tag_list" :value="item.tag_name" :key="item.tag_name">{{ item.tag_name }}</Option>
                                <Page :total="total" :current="current" @on-change="changePage"></Page>
                            </Select>
                        </FormItem>
                    </Form>
                    <Button style="margin: 10px 0;" type="primary" @click="insertTagSingle('formTag')">添加普通标签</Button>
                </TabPane>
                <TabPane label="分类标签" name="name2">
                    <Form ref="formClassify" :model="formClassify" :label-width="80" :rules="ruleInline">
                        <FormItem label="标签名称" prop="tagName">
                            <Input v-model="formClassify.tagName" placeholder="请输入标签名称" style="width: 30%"></Input>
                        </FormItem>
                        <FormItem label="标签描述" prop="tagDesc">
                            <Input v-model="formClassify.tagDesc" placeholder="请输入标签描述" style="width: 30%"></Input>
                        </FormItem>
                    </Form>
                    <Button style="margin: 10px 0;" type="primary" @click="insertClassifyTagSingle('formClassify')">添加分类标签</Button>
                </TabPane>
            </Tabs>
        </Card>
    </div>
</template>

<script lang="babel">
    import api from '~api';
    import { mapActions, mapGetters } from 'vuex';
    const fetchInitialData = async (store, config = { page: 1, limit: 10 }) => {
        await store.dispatch('global/tag/handleGetClassifyTagList', config);
    };

    export default {
        name: 'backend-tag-insert',
        data() {
            return {
                loading: false,
                total: 0,
                current: 1,
                classify_tag_list: [],
                formTag: {
                    tagName: '',
                    tagDesc: '',
                    tagClassify: '',
                },
                formClassify: {
                    tagName: '',
                    tagDesc: '',
                    tagClassify: 'classify',
                },
                ruleInline: {
                    tagName: [
                        { required: true, message: '请填写标签名称', trigger: 'blur' }
                    ],
                    tagDesc: [
                        { required: true, message: '请填写标签描述', trigger: 'blur' },
                    ]
                }
            };
        },
        methods: {
            ...mapActions({
                handleInsertTagSingle: 'global/tag/handleInsertTagSingle',
                handleInsertClassifyTagSingle: 'global/tag/handleInsertClassifyTagSingle'
            }),
            insertTagSingle(name) {
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        this.handleInsertTagSingle(this.formTag).then(res => {
                            this.formTag.tagName = '';
                            this.formTag.tagDesc = '';
                            this.$Message.success('新增标签成功！');
                        }, reject => {
                            this.$Message.error(reject);
                        });
                    }
                });
            },
            insertClassifyTagSingle(name) {
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        this.handleInsertClassifyTagSingle(this.formClassify).then(res => {
                            this.formClassify.tagName = '';
                            this.formClassify.tagDesc = '';
                            this.$Message.success('新增标签成功！');
                            fetchInitialData(this.$store);
                        }, reject => {
                            this.$Message.error('新增标签失败！');
                        });
                    }
                });
            },
            changePage(page) {
                this.loading = true;
                this.current = page;
                fetchInitialData(this.$store, { page: page, limit: 10});
            }
        },
        computed: {
            ...mapGetters({
                classifyTagList: 'global/tag/getClassifyTagList'
            })
        },
        mounted() {
            if (this.classifyTagList.length <= 0) {
                fetchInitialData(this.$store);
            } else {
                this.classify_tag_list = this.classifyTagList.data;
                this.total = this.classifyTagList.total;          
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
            'classifyTagList.data'(val) {
                this.classify_tag_list = val;
                this.loading = false;
            },
            'classifyTagList.total'(val) {
                this.total = val;
            }
        }
    };
</script>