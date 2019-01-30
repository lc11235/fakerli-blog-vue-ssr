<template>
    <div>
        <Card>
            <Tabs value="name1" @on-click="handleTabSwitch">
                <TabPane label="普通标签" name="name1">
                    <Form :model="formArticle" :label-width="80" :rules="ruleInline">
                        <FormItem label="标签名称" prop="tag_name">
                            <Input v-model="formArticle.tag_name" placeholder="请输入标签名称" style="width: 30%"></Input>
                        </FormItem>
                        <FormItem label="标签描述" prop="tag_desc">
                            <Input v-model="formArticle.tag_desc" placeholder="请输入标签描述" style="width: 30%"></Input>
                        </FormItem>
                        <FormItem label="标签分类">
                            <Select v-model="formArticle.tag_classify" style="width: 30%" placeholder="请选择标签分类">
                                <Option v-for="item in tag_classify_list" :value="item.tag_name" :key="item.tag_name">{{ item.tag_name }}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <Button style="margin: 10px 0;" type="primary" @click="handleInsert('')">添加普通标签</Button>
                </TabPane>
                <TabPane label="分类标签" name="name2">
                    <Form :model="formArticle" :label-width="80" :rules="ruleInline">
                        <FormItem label="标签名称" prop="tag_name">
                            <Input v-model="formArticle.tag_name" placeholder="请输入标签名称" style="width: 30%"></Input>
                        </FormItem>
                        <FormItem label="标签描述" prop="tag_desc">
                            <Input v-model="formArticle.tag_desc" placeholder="请输入标签描述" style="width: 30%"></Input>
                        </FormItem>
                    </Form>
                    <Button style="margin: 10px 0;" type="primary" @click="handleInsert('classify')">添加分类标签</Button>
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
                formArticle: {
                    tag_name: '',
                    tag_desc: '',
                    tag_classify: '',
                },
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
                handleInsertTag: 'global/tag/handleInsertTag',
                getClassifyList: 'global/tag/getClassifyList'
            }),
            handleInsert(flag) {
                this.formArticle.tag_classify = flag;
                this.handleInsertTag(this.formArticle).then(res => {
                    this.$Message.success('新增标签成功！');
                }, reject => {
                    this.$Message.success('新增标签失败！');
                });
            },
            handleTabSwitch(name) {
                if(name === 'name1') {
                    fetchInitialData(this.$store);
                }
            }
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
            
            }
        },
        watch: {
            tagClassifyList(val) {
                this.tag_clasify_list = val.tagClasifyList;
            }
        }
    };
</script>