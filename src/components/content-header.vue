<template>
    <header class="content-header">
        <div class="container fade-scale in">
            <h1 class="title">{{title}}</h1>
            <h5 class="subtitle">Web技术分享</h5>
        </div>
    </header>
</template>

<script lang="babel">
    export default {
        name: 'content-header',
        props: ["title"]
    }
</script>