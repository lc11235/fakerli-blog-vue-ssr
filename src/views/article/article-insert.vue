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
                <Form :model="form" :label-width="80">
                    <FormItem label="文章标题">
                        <Input v-model="form.title" placeholder="请输入文章标题"></Input>
                    </FormItem>
                    <FormItem label="文章标签">
                        <AutoComplete
                            v-model="value4"
                            icon="ios-search"
                            placeholder="input here"
                            style="width:300px">
                            <div v-if="tagList.length > 0">
                                <Tag v-for="tagItem in tagList" :key="tagItem" type="dot" closable @on-close="closeTag" color="blue">{{ tagItem }}</Tag>
                            </div>
                            <div class="demo-auto-complete-item" v-for="item in data4">
                                <div class="demo-auto-complete-group">
                                    <span>{{ item.title }}</span>
                                    <a href="https://www.google.com/search?q=iView" target="_blank">更多</a>
                                </div>
                                <Option v-for="option in item.children" :value="option.title" :key="option.title">
                                    <span class="demo-auto-complete-title">{{ option.title }}</span>
                                    <span class="demo-auto-complete-count">{{ option.count }} 人关注</span>
                                </Option>
                            </div>
                            <a href="https://www.google.com/search?q=iView" target="_blank" class="demo-auto-complete-more">查看所有结果</a>
                        </AutoComplete>
                    </FormItem>
                </Form>
            </Modal>
            <Modal
                title="Title"
                v-model="modalTheme"
                :closable="false"
                :mask-closable="false">
                <Select class="select-item" name="theme" v-model="selectTheme" @on-change="themeChange(selectTheme, 'theme')" style="width: 30%">
                            <Option v-for="theme in theme" :value="theme" :key="theme">{{ theme }}</Option>
                        </Select>
                        <Select class="select-item" name="previewTheme" v-model="selectPreviewTheme" @on-change="themeChange(selectPreviewTheme, 'previewtheme')" style="width: 30%">
                            <Option v-for="theme in previewTheme" :value="theme" :key="theme">{{ theme }}</Option>
                        </Select>
                        <Select class="select-item" name="editorTheme" v-model="selectEditorTheme" @on-change="themeChange(selectEditorTheme, 'editortheme')" style="width: 30%">
                            <Option v-for="theme in editorTheme" :value="theme" :key="theme">{{ theme }}</Option>
                        </Select>
            </Modal>
            <Button style="margin: 10px 0;" type="primary" @click="handleArticleMode">文章标题</Button>
            <Button style="margin: 10px 0;" type="primary" @click="handleTheme">编辑器主题</Button>
            <Divider type="vertical" />
            <Button style="margin: 10px 0;" type="success" @click="insert" shape="circle">添加文章</Button>
            <div class="settings-main-content">
                <div class="settings-section" style="padding-bottom:0">
                    <div id="post-content" class="settings-item-content">
                        <textarea id="editor" name="content" class="form-control hidden" data-autosave="editor-content"></textarea>
                    </div>
                </div>
            </div>
            <div class="article-upload" v-show="showUpload">
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
            </div>
        </Card>
    </div>
</template>

<script lang="babel">
    /* global postEditor */
    import api from '~api';
    import { mapGetters } from 'vuex';
    import aInput from '@/views/backend/_input.vue';
    const fetchInitIalData = async (store) => {
        await store.dispatch('global/tag/getTagList');
    };

    export default {
        name: 'backend-article-insert',
        data() {
            return {
                form: {
                    title: '',
                    tag: '',
                    tagString: '',
                    content: '',
                    html: '',
                    tocHTML: '',
                },
                selectTheme: '',
                selectPreviewTheme: '',
                selectEditorTheme: '',
                tagList: [],
                theme: ['default', 'dark'],
                editorTheme: ['default', '3024-day', '3024-night', 'ambiance', 'ambiance-mobile', 'base16-dark', 'base16-light',
                    'blackboard', 'cobalt', 'eclipse', 'elegant', 'erlang-dark', 'lesser-dark', 'mbo,mdn-like', 'midnight',
                    'monokai', 'neat,neo', 'night', 'paraiso-dark', 'paraiso-light', 'pastel-on-dark', 'rubyblue', 'solarized',
                    'the-matrix', 'tomorrow-night-eighties', 'twilight', 'vibrant-ink', 'xq-dark', 'xq-light'],
                previewTheme: ['default', 'dark'],
                showWrite: true,
                showUpload: false,
                file: null,
                opacity: true,
                modalWriteOrUpload: false,
                modalTheme: false,
                 value4: '',
                data4: [
                    {
                        title: '话题',
                        children: [
                            {
                                title: 'iView',
                                count: 10000,

                            },
                            {
                                title: 'iView UI',
                                count: 10600,

                            }
                        ]
                    },
                    {
                        title: '问题',
                        children: [
                            {
                                title: 'iView UI 有多好',
                                count: 60100,

                            },
                            {
                                title: 'iView 是啥',
                                count: 30010,

                            }
                        ]
                    },
                    {
                        title: '文章',
                        children: [
                            {
                                title: 'iView 是一个设计语言',
                                count: 100000,

                            }
                        ]
                    }
                ]
            };
        },
        components: {
            aInput
        },
        computed: {
            ...mapGetters({
                tags: 'global/tag/getTagList'
            })
        },
        methods: {
            async insert() {
                const content = postEditor.getMarkdown();
                const html = postEditor.getPreviewedHTML();
                let tocHtml = '';
                if (document.querySelectorAll('.markdown-toc')[0]) {
                    tocHtml = document.querySelectorAll('.markdown-toc')[0].outerHTML;
                }
                if (!this.form.title || !this.form.tagString || !content) {
                    this.$store.dispatch('global/showMsg', '请将表单填写完整！');
                    return;
                }
                this.form.content = content;
                this.form.html = html;
                this.form.tocHTML = tocHtml;
                const { data: { message, code, data }} = await api.post('backend/article/insert', this.form);
                if (code === 200) {
                    this.$store.dispatch('global/showMsg', {
                        type: 'success',
                        content: message
                    });
                    this.$store.commit('backend/article/insertArticleItem', data);
                    this.$router.push('/backend/article/list');
                }
            },
            addTagList() {
                if (!this.tagList.includes(this.form.tag)) {
                    this.tagList.push(this.form.tag);
                    this.form.tagString = this.tagList.join('|');
                }
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
                    that.showWrite = true;
                    that.showUpload = false;
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
        }
    };
</script>