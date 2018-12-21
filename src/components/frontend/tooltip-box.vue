<template>
    <div class="tooltip-box">
        {{content}}
    </div>
</template>

<script lang="babel">
    export default {
        name: 'tooltip-box',
        props: ['content']
    };
</script>