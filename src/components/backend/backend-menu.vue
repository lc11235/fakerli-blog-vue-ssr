<template>
    <div id="backmenu">
        <blogname />
        <Menu :theme="theme" width="250px" active-name="/backend/article/list" :open-names="['article']" @on-select="navigateTo" accordion="true">
            <Submenu name="dashboard">
                <template slot="title">
                    <Icon type="ios-clipboard" size="24"></Icon>
                    Dashboard
                </template>
                <MenuItem name="/backend/article/list" replace="true">
                    状态面板
                </MenuItem>
            </Submenu>
            <Submenu name="user">
                <template slot="title">
                    <Icon type="ios-people" size="24"></Icon>
                    用户管理
                </template>
                <MenuItem name="/backend/admin/list" replace="true">
                    用户列表
                </MenuItem>
            </Submenu>
            <Submenu name="article">
                <template slot="title">
                    <Icon type="ios-document" size="24" />
                    文章
                </template>
                <MenuItem name="/backend/article/list" replace="true">
                    文章管理
                </MenuItem>
                <MenuItem name="/backend/article/insert" replace="true">
                    发布文章
                </MenuItem>
            </Submenu>
            <Submenu name="message">
                <template slot="title">
                    <Icon type="ios-chatbubbles" size="24"></Icon>
                    留言
                </template>
                <MenuItem name="/backend/tag/list" replace="true">
                    留言管理
                </MenuItem>
            </Submenu>
            <Submenu name="tag">
                <template slot="title">
                    <Icon type="ios-pricetags" size="24"></Icon>
                    标签
                </template>
                <MenuItem name="/backend/tag/list" replace="true">
                    管理标签
                </MenuItem>
                <MenuItem name="/backend/tag/insert" replace="true">
                    添加标签
                </MenuItem>
            </Submenu>
            <Submenu name="link">
                <template slot="title">
                    <Icon type="ios-link" size="24"></Icon>
                    友情链接
                </template>
                <MenuItem name="/backend/tag/list" replace="true">
                    链接管理
                </MenuItem>
            </Submenu>
            <Submenu name="albums">
                <template slot="title">
                    <Icon type="ios-albums" size="24"></Icon>
                    分类
                </template>
                <MenuItem name="/backend/tag/list" replace="true">
                    分类管理
                </MenuItem>
            </Submenu>
            <Submenu name="timeline">
                <template slot="title">
                    <Icon type="ios-time" size="24"></Icon>
                    时间轴
                </template>
                <MenuItem name="/backend/tag/list" replace="true">
                    时间轴管理
                </MenuItem>
            </Submenu>
            <Submenu name="bug">
                <template slot="title">
                    <Icon type="ios-bug" size="24"></Icon>
                    异常页
                </template>
                <MenuItem name="/backend/tag/list" replace="true">
                    构造异常页
                </MenuItem>
            </Submenu>
            <Submenu name="personal">
                <template slot="title">
                    <Icon type="ios-person" size="24"></Icon>
                    个人中心
                </template>
                <MenuItem name="/backend/tag/list" replace="true">
                    个人资料
                </MenuItem>
            </Submenu>
        </Menu>
    </div> 
</template>

<script lang="babel">
    import blogname from '~components/backend/blog-name.vue';
    export default {
        name: 'backend-menu',
        data() {
            return {
                theme: 'light'
            };
        },
        components: {
            blogname
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