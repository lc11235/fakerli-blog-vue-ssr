<template>
    <div>
        <div class="article-select">
            <div class="article-button-list left">
                <Button @click="writeArticle" type="success" size="large" long>写文章</Button>
            </div>
            <div class="article-button-list right">
                <Button @click="uploadArticle" type="success" size="large" long>上传文章</Button>
            </div>
        </div>
        <div class="settings-main card" v-show="showWrite">
            <div class="settings-main-content">
                <a-input title="标题">
                    <input type="text" v-model="form.title" placeholder="标题" class="base-input" name="title" style="width: 70%">
                    <span class="input-info error">请输入标题</span>
                </a-input>
                <a-input title="标签" class="select-item-wrap">
                    <i class="icon icon-arrow-down"></i>
                    <Select v-model="form.tag" style="width: 70%">
                        <Option v-for="tag in tags" :value="tag.tag_name" :key="tag.tag_name">{{ tag.tag_name }}</Option>
                    </Select>
                    <Button @click="addTagList" type="success" shape="circle">添加标签</Button>
                    <span class="input-info error">请输入标签</span>
                </a-input>
                <a-input title="已有标签" v-if="tagList.length > 0">
                    <Tag v-for="tagItem in tagList" :key="tagItem" type="dot" closable @on-close="closeTag" color="blue">{{ tagItem }}</Tag>
                </a-input>
                <div>
                    <Select class="select-item" name="theme" v-model="selectTheme" @on-change="themeChange(selectTheme, 'theme')" style="width: 30%">
                        <Option v-for="theme in theme" :value="theme" :key="theme">{{ theme }}</Option>
                    </Select>
                    <Select class="select-item" name="previewTheme" v-model="selectPreviewTheme" @on-change="themeChange(selectPreviewTheme, 'previewtheme')" style="width: 30%">
                        <Option v-for="theme in previewTheme" :value="theme" :key="theme">{{ theme }}</Option>
                    </Select>
                    <Select class="select-item" name="editorTheme" v-model="selectEditorTheme" @on-change="themeChange(selectEditorTheme, 'editortheme')" style="width: 30%">
                        <Option v-for="theme in editorTheme" :value="theme" :key="theme">{{ theme }}</Option>
                    </Select>
                </div>
                <div class="settings-section" style="padding-bottom:0">
                    <div id="post-content" class="settings-item-content">
                        <textarea id="editor" name="content" class="form-control hidden" data-autosave="editor-content"></textarea>
                    </div>
                </div>
            </div>
            <div class="settings-footer clearfix">
                <Button @click="insert" type="success" shape="circle">添加文章</Button>
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
    </div>
</template>

<script lang="babel">
    /* global postEditor */
    import api from '~api';
    import { mapGetters } from 'vuex';
    import aInput from '../components/_input.vue';
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
                opacity: true
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
            closeTag(event, name) {
                const index = this.tagList.indexOf(name);
                this.tagList.splice(index, 1);
            },
            writeArticle() {
                this.showWrite = true;
                this.showUpload = false;
                this.opacity = false;
                $('.article-select').addClass('left');
            },
            uploadArticle() {
                this.showWrite = false;
                this.showUpload = true;
                this.opacity = false;
                $('.article-select').addClass('left');
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