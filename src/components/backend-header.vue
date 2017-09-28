<template>
    <div class="back-header">
        <logout />
    </div>
</template>

<script lang="babel">
    import logout from './logout.vue';
    export default {
        name: 'backendHeader',
        components: {
            logout
        }
    };
</script>