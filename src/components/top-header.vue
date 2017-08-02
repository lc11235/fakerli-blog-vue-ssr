<template>
    <header class="top-header" id="header">
        <div class="flex-row">
            <a @click="visible" href="javascript:;" class="header-icon">
                <i class="icon icon-nav-home"></i>
            </a>
            <div class="flex-col header-title ellipsis">fakerli's blog</div>
        </div>
    </header>
</template>

<script lang="babel">
    export default {
        name: 'top-header',
        methods: {
            visible() {
                $('#menu').removeClass('hide');
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