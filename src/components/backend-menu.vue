<template>
    <div class="main-right">
        <div class="card card-me">
            <router-link to="/backend/admin/list" active-class="active" class="side-entry">
                <i class="icon icon-arrow-right"></i>
                <i class="icon icon-articles"></i>
                管理账号
            </router-link>
        </div>
        <div class="card card-me">
            <router-link to="/backend/tag/insert" active-class="active" class="side-entry">
                <i class="icon icon-arrow-right"></i>
                <i class="icon icon-articles"></i>
                添加标签
            </router-link>
            <router-link to="/backend/tag/list" active-class="active" class="side-entry">
                <i class="icon icon-arrow-right"></i>
                <i class="icon icon-articles"></i>
                管理标签
            </router-link>
            <router-link to="/backend/article/insert" active-class="active" class="side-entry">
                <i class="icon icon-arrow-right"></i>
                <i class="icon icon-articles"></i>
                发布文章
            </router-link>
            <router-link to="/backend/article/list" active-class="active" class="side-entry">
                <i class="icon icon-arrow-right"></i>
                <i class="icon icon-articles"></i>
                管理文章
            </router-link>
        </div>
    </div>
</template>

<script lang="babel">
    export default {
        name: 'backend-menu',
        serverCacheKey: () => {
            return `backend::menu`
        }
    }
</script>