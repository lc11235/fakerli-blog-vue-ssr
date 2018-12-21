<template>
    <aside id="menu">
        <div class="inner flex-row-vertical">
            <a @click="hide" href="javascript:;" aria-label="head" class="header-icon" id="menu-off">
                <i class="fa fa-lg fa-remove"></i>
            </a>
            <div class="face-wrap">
                <router-link to="/" aria-label="me" >
                    <img src="/static/images/me.png" alt="fakerli" height="144" width="144">
                </router-link>
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
                    <router-link to="/archives" >
                        <i class="fa fa-archive"></i>
                        <span class="text">归档</span>
                    </router-link>
                    </li>
                    <li>
                    <router-link to="/tags" >
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
                        <a class="inline" rel="nofollow noopener noreferrer" target="_blank" href="mailto:lc11235@qq.com">
                            <i class="fa fa-envelope" title="邮箱"></i>
                        </a>
                    
                    
                        <a class="inline" rel="nofollow noopener noreferrer" target="_blank" href="https://www.zhihu.com/people/lichang">
                            <i class="fa fa-clone" title="知乎"></i>
                        </a>
                    
                    
                        <a class="inline" rel="nofollow noopener noreferrer" target="_blank" href="https://github.com/lc11235">
                            <i class="fa fa-github" title="Github"></i>
                        </a>
                    
                    
                        <a class="inline" rel="nofollow noopener noreferrer" target="_blank" href="https://www.fakerli.com/rss.html">
                            <i class="fa fa-rss" title="RSS"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </aside>
</template>

<script lang="babel">
    export default {
        methods: {
            hide() {
                $('#menu').addClass('hide');
            }
        }
    };
</script>