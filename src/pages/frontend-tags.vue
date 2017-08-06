<template>
    <div class="tags">
        <div class="entry-content">
            <section>
                <router-link v-for="(tag, count) in tags" :to="'/tags/' + tag" :key="tag">{{tag + '(' + count +')'}}</router-link>
            </section>
        </div>
    </div>
</template>
