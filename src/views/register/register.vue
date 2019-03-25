<style lang="less">
  @import './register.less';
</style>

<template>
    <div>
        <canvas-three />
        <Form ref="formInline" :model="formInline" :rules="ruleInline" class="register" @keydown.enter.native="handleSubmit('formInline')">
            <FormItem prop="username">
                <Input type="text" size="large" v-model="formInline.username" placeholder="Username">
                    <span slot="prepend">
                        <Icon :size="20" type="ios-person"></Icon>
                    </span>
                </Input>
            </FormItem>
            <FormItem prop="email">
                <Input type="text" size="large" v-model="formInline.email" placeholder="email">
                    <span slot="prepend">
                        <Icon :size="20" type="ios-mail"></Icon>
                    </span>
                </Input>
            </FormItem>
            <FormItem prop="password">
                <Input type="password" size="large" v-model="formInline.password" placeholder="Password">
                    <span slot="prepend">
                        <Icon :size="20" type="md-lock"></Icon>
                    </span>
                </Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formInline')" long>注册</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script lang="babel">
    import { mapActions } from 'vuex';
    import canvasThree from '@/components/canvas/canvas-three.vue';

    export default {
        name: 'register',
        data() {
            return {
                formInline: {
                    username: '',
                    email: '',
                    password: ''
                },
                ruleInline: {
                    username: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请填写邮件地址', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 8, message: '密码长度不能小于8位', trigger: 'blur' }
                    ]
                }
            };
        },
        components: {
            canvasThree
        },
        methods: {
            ...mapActions({
                handleRegister: 'backend/admin/handleRegister'
            }),
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.handleRegister(this.formInline).then(res => {
                            this.formInline.username = '';
                            this.formInline.email = '';
                            this.formInline.password = '';
                            this.$Message.success(res);
                        }, reject => {
                            this.$Message.error(reject);
                        })
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                });
            }
        }
    };
</script>