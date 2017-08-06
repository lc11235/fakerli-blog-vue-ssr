<template>
    <div class="settings-main card">
        <div class="settings-main-content">
            <a-input title="标题">
                <input type="text" v-model="form.title" placeholder="标题" class="base-input" name="title">
                <span class="input-info error">请输入标题</span>
            </a-input>
            <a-input title="标签" :classes="select-item-wrap">
                <i class="icon icon-arrow-down"></i>
                <select v-model="form.tags" class="select-item" name="tags">
                    <option value="">请选择标签</option>
                    <option v-for="tag in tags" :value="tag.tag_name" :key="tag.tag_name">{{ tag.tag_name }}</option>
                </select>
                <span class="input-info error">请输入标签</span>
            </a-input>
            <div class="settings-section">
                <div id="modify-content" class="settings-item-content">
                    <textarea id="editor" name="content" class="form-control hidden" data-autosave="editor-content"></textarea>
                </div>
            </div>
        </div>
        <div class="settings-footer clearfix">
            <router-link to="/backend/aticle/list" class="btn btn-blue">返回</router-link>
            <a @click="modify" href="javascript:;" class="btn btn-yellow">编辑文章</a>
        </div>
    </div>
</template>

<script lang="babel">
    /* global modifyEditor */
    import api from '~api';
    import { mapGetters } from 'vuex';
    import aInput from '../components/_input.vue';
    const fetchInitialData = async (store, config = {limti: 99}) => {
        await store.dispatch('global/tag/getTagList', config);
    };

    export default {
        name: 'backend-article-modify',
        data() {
            return {
                form: {
                    title: '',
                    tags: '',
                    tag_name: '',
                    tag_old: '',
                    content: ''
                }
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
            async modify() {
                const content = modifyEditor.getMarkdown();
                if(!this.form.title || !this.form.tags || !content) {
                    this.$store.dispatch('global/showMsg', '请将表单填写完整！');
                    return;
                }
                this.form.content = content;
                const {data: {message, code, data}} = await api.post('backend/article/modify', this.form);
                if(code === 200) {
                    this.$store.dispatch('global/showMsg', {
                        type: 'success',
                        content: message
                    });
                    this.$store.commit('backend/article/updateArticleItem', data);
                    this.$router.push('/backend/article/list');
                }
            }
        },
        mounted () {
            if(this.tags.length <= 0) {
                fetchInitialData(this.$store);
            }
            this.$store.dispatch('backend/article/getArticleItem').then(data => {
                this.form.title = data.title;
                this.form.category_old = data.category;
                this.form.category = data.category;
                this.form.content = data.content;
                // eslint-disable-next-line
                window.modifyEditor = editormd("modify-content", {
                    width: "100%",
                    height: 500,
                    markdown: data.content,
                    placeholder: '请输入内容...',
                    path: '/static/editor.md/lib/',
                    toolbarIcons() {
                        return [
                            "bold", "italic", "quote", "|",
                            "list-ul", "list-ol", "hr", "|",
                            "link", "reference-link", "image", "code", "table", "|",
                            "watch", "preview", "fullscreen"
                        ];
                    },
                    watch: false,
                    saveHTMLToTextarea: true
                });
            });
        },
        watch: {
            'form.category'(val) {
                const obj = this.category.find(item => item._id === val);
                this.form.category_name = obj.cate_name;
            }
        }
    }
</script>