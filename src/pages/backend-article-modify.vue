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
    const fetchInitialData = async (store) => {
        await store.dispatch('global/tag/getTagList');
        await store.dispatch('backend/article/getArticleItem');
    };

    export default {
        name: 'backend-article-modify',
        data() {
            return {
                form: {
                    title: '',
                    tag: '',
                    tagList_old: '',
                    content: ''
                },
                tagList: []
            }
        },
        beforeRouteEnter(to, from, next) {
            //does NOT have access to `this` component instance
            next(vm => {
                fetchInitialData(vm.$store);
            });
        },
        components: {
            aInput
        },
        computed: {
            ...mapGetters({
                tags: 'global/tag/getTagList',
                item: 'backend/article/getArticleItem'
            })
        },
        methods: {
            async modify() {
                const content = modifyEditor.getMarkdown();
                if(!this.form.title || !this.form.tag || !content) {
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
            },
            addTagList() {
                if(!this.tagList.includes(this.form.tag)){
                    this.tagList.push(this.form.tag);
                    this.form.tagString = this.tagList.join("|");
                }
            }
        },
        mounted () {
            if(this.tags.length <= 0 || !this.item.data) {
                fetchInitialData(this.$store);
            } else {
                this.tagList = this.item.data.tags;
                this.form.title = this.item.data.title;
                this.form.content = this.item.data.content;
                // eslint-disable-next-line
                window.modifyEditor = editormd("modify-content", {
                width: "100%",
                height: 500,
                markdown: this.item.data.content,
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
            }
        },
        watch: {
            'form.tag'(val) {
                const obj = this.tags.find(item => item.tag === val);
                this.form.tag = obj.tag;
            }
        }
    }
</script>