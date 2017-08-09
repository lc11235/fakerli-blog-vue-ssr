<template>
    <div class="settings-main card">
        <div class="settings-main-content">
            <a-input title="标题">
                <input type="text" v-model="form.title" placeholder="标题" class="base-input" name="title">
                <span class="input-info error">请输入标题</span>
            </a-input>
            <a-input title="标签" :classes="'select-item-wrap'">
                <i class="icon icon-arrow-down"></i>
                <select v-model="form.tag" class="select-item" name="tags">
                    <option value="">请选择标签</option>
                    <option v-for="tag in tags" :value="tag.tag_name" :key="tag.tag_name">{{ tag.tag_name }}</option>
                </select>
                <a @click="addTagList" href="javascript:;" class="btn btn-yellow">添加标签</a>
                <span class="input-info error">请输入标签</span>
            </a-input>
            <a-input title="已有标签" v-if="tagList.length > 0">
                <ul class="tag-list">
                    <li v-for="tagItem in tagList" v-text="tagItem" :key="tagItem"></li>
                </ul>
            </a-input>
            <div class="settings-section">
                <div id="post-content" class="settings-item-content">
                    <textarea id="editor" name="content" class="form-control hidden" data-autosave="editor-content"></textarea>
                </div>
            </div>
        </div>
        <div class="settings-footer clearfix">
            <a @click="insert" href="javascript:;" class="btn btn-yellow">添加文章</a>
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
                    html: ''
                },
                tagList:[]
            }
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
            async insert(){
                const content = postEditor.getMarkdown();
                const html = postEditor.getPreviewedHTML();
                if(!this.form.title || !this.form.tagString || !content){
                    this.$store.dispatch('global/showMsg', '请将表单填写完整！');
                    return;
                }
                this.form.content = content;
                this.form.html = html;
                const {data: {message, code, data}} = await api.post('backend/article/insert', this.form);
                if(code === 200) {
                    this.$store.dispatch('global/showMsg', {
                        type: 'success',
                        content: message
                    });
                    this.$store.commit('backend/article/insertArticleItem', data);
                    this.$router.push('/backend/article/list');
                }
            },
            addTagList() {
                if(!this.tagList.includes(this.form.tag)){
                    this.tagList.push(this.form.tag);
                    this.form.tagString = this.tagList.join("|");
                }
            }
        },
        mounted() {
            if(this.tags.length <= 0){
                fetchInitIalData(this.$store);
            }
            // eslint-disable-next-line
            window.postEditor = editormd("post-content", {
                width: "100%",
                height: 500,
                markdown: "",
                placeholder: '请输入内容...',
                path: '/static/editor.md/lib/',
                toolbarIcons(){
                    return [
                        "bold", "italic", "quote", "|",
                        "list-ul", "list-ol", "hr", "|",
                        "link", "reference-link", "image", "code", "table", "|",
                        "watch", "preview", "fullscreen"
                    ];
                },
                watch: true,
                saveHTMLToTextarea: true
            });
        }
    }
</script>