<template>
    <div class="back-page-header">
        <ul class="back-page-ul">
            <li> 首页 /</li>
            <li>{{ pageTitle.middle }}</li>
            <li class="back-header-active">{{ pageTitle.end }}</li>
        </ul>
    </div>
</template>

<script lang="babel">
    export default {
        name: 'backendPageHeader',
        props: ['pageTitle']
    };
</script>