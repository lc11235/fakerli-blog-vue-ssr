<template>
    <div class="search-results" v-show="show" @click="noShow">
        <div class="search-opacity"></div>
    </div>
</template>

<script lang="babel">
    export default {
        name: 'algolia-search',
        props: ['show'],
        methods: {
            noShow() {
                this.$emit('update:show', false);
            }
        }
    };
</script>