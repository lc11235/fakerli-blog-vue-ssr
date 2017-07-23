<template>
    <div class="card card-me">
        <router-link to="/user/account" active-class="active" class="side-entry">
            <i class="icon icon-arrow-right"></i>
            <i class="icon icon-articles"></i>
            账号
        </router-link>
        <router-link to="/user/password" active-class="active" class="side-entry">
            <i class="icon icon-arrow-right"></i>
            <i class="icon icon-articles"></i>
            密码
        </router-link>
        <a @click="handleLogout" href="javascript:;" class="side-entry">
            <i class="icon icon-arrow-right"></i>
            <i class="icon icon-arrticles"></i>
            退出
        </a>
    </div>
</template>

<script lang="babel">
    import api from '~api';
    export default {
        name: 'aside-account',
        serverCachekey: () => {
            return `aside::account`
        },
        methods: {
            async handleLogout() {
                await api.post('frontend/usertr/logout', {});
                window.location.href = '/';
            }
        }
    }
</script>
