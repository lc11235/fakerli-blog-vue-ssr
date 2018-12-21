<template>
    <div class="logout-button">
        <Button type="primary" @click="logout">退出登录</Button>
    </div>
</template>

<script lang="babel">
    import cookies from 'js-cookie';
    export default {
        name: 'log-out',
        methods: {
            logout() {
                cookies.remove('b_user');
                cookies.remove('b_userid');
                cookies.remove('b_username');
                this.$router.push({ path: '/backend/login' });
            }
        }
    };
</script>