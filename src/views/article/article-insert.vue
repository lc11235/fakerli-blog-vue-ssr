<style lang="less">
  @import './article-insert.less';
</style>

<template>
    <div>
        <Card>
            <Modal
                title="文章标题"
                v-model="modalWriteOrUpload"
                :closable="false"
                :mask-closable="false">
                <Form :model="formArticle" :label-width="80">
                    <FormItem label="文章标题">
                        <Input v-model="formArticle.title" placeholder="请输入文章标题"></Input>
                    </FormItem>
                    <FormItem label="文章标签">
                        <Select v-model="tagList" multiple @on-change="addTagList">
                            <OptionGroup v-for="item1 in tagClassifyAll" :label="item1.tag_name" :value="item1.tag_name" :key="item1.tag_name">
                                <Option v-for="item2 in tagAll.filter(word => word.tag_classify === item1.tag_name)" :value="item2.tag_name" :key="item2.tag_name">{{ item2.tag_name }}</Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
            <Modal
                title="编辑器主题"
                v-model="modalTheme"
                :closable="false"
                :mask-closable="false">
                <Form :model="formTheme" :label-width="80">
                    <FormItem label="菜单主题">
                        <Select class="select-item" name="theme" v-model="formTheme.selectTheme" @on-change="themeChange(formTheme.selectTheme, 'theme')" style="width: 100%">
                            <Option v-for="theme in formTheme.theme" :value="theme" :key="theme">{{ theme }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="编辑器主题">
                        <Select class="select-item" name="editorTheme" v-model="formTheme.selectEditorTheme" @on-change="themeChange(formTheme.selectEditorTheme, 'editortheme')" style="width: 100%">
                            <Option v-for="theme in formTheme.editorTheme" :value="theme" :key="theme">{{ theme }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="预览器主题">
                        <Select class="select-item" name="previewTheme" v-model="formTheme.selectPreviewTheme" @on-change="themeChange(formTheme.selectPreviewTheme, 'previewtheme')" style="width: 100%">
                            <Option v-for="theme in formTheme.previewTheme" :value="theme" :key="theme">{{ theme }}</Option>
                        </Select>
                    </FormItem>
                </Form>         
            </Modal>
            <Modal
                title="文章上传"
                v-model="modalUpload"
                :closable="false"
                :mask-closable="false">
                <Upload
                    type="drag"
                    with-credentials
                    :format="['md']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="handleUpload"
                    action="/api/backend/article/upload">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到这里上传</p>
                    </div>
                </Upload>

            </Modal>
            <Button style="margin: 10px 0;" type="primary" @click="handleArticleMode">文章标题</Button>
            <Divider type="vertical" />
            <Button style="margin: 10px 0;" type="success" @click="handleInsertArticle" shape="circle">添加文章</Button>
            <Divider type="vertical" />
            <Button style="margin: 10px 0;" type="success" @click="handleUploadArticle" shape="circle">上传文章</Button>
            <Divider type="vertical" />
            <Button style="margin: 10px 0;" type="info" @click="handleTheme">编辑器主题</Button>
            <div class="settings-main-content">
                <div class="settings-section" style="padding-bottom:0">
                    <div id="post-content" class="settings-item-content">
                        <textarea id="editor" name="content" class="form-control hidden" data-autosave="editor-content"></textarea>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>

<script lang="babel">
    /* global postEditor */
    import api from '~api';
    import { mapGetters } from 'vuex';
    const fetchInitIalData = async (store) => {
        await store.dispatch('global/tag/getTagList');
        await store.dispatch('global/tag/getClassifyList');
    };

    export default {
        name: 'backend-article-insert',
        data() {
            return {
                formArticle: {
                    title: '',
                    tagString: '',
                    content: '',
                    html: '',
                    tocHTML: '',
                },
                formTheme: {
                    selectTheme: 'default',
                    selectPreviewTheme: 'default',
                    selectEditorTheme: 'default',
                    theme: ['default', 'dark'],
                    editorTheme: ['default', '3024-day', '3024-night', 'ambiance', 'ambiance-mobile', 'base16-dark', 'base16-light',
                        'blackboard', 'cobalt', 'eclipse', 'elegant', 'erlang-dark', 'lesser-dark', 'mbo,mdn-like', 'midnight',
                        'monokai', 'neat,neo', 'night', 'paraiso-dark', 'paraiso-light', 'pastel-on-dark', 'rubyblue', 'solarized',
                        'the-matrix', 'tomorrow-night-eighties', 'twilight', 'vibrant-ink', 'xq-dark', 'xq-light'],
                    previewTheme: ['default', 'dark'],
                },
                tagList: [],
                file: null,
                opacity: true,
                modalWriteOrUpload: false,
                modalTheme: false,
                modalUpload: false,
                value4: '',
                tagAll: [],
                tagClassifyAll: []
            };
        },
        computed: {
            ...mapGetters({
                tags: 'global/tag/getTagList',
                tagClassifys: 'global/tag/getClassifyList',
            })
        },
        methods: {
            async handleInsertArticle() {
                const content = postEditor.getMarkdown();
                const html = postEditor.getPreviewedHTML();
                let tocHtml = '';
                if (document.querySelectorAll('.markdown-toc')[0]) {
                    tocHtml = document.querySelectorAll('.markdown-toc')[0].outerHTML;
                }
                if (!this.formArticle.title) {
                    this.$Message.error('请填写文章标题');
                    return;
                }
                if (!this.formArticle.tagString) {
                    this.$Message.error('请选择文章标签');
                    return;
                }
                if (!content) {
                    this.$Message.error('请填写文章内容');
                    return;
                }
                this.formArticle.content = content;
                this.formArticle.html = html;
                this.formArticle.tocHTML = tocHtml;
                const { data: { message, code, data }} = await api.post('backend/article/insert', this.formArticle);
                if (code === 200) {
                    this.$Message.success(message);
                    this.$store.commit('backend/article/insertArticleItem', data);
                    this.$router.push('/backend/article/article_manage');
                }
            },
            addTagList() {
                this.formArticle.tagString = this.tagList.join('|');
            },
            themeChange(themeTitle, source) {
                if (source === 'theme') {
                    postEditor.setTheme(themeTitle);
                } else if (source === 'previewtheme') {
                    postEditor.setPreviewTheme(themeTitle);
                } else if (source === 'editortheme') {
                    postEditor.setEditorTheme(themeTitle);
                }
            },
            handleArticleMode() {
                this.modalWriteOrUpload = true;
            },
            handleTheme() {
                this.modalTheme = true;
            },
            handleUploadArticle() {
                this.modalUpload = true;
            },
            closeTag(event, name) {
                const index = this.tagList.indexOf(name);
                this.tagList.splice(index, 1);
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 md格式的markdown文件。'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            handleUpload(file) {
                let that = this;
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function () {
                    // 此处不可使用箭头函数，因为箭头函数的this绑定为定义时的this，跟运行时的this不一样。
                    that.opacity = false;
                    $('.article-select').addClass('left');
                    // eslint-disable-next-line
                    window.postEditor = editormd('post-content', {
                        width: '100%',
                        height: 600,
                        markdown: this.result,
                        placeholder: '请输入内容...',
                        path: '/static/editor.md/lib/',
                        theme: 'default | dark',
                        previewTheme: 'default | dark',
                        editorTheme: 'default',
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
                        htmlDecode: 'style, script, iframe',
                        emoji: true
                    });
                    $('body').everyTime('100ms', 'A', function () {
                        if ($('.editormd-preview-close-btn').length > 0) {
                            $('.editormd-preview-close-btn').hide();
                            $('body').stopTime('A');
                        }
                    });
                };
                // return false;
            }
        },
        mounted() {
            $('body').everyTime('500ms', 'A', function () {
                if ($('.editormd-preview-close-btn').length > 0) {
                    $('.editormd-preview-close-btn').hide();
                    $('body').stopTime('A');
                }
            });
            if (this.tags.length <= 0) {
                fetchInitIalData(this.$store);
            } else {
                this.tagAll = this.tags;
            }
            if (this.tagClassifys.length <= 0) {
                fetchInitIalData(this.$store);
            } else {
                this.tagClassifyAll = this.tagClassifys;
            }
            // eslint-disable-next-line
            window.postEditor = editormd('post-content', {
                width: '100%',
                height: 600,
                markdown: '',
                placeholder: '请输入内容...',
                path: '/static/editor.md/lib/',
                theme: 'default | dark',
                previewTheme: 'default | dark',
                editorTheme: 'default',
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
                htmlDecode: 'style, script, iframe',
                emoji: true
            });
        },
        watch: {
            tags(val) {
                this.tagAll = val;
            },
            tagClassifys(val) {
                this.tagClassifyAll = val;
            }
        }
    };
</script>