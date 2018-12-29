<template>
    <a @click="handleBackTop" aria-label="backTop" href="javascript:;" :class="{in: scrollTop > 300}" class="back-top">
        <span class="fa fa-chevron-up"></span>
    </a>
</template>

<script lang="babel">
    export default {
        data() {
            return {
                scrollTop: 0
            };
        },
        methods: {
            scrolling() {
                if (window.scrollTime) window.clearTimeout(window.scrollTime);
                window.scrollTime = window.setTimeout(() => {
                    // 修复chrome61的bug，在这个版本中，document.body.scrollTop没有值，一直返回0
                    this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                }, 100);
            },
            handleBackTop() {
                let top = this.scrollTop;
                this.scrollTop = 0;
                let index = 30;
                let i = 1;
                let timer = setInterval(() => {
                    top -= 100 + index * (i++);
                    if (top <= 1) {
                        top = 0;
                        clearInterval(timer);
                    }
                    if (document.body.scrollTop) {
                        document.body.scrollTop = top;
                    } else {
                        document.documentElement.scrollTop = top;
                    }
                }, 20);
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