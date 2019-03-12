<template>
  <div>
    <Card>
        <tables ref="tables" editable searchable search-place="top" :loading="loading" v-model="tableData" :columns="columns"/>
        <div style="margin: 10px;overflow: hidden;">
            <div style="float: right;">
                <Page :total="total" :current="current" @on-change="changePage"></Page>
            </div>
        </div>
        <Modal
            title="文章标题"
            v-model="modalModifyArticleSingle"
            fullscreen
            :closable="false"
            :mask-closable="false"
            :loading="loadingModal"
            @on-cancel="cancelModal"
            @on-ok="asyncOkModal">
            <Form :model="formArticle" :lable-width="200">
                <FormItem label="文章标题">
                    <Input v-model="formArticle.title" placeholder="请输入文章标题" style="width: 50%"></Input>
                </FormItem>
                <FormItem label="选择标签">
                    <Select class="select-item" name="selectTags" v-model="selectTags" @on-change="addTags" style="width: 50%">
                        <OptionGroup v-for="item1 in tagClassifyAll" :label="item1.tag_name" :value="item1.tag_name" :key="item1.tag_name">
                            <Option v-for="item2 in tagAll.filter(word => word.tag_classify === item1.tag_name)" :value="item2.tag_name" :key="item2.tag_name">{{ item2.tag_name }}</Option>
                        </OptionGroup>
                    </Select>
                </FormItem>
                <FormItem label="已有标签">
                    <Tag color="success" v-for="item in hadTags.filter(word => !!word)" :key="item" :name="item" closable @on-close="handleCloseHadTag">{{ item }}</Tag>
                </FormItem>
            </Form>
            <div class="settings-main-content"> 
                <div class="settings-section">
                    <div id="modify-content" class="settings-item-content">
                        <textarea id="editor" name="content" class="form-control hidden" data-autosave="editor-content"></textarea>
                    </div>
                </div>
            </div>
        </Modal>
    </Card>
  </div>
</template>

<script>
import Tables from '~components/tables';
import { timeAgo } from '@/filters';
import { mapGetters, mapActions } from 'vuex';
const fetchInitialData = async (store, config = { page: 1, limit: 10 }) => {
    await store.dispatch('backend/article/handleGetArticleList', config);
    await store.dispatch('global/tag/handleGetTagList', config);
    await store.dispatch('global/tag/handleGetClassifyTagList', config);
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
            modalModifyArticleSingle: false,
            formArticle: {
                title: '',
                tagListNew: '',
                tagListOld: '',
                content: '',
                html: '',
                tocHTML: '',
                articleId: ''
            },
            selectTags: '',
            hadTags: [],
            tagAll: [],
            tagClassifyAll: [],
            loadingModal: true,
        }
    },
    methods: {
        ...mapActions({
            handleDeleteArticleSingle: 'backend/article/handleDeleteArticleSingle',
            handleRecoverArticleSingle: 'backend/article/handleRecoverArticleSingle',
            handleDeleteCompletelyArticleSingle: 'backend/article/handleDeleteCompletelyArticleSingle',
            handleModifyArticleSingle: 'backend/article/handleModifyArticleSingle',
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
            $('body').everyTime('500ms', 'A', function () {
                if ($('.editormd-preview-close-btn').length > 0) {
                    $('.editormd-preview-close-btn').hide();
                    $('body').stopTime('A');
                }
            });
            this.modalModifyArticleSingle = true;
            this.formArticle.title = this.tableData[index].title;
            this.hadTags = this.tableData[index].tags.concat([]);
            this.selectTags = '';
            this.formArticle.content = this.tableData[index].content;
            this.formArticle.articleId = this.tableData[index]._id;
            this.formArticle.tagListOld = this.tableData[index].tags.join('|');
                // eslint-disable-next-line
            window.modifyEditor = editormd('modify-content', {
                width: '100%',
                height: 500,
                markdown: this.formArticle.content,
                placeholder: '请输入内容...',
                path: '/static/editor.md/lib/',
                toolbarIcons() {
                    return [
                        'undo', 'redo', '|',
                        'bold', 'del', 'italic', 'quote', 'ucwords', 'uppercase', 'lowercase', '|',
                        'list-ul', 'list-ol', 'hr', '|',
                        'link', 'reference-link', 'image', 'code', 'preformatted-text', 'code-block', 'table', 'datetime', 'emoji', 'html-entities', 'pagebreak', '|',
                        'goto-line', 'watch', 'preview', 'fullscreen', 'clear', 'search', '|',
                        'help', 'info'
                    ];
                },
                watch: true,
                saveHTMLToTextarea: false,
                tex: true,
                flowChart: true,
                sequenceDiagram: true,
                taskList: true,
                htmlDecode: true,
                emoji: true
            });
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
        },
        addTags(value) {
            if(!this.hadTags.includes(value) && value){
                this.hadTags.push(value);
            }
        },
        handleCloseHadTag(value) {
            let index = this.hadTags.indexOf(value);
            this.hadTags.splice(index, 1);
        },
        cancelModal() {
            this.hadTags = [];
        },
        asyncOkModal() {
            const content = modifyEditor.getMarkdown();
            const html = modifyEditor.getPreviewedHTML();
            let tocHtml = '';
            if (document.querySelectorAll('.markdown-toc')[0]) {
                tocHtml = document.querySelectorAll('.markdown-toc')[0].outerHTML;
            }
            if (!this.formArticle.title || !this.hadTags || !content) {
                this.$Message.error('请将表单填写完整！');
                return;
            }
            this.formArticle.content = content;
            this.formArticle.html = html;
            this.formArticle.tocHTML = tocHtml;
            this.formArticle.tagListNew =  this.hadTags.join('|');
            this.handleModifyArticleSingle(this.formArticle).then(res => {
                this.modalModifyArticleSingle = false;
                this.$Message.success('修改文章成功！');
                fetchInitialData(this.$store);
            }, reject => {
                this.modalModifyArticleSingle = false;
                this.$Message.error(reject);
            });
        }
    },
    computed: {
        ...mapGetters({
            articles: 'backend/article/getArticleList',
            tagList: 'global/tag/getTagList',
            classifyTagList: 'global/tag/getClassifyTagList',
        })
    },
    mounted () {
        if (this.articles.data.length <= 0 || this.tagList.data.length <= 0) {
            fetchInitialData(this.$store);
        } else {
            this.tableData = this.articles.data;
            this.total = this.articles.total;
            this.tagAll = this.tagList.data;
            this.tagClassifyAll = this.classifyTagList.data;
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
        },
        'tagList.data'(val) {
            this.tagAll = val;
        },
        'classifyTagList.data'(val) {
            this.tagClassifyAll = val;
        }
    } 
}
</script>

<style>

</style>
