<template>
    <a @click="handleBackTop" href="javascript:;" :class="{in: scrollTop > 300}" class="back-top">
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
                    this.scrollTop = document.body.scrollTop;
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
                    document.body.scrollTop = top;
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