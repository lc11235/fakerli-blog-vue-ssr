<style lang="less">
  @import './register.less';
</style>

<template>
    <div>
        <canvas-three />
        <Form ref="formInline" :model="formInline" :rules="ruleInline" class="register">
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
    import cookies from 'js-cookie';
    import api from '~api';
    import canvasThree from '@/components/canvas/canvas-three.vue';

    export default {
        name: 'register',
        beforeRouteEnter(to, from, next) {
            if (cookies.get('b_user')) {
                next('/backend/article/list');
            } else {
                next();
            }
        },
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
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.login();
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                });
            },
            async login() {
                const { data: { data, code }} = await api.post('backend/admin/register', this.formInline);
                if (data && code === 200) {
                    this.$Message.success('注册成功!');
                    this.$router.replace('/backend/login');
                } else {
                    this.$Message.error('注册失败!');
                }
            }
        }
    };
</script>