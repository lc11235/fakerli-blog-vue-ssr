<template>
    <div class="back-page-header">
        <ul class="back-page-ul">
            <li>
                <a href="javascript:;">首页</a>
            </li>
            <li>></li>
            <li>{{ pageTitle }}</li>
        </ul>
    </div>
</template>

<script lang="babel">
    export default {
        name: 'backendPageHeader',
        props: ['pageTitle']
    };
</script>