<template>
    <header class="top-header" id="header">
        <div class="flex-row">
            <a @click="visible" href="javascript:;" aria-label="bar" class="header-icon">
                <i class="fa fa-lg fa-bars"></i>
            </a>
            <div class="flex-col header-title ellipsis">{{title}}</div>
            <div class="search-wrap" id="search-wrap">
                <a href="javascript:;" class="header-icon" id="back">
                    <i class="fa fa-lg fa-chevron-left"></i>
                </a>
                <a @click="searchVisible" href="javascript:;" aria-label="search" class="header-icon" id="search">
                    <i class="fa fa-lg fa-search"></i>
                </a>
            </div>
            <a href="javascript:;" class="header-icon" aria-label="share">
                <i class="fa fa-lg fa-share-alt"></i>
            </a>
        </div>
    </header>
</template>

<script lang="babel">
    export default {
        name: 'top-header',
        props: ['title', 'show'],
        methods: {
            visible() {
                $('#menu').removeClass('hide');
            },
            searchVisible() {
                this.$emit('update:show', true);
                $('body').css({ 'padding-right': '8px', 'overflow': 'hidden' });
            },
            scrolling() {
                if (window.scrollTime2) window.clearTimeout(window.scrollTime2);
                window.scrollTime2 = window.setTimeout(() => {
                    // 修复chrome61的bug，在这个版本中，document.body.scrollTop没有值，一直返回0
                    let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                    if (scrollTop > 0) {
                        $('.top-header').css('background-color', '#3f51b5');
                    } else {
                        $('.top-header').css('background-color', 'transparent');
                    }
                    if (scrollTop > 56) {
                        $('#header').addClass('fixed');
                    } else {
                        $('#header').removeClass('fixed');
                    }
                    if (scrollTop >= 200) {
                        $('#post-toc').addClass('fixed');
                    } else {
                        $('#post-toc').removeClass('fixed');
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
    };
</script>