<template>
    <div class="search-results" >
        <div class="search-opacity" v-show="show"></div>
        <div class="search-modal-wrap" v-show="show" @click="noShow">
            <div class="search-modal">
                <div class="search-modal-content">
                    <a @click="noShowClick" class="search-modal-close" href="javascript:;">
                        <i class="fa fa-lg fa-remove"></i>
                    </a>
                    <div class="search-modal-header">
                        <input @input="showSearch" class="search-input" type="text" placeholder="Search">
                    </div>
                    <div class="search-modal-body" v-show="searchShow">
                        <div class="search-card-title"></div>
                        <div class="search-card-block"></div>
                    </div>
                    <div class="search-modal-footer">
                        <span class="power-by">Powered by</span>
                        <img src="/static/images/Algolia_logo_bg-white.svg" class="algolia-logo">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="babel">
    export default {
        name: 'algolia-search',
        data() {
            return {
                searchShow: false,
                search_input_string: ''
            };
        },
        props: ['show'],
        methods: {
            noShow(event) {
                if (event.target.getAttribute('class') === 'search-modal-wrap' || event.target.getAttribute('class') === 'search-modal') {
                    this.$emit('update:show', false);
                    $('body').removeAttr('style');
                } else {
                    event.stopPropagation();
                }
            },
            noShowClick() {
                this.$emit('update:show', false);
                $('body').removeAttr('style');
            },
            showSearch(event) {
                let client = algoliasearch('8RJ1CFIKV0', 'c1071e95978a460f2e7df4dfe9b65488');
                let article_index = client.initIndex('fakerli_article');
                this.searchShow = true;
                if ($(event.target).val() !== '') {
                    this.search_input_string = $(event.target).val();
                } else {
                    this.searchShow = false;
                }
            }
        }
    };
</script>