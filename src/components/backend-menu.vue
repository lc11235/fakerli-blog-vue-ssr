<template>
    <div id="backmenu">
        <Menu :theme="theme" active-name="1" @on-select="navigateTo">
        <MenuGroup title="账号管理">
            <MenuItem name="/backend/admin/list" replace="true">
                <Icon type="document-text"></Icon>
                账号
            </MenuItem>
        </MenuGroup>
        <MenuGroup title="内容管理">
            <MenuItem name="/backend/article/list" replace="true">
                <Icon type="document-text"></Icon>
                文章管理
            </MenuItem>
            <MenuItem name="/backend/article/insert" replace="true">
                <Icon type="chatbubbles"></Icon>
                发布文章
            </MenuItem>
        </MenuGroup>
        <MenuGroup title="标签管理">
            <MenuItem name="/backend/tag/list" replace="true">
                <Icon type="heart"></Icon>
                管理标签
            </MenuItem>
            <MenuItem name="/backend/tag/insert" replace="true">
                <Icon type="heart-broken"></Icon>
                添加标签
            </MenuItem>
        </MenuGroup>
        </Menu>
    </div> 
</template>

<script lang="babel">
    export default {
        name: 'backend-menu',
        data() {
            return {
                theme: 'light'
            };
        },
        methods: {
            navigateTo(name) {
                this.$router.replace(name);
            }
        },
        serverCacheKey: () => {
            return `backend::menu`;
        }
    };
</script>