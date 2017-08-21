<template>
    <div class="settings-main card">
        <div class="settings-main-content">
            <a-input title="标签名称">
                <input type="text" v-model="form.tag_name" placeholder="标签名称" class="base-input" name="tag_name">
                <span class="input-info error">请输入标签名称</span>
            </a-input>
        </div>
        <div class="settings-footer clearfix">
            <router-link to="/backend/tag/list" class="btn btn-blur">返回</router-link>
            <Button @click="modify" type="success" shape="circle">编辑标签</Button>
        </div>
    </div>
</template>

<script lang="babel">
    import api from '~api';
    import { mapGetters } from 'vuex';
    import aInput from '../components/_input.vue';

    const fetchInitialData = async store => {
        await store.dispatch('global/tag/getTagItem');
    };

    export default {
        name: 'backend-tag-modify',
        data() {
            return {
                form: {
                    tag_name_old: '',
                    tag_name: ''
                }
            }
        },
        components: {
            aInput
        },
        computed: {
            ...mapGetters({
                item: 'global/tag/getTagItem'
            })
        },
        methods: {
            async modify() {
                if(!this.form.tag_name) {
                    this.$store.dispatch('global/showMsg', '请将表单填写完整！');
                    return;
                }

                const {data: {message, code, data}} = await api.post('backend/tag/modify', this.form);
                if(code === 200 && data) {
                    this.$store.dispatch('global/showMsg', {
                        type: 'success',
                        content: message
                    });
                    this.$store.commit('global/tag/updateTagItem', data);
                    this.$router.push('/backend/tag/list');
                }
            }
        },
        mounted() {
            if(!this.item._id || this.item.path !== this.$route.path) {
                fetchInitialData(this.$store);
            } else {
                this.form.tag_name = this.item.tag_name;
                this.form.tag_name_old = this.item.tag_name;
            }
        },
        watch: {
            item(val) {
                this.form.tag_name = val.tag_name;
                this.form.tag_name_old = this.item.tag_name;
            }
        }
    }
</script>