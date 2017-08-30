<template>
    <div class="search-results" >
        <div class="search-opacity" v-show="show" @click="noShow"></div>
        <div class="search-modal-wrap" v-show="show" @click="noShow"></div>
    </div>
</template>

<script lang="babel">
    export default {
        name: 'algolia-search',
        props: ['show'],
        methods: {
            noShow() {
                this.$emit('update:show', false);
                $('body').removeAttr('style');
            }
        }
    };
</script>