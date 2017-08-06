<template>
    <header class="top-header" id="header">
        <div class="flex-row">
            <a @click="visible" href="javascript:;" class="header-icon">
                <i class="fa fa-lg fa-bars"></i>
            </a>
            <div class="flex-col header-title ellipsis">{{title}}</div>
            <div class="search-wrap" id="search-wrap">
                <a href="javascript:;" class="header-icon" id="back">
                    <i class="fa fa-lg fa-chevron-left"></i>
                </a>
                <input type="text" id="key" class="search-input" autocomplete="off" placeholder="请输入关键字">
                <a @click="searchVisible" href="javascript:;" class="header-icon" id="search">
                    <i class="fa fa-lg fa-search"></i>
                </a>
            </div>
            <a href="javascript:;" class="header-icon">
                <i class="fa fa-lg fa-share-alt"></i>
            </a>
        </div>
    </header>
</template>

<script lang="babel">
    export default {
        name: 'top-header',
        props: ["title"],
        methods: {
            visible() {
                $('#menu').removeClass('hide');
            },
            searchVisible() {
                $('#search-wrap').toggleClass('in');
            },
            scrolling() {
                if(window.scrollTime2) window.clearTimeout(window.scrollTime2);
                window.scrollTime2 = window.setTimeout(() => {
                    if(document.body.scrollTop > 56){
                        $('#header').addClass('fixed');
                    }else {
                        $('#header').removeClass('fixed');
                    }
                }, 100);
            }
        },
        mounted() {
            window.addEventListener('scroll', this.scrolling);
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.scrolling);
        }
    }
</script>