<template>
    <div class="back-header">
        <logout />
    </div>
</template>

<script lang="babel">
    import logout from '~components/backend/log-out.vue';
    export default {
        name: 'backendHeader',
        components: {
            logout
        }
    };
</script>