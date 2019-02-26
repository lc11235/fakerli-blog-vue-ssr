<template>
    <div>
        <Card>
            <Tabs value="name1" type="card">
                <TabPane label="普通标签" name="name1">
                    <Form ref="formTag" :model="formTag" :label-width="80" :rules="ruleInline">
                        <FormItem label="标签名称" prop="tag_name">
                            <Input v-model="formTag.tag_name" placeholder="请输入标签名称" style="width: 30%"></Input>
                        </FormItem>
                        <FormItem label="标签描述" prop="tag_desc">
                            <Input v-model="formTag.tag_desc" placeholder="请输入标签描述" style="width: 30%"></Input>
                        </FormItem>
                        <FormItem label="标签分类">
                            <Select v-model="formTag.tag_classify" transfer style="width: 30%" placeholder="请选择标签分类">
                                <Option v-for="item in tag_classify_list" :value="item.tag_name" :key="item.tag_name">{{ item.tag_name }}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <Button style="margin: 10px 0;" type="primary" @click="handleInsert('formTag')">添加普通标签</Button>
                </TabPane>
                <TabPane label="分类标签" name="name2">
                    <Form ref="formClassify" :model="formClassify" :label-width="80" :rules="ruleInline">
                        <FormItem label="标签名称" prop="tag_name">
                            <Input v-model="formClassify.tag_name" placeholder="请输入标签名称" style="width: 30%"></Input>
                        </FormItem>
                        <FormItem label="标签描述" prop="tag_desc">
                            <Input v-model="formClassify.tag_desc" placeholder="请输入标签描述" style="width: 30%"></Input>
                        </FormItem>
                    </Form>
                    <Button style="margin: 10px 0;" type="primary" @click="handleInsert('formClassify')">添加分类标签</Button>
                </TabPane>
            </Tabs>
        </Card>
    </div>
</template>

<script lang="babel">
    import api from '~api';
    import { mapActions, mapGetters } from 'vuex';
    const fetchInitialData = async (store) => {
        await store.dispatch('global/tag/getClassifyList');
    };

    export default {
        name: 'backend-tag-insert',
        data() {
            return {
                formTag: {
                    tag_name: '',
                    tag_desc: '',
                    tag_classify: '',
                },
                formClassify: {
                    tag_name: '',
                    tag_desc: '',
                    tag_classify: 'classify',
                },
                split1: 0.5,
                tag_classify_list: [],
                ruleInline: {
                    tag_name: [
                        { required: true, message: '请填写标签名称', trigger: 'blur' }
                    ],
                    tag_desc: [
                        { required: true, message: '请填写标签描述', trigger: 'blur' },
                    ]
                }
            };
        },
        methods: {
            ...mapActions({
                handleInsertTag: 'global/tag/handleInsertTag'
            }),
            handleInsert(name) {
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        let demoFoom = name === 'formTag' ? this.formTag : this.formClassify;
                        this.handleInsertTag(demoFoom).then(res => {
                            this.formClassify.tag_name = '';
                            this.formClassify.tag_desc = '';
                            this.$Message.success('新增标签成功！');
                        }, reject => {
                            this.$Message.error('新增标签失败！');
                        });
                    }
                });
            },
        },
        computed: {
            ...mapGetters({
                tagClassifyList: 'global/tag/getClassifyList'
            })
        },
        mounted() {
            if (this.tagClassifyList.length <= 0) {
                fetchInitialData(this.$store);
            } else {
                this.tag_classify_list = this.tagClassifyList;
                console.log(this.tag_classify_list);
            
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
            tagClassifyList(val) {
                this.tag_classify_list = val;
            }
        }
    };
</script>