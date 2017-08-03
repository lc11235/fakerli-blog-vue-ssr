<template>
    <aside id="menu" class="hide">
        <div class="inner flex-row-vertical">
            <a @click="hide" href="javascript:;" class="header-icon" id="menu-off">
                <i class="fa fa-lg fa-remove"></i>
            </a>
            <div class="face-wrap">
                <a href="/">
                    <img src="/static/images/me.jpg">
                </a>
                <span>fakerli's blog</span>
            </div>
            <div class="bars-wrap">
                <ul class="ul-buttons">
                    <li>
                    <router-link to="/" >
                        <i class="fa fa-home"></i>
                        <span class="text">首页</span>
                    </router-link>
                    </li>
                    <li>
                    <router-link to="/trending/visit" >
                        <i class="fa fa-archive"></i>
                        <span class="text">归档</span>
                    </router-link>
                    </li>
                    <li>
                    <router-link to="/trending/visit" >
                        <i class="fa fa-tags"></i>
                        <span class="text">标签</span>
                    </router-link>
                    </li>
                    <li>
                    <router-link to="/about" >
                        <i class="fa fa-user"></i>
                        <span class="text">关于</span>
                    </router-link>
                    </li>
                </ul>
            </div>
            <div class="link-wrap">
                <ul class="ul-buttons">
                    <li>
                        <a class="inline" rel="nofollow" target="_blank" href="mailto:lc11235@qq.com">
                            <i class="fa fa-envelope" title="邮箱"></i>
                        </a>
                    
                    
                        <a class="inline" rel="nofollow" target="_blank" href="https://www.zhihu.com/people/lichang">
                            <i class="fa fa-clone" title="知乎"></i>
                        </a>
                    
                    
                        <a class="inline" rel="nofollow" target="_blank" href="https://github.com/lc11235">
                            <i class="fa fa-github" title="Github"></i>
                        </a>
                    
                    
                        <a class="inline" rel="nofollow" target="_blank" href="https://www.fakerli.com/rss.html">
                            <i class="fa fa-rss" title="RSS"></i>
                        </a>
                    </li>
                </ul>
            </div>
            <div>
                <span class="nav-search">
                    <i class="icon icon-search-white"></i>
                    <input @keyup.enter="search($event)" placeholder="记得按回车哦" class="nav-search-input">
                </span>
            </div>
        </div>
    </aside>
</template>

<script lang="babel">
    import cookies from 'js-cookie';
    export default {
        methods: {
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