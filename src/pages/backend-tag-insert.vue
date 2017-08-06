<template>
    <div class="settings-main card">
        <div class="settings-main-content">
            <a-input title="标签名称">
                <input type="text" v-model="form.tag_name" placeholder="标签名称" class="base-input" name="tag_name">
                <span class="input-info error">请输入标签名称</span>
            </a-input>
        </div>
        <div class="settings-footer clearfix">
            <a @click="insert" href="javascript:;" class="btn bnt-yellow">添加标签</a>
        </div>
    </div>
</template>

<script lang="babel">
    import api from '~api';
    import aInput from '../components/_input.vue';

    export default {
        name: 'backend-tag-insert',
        data() {
            return {
                form: {
                    tag_name: ''
                }
            }
        },
        components: {
            aInput
        },
        methods: {
            async insert() {
                if(!this.form.tag_name) {
                    this.$store.dispatch('global/showMsg', '请将表单填写完整！');
                    return;
                }
                const {data: {message, code, data}} = await api.post('backend/tag/insert', this.form);
                if(code === 200) {
                    this.$store.dispatch('global/showMsg', {
                        type: 'success',
                        content: message
                    });
                    this.$store.commit('global/tag/insertTagItem', {
                        ...this.form,
                        _id: data
                    });
                    this.$router.push('/backend/tag/list');
                }
            }
        }
    }
</script>