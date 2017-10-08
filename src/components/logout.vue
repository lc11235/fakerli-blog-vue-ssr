<template>
    <div class="logout-button">
        <Button type="primary" @click="logout">退出登录</Button>
    </div>
</template>

<script lang="babel">
    export default {
        name: 'log-out',
        methods: {
            logout() {
                $.removeCookie('b_user');
                $.removeCookie('b_userid');
                $.removeCookie('b_username');
                this.$router.replace('/backend/login');
                console.log(1);
            }
        }
    };
</script>