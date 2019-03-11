<template>
    <Card>
        <Form :model="formArticle" :lable-width="200">
            <FormItem label="文章标题">
                <Input v-model="formArticle.title" placeholder="请输入文章标题" style="width: 50%"></Input>
            </FormItem>
            <FormItem label="选择标签">
                <Select class="select-item" multiple name="selectTags" v-model="formArticle.selectTags" @on-change="addTags" style="width: 50%">
                    <OptionGroup v-for="item1 in tagClassifyAll" :label="item1.tag_name" :value="item1.tag_name" :key="item1.tag_name">
                        <Option v-for="item2 in tagAll.filter(word => word.tag_classify === item1.tag_name)" :value="item2.tag_name" :key="item2.tag_name">{{ item2.tag_name }}</Option>
                    </OptionGroup>
                </Select>
            </FormItem>
            <FormItem label="已有标签">
                <Tag color="success" v-for="item in formArticle.hadTags" :key="item" :name="item" closable @on-close="handleCloseHadTag">{{ item }}</Tag>
            </FormItem>
        </Form>
        <div class="settings-main-content"> 
            <div class="settings-section">
                <div id="modify-content" class="settings-item-content">
                    <textarea id="editor" name="content" class="form-control hidden" data-autosave="editor-content"></textarea>
                </div>
            </div>
        </div>
    </Card>
</template>

<script lang='babel'>
    /* global modifyEditor */
    import { mapGetters, mapActions } from 'vuex';
    const fetchInitialData = async (store , config = { page: 1, limit: 10 }) => {
        await store.dispatch('global/tag/handleGetTagList', config);
    };

    export default {
        name: 'backend-article-modify',
        data() {
            return {
                formArticle: {
                    title: '',
                    tagListNew: '',
                    tagListOld: '',
                    content: '',
                    html: '',
                    tocHTML: '',
                    articleId: ''
                },
                selectTags: [],
                hadTags: [],
                tagAll: [],
                tagClassifyAll: []
            };
        },
        computed: {
            ...mapGetters({
                articleSingle: 'backend/article/getArticleSingle',
                tagList: 'global/tag/getTagList',
                classifyTagList: 'global/tag/getClassifyTagList',
            })
        },
        methods: {
            ...mapActions({
                handleModifyArticleSingle: 'backend/article/handleModifyArticleSingle',
            }),
            modifyArticle() {
                const content = modifyEditor.getMarkdown();
                const html = modifyEditor.getPreviewedHTML();
                let tocHtml = '';
                if (document.querySelectorAll('.markdown-toc')[0]) {
                    tocHtml = document.querySelectorAll('.markdown-toc')[0].outerHTML;
                }
                if (!this.formArticle.title || !this.formArticle.hadTags || !content) {
                    this.$store.dispatch('global/showMsg', '请将表单填写完整！');
                    return;
                }
                this.formArticle.content = content;
                this.formArticle.html = html;
                this.formArticle.tocHTML = tocHtml;
                this.formArticle.tagListOld =  this.hadTags.join('|');
                this.handleModifyArticleSingle(this.formArticle).then(res => {
                    this.$Message.success('新增文章成功！');
                }, reject => {
                    this.$Message.error(reject);
                });
            },
            addTags() {
            },
            handleCloseHadTag() {

            }
        },
        mounted() {
            $('body').everyTime('500ms', 'A', function () {
                if ($('.editormd-preview-close-btn').length > 0) {
                    $('.editormd-preview-close-btn').hide();
                    $('body').stopTime('A');
                }
            });
            if (this.tagList.data.length <= 0 || !this.articleSingle) {
                fetchInitialData(this.$store);
            } else {
                console.log(this.articleSingle);
                this.formArticle.title = this.articleSingle.title;
                this.formArticle.hadTags = this.articleSingle.tags;
                this.formArticle.content = this.articleSingle.content;
                this.formArticle.articleId = this.articleSingle._id;
                this.formArticle.tagListOld = this.articleSingle.tags.join('|');

                this.tagAll = this.tagList.data;
                this.tagClassifyAll = this.classifyTagList.data;
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
            }
        },
        watch: {
            item(val) {
                this.formArticle.title = val.data.title;
                this.formArticle.content = val.data.content;
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
                    saveHTMLToTextarea: true,
                    tex: true,
                    flowChart: true,
                    sequenceDiagram: true,
                    taskList: true,
                    htmlDecode: true,
                    emoji: true
                });
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                fetchInitialData(vm.$store);
            });
        }
    };
</script>