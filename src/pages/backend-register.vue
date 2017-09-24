<template>
    <div>
        <a-canvas />
        <Form ref="formInline" :model="formInline" :rules="ruleInline" class="backend-login">
            <FormItem prop="username">
                <Input type="text" size="large" v-model="formInline.username" placeholder="Username">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="email">
                <Input type="text" size="large" v-model="formInline.email" placeholder="email">
                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="password">
                <Input type="password" size="large" v-model="formInline.password" placeholder="Password">
                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formInline')" long>登录</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script lang="babel">
    import cookies from 'js-cookie';
    import api from '~api';
    import aCanvas from '~components/canvas.vue';

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
            aCanvas
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
                const { data: { data, code }} = await api.post('backend/admin/login', this.formInline);
                if (data && code === 200) {
                    this.$Message.error('登录成功!');
                    this.$router.replace('/backend/article/list');
                } else {
                    this.$Message.error('登录失败!');
                }
            }
        }
    };
</script>