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
                <a @click="searchVisible" href="javascript:;" class="header-icon" id="search">
                    <i class="fa fa-lg fa-search"></i>
                </a>
            </div>
            <a href="javascript:;" class="header-icon">
                <i class="fa fa-lg fa-share-alt"></i>
            </a>
        </div>
        <algolia-search :show.sync="isShow" />
    </header>
</template>

<script lang="babel">
    import algoliaSearch from  './algolia-search.vue';
    export default {
        name: 'top-header',
        data() {
            return {
                isShow: false
            };
        },
        props: ['title'],
        components: {
            algoliaSearch
        },
        methods: {
            visible() {
                $('#menu').removeClass('hide');
            },
            searchVisible() {
                this.isShow = true;
                $('body').css({ 'padding-right': '8px', 'overflow': 'hidden' });
            },
            scrolling() {
                if (window.scrollTime2) window.clearTimeout(window.scrollTime2);
                window.scrollTime2 = window.setTimeout(() => {
                    if (document.body.scrollTop > 56) {
                        $('#header').addClass('fixed');
                    } else {
                        $('#header').removeClass('fixed');
                    }
                    if (document.body.scrollTop >= 200) {
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