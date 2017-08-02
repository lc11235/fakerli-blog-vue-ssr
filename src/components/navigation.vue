<template>
    <aside id="menu" class="hide">
        <div v-if="backend" class="inner flex-row-vertical">
            <a @click="hide" href="javascript:;" class="header-icon" id="menu-off">
                <i class="icon icon-close-white"></i>
            </a>
            <div class="left-part">
                <a href="/" exact class="logo-link">
                    <i class="icon icon-nav-logon"></i>
                    <span class="hidden">学习是为了探索这个世界的本质</span>
                </a>
                <div class="main-nav">
                    <a href="/" class="nav-link">
                        <i class="icon icon-nav-explore"></i>
                        <span class="text">首页</span>
                    </a>
                    <a href="/trending/visit" class="nav-link">
                        <i class="icon icon-nav-explore"></i>
                        <span class="text">热门</span>
                    </a>
                    <a href="/about" class="nav-link">
                        <i class="icon icon-nav-features"></i>
                        <span class="text">关于</span>
                    </a>
                </div>
            </div>
        </div>
        <div v-else class="inner flex-row-vertical">
            <a @click="hide" href="javascript:;" class="header-icon" id="menu-off">
                <i class="icon icon-close-white"></i>
            </a>
            <div class="left-part">
                <router-link to="/" active-class="current" exact class="nav-link">
                    <i class="icon icon-nav-home"></i>
                    <span class="text">学习是为了探索这个世界的本质</span>
                </router-link>
                <div class="main-nav">
                    <router-link to="/" active-class="current" exact class="nav-link">
                        <i class="icon icon-nav-home"></i>
                        <span class="text">首页</span>
                    </router-link>
                    <router-link to="/trending/visit" active-class="current" class="nav-link">
                        <i class="icon icon-nav-explore"></i>
                        <span class="text">热门</span>
                    </router-link>
                    <router-link to="/about" active-class="current" class="nav-link">
                        <i class="icon icon-nav-features"></i>
                        <span class="text">关于</span>
                    </router-link>
                </div>
            </div>
            <div class="right-part">
                <span class="nav-search">
                    <i class="icon icon-search-white"></i>
                    <input @keyup.enter="search($event)" placeholder="记得按回车哦" class="nav-search-input">
                </span>
                <span v-if="isLogin" class="nav-me">
                    <router-link to="/user/account" class="nav-me-link">
                        <img src="//ww2.sinaimg.cn/large/005uQRNCgw1f4ij3d8m05j301s01smwx.jpg" alt="" class="nav-avatar-img">
                    </router-link>
                </span>
                <span v-else class="nav-me">
                    <a @click="login" href="javascript:;" class="nav-me-link">
                        <img src="//ww2.sinaimg.cn/large/005uQRNCgw1f4ij3d8m05j301s01smwx.jpg" alt="" class="nav-avatar-img">
                    </a>
                </span>
            </div>
        </div>
    </aside>
</template>

<script lang="babel">
    import cookies from 'js-cookie';
    export default {
        props: ['backend'],
        data() {
            return {
                isLogin: cookies.get('user')
            };
        },
        methods: {
            login() {
                this.$store.commit('global/showLoginModal', true);
            },
            search(e) {
                let qs = e.target.value;
                if(qs === "") {
                    return false;
                }
                this.$router.replace('/search/' + qs);
            },
            hide() {
                $('#menu').addClass('hide');
            }
        }
    }
</script>