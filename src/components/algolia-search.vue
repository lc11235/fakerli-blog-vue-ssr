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
                        <div class="search-card-block">
                            <ul class="results"></ul>
                        </div>
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
    import algolia from 'algoliasearch';
    export default {
        name: 'algolia-search',
        data() {
            return {
                searchShow: false,
                search_input_string: '',
                old_input: '',
                article_index: {}
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
                this.searchShow = true;
                if ($(event.target).val() !== '') {
                    this.search_input_string = $(event.target).val();
                    let _this = this;
                    setTimeout(function () {
                        if (_this.search_input_string !== _this.old_input) {
                            if (_this.search_input_string !== _this.old_input) {
                                $('ul.results').empty();
                                _this.article_index.search(_this.search_input_string, (err, articles) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                    for (let i = 0; i < articles.hits.length; i++) {
                                        let indexCount = articles.hits[i].content.indexOf(_this.search_input_string);
                                        let start = indexCount - 10 < 0 ? 0 : indexCount - 10;
                                        let end = indexCount + 10 > articles.hits[i].content.length ? articles.hits[i].content.length : indexCount + 10;
                                        let content = articles.hits[i].content.substring(start, end);
                                        let customer = '<a href="/article/' + articles.hits[i].title + '" class="list-group-item">' +
                                        articles.hits[i].tags[0] + ' ' + content + '</a>';
                                        $('ul.results').append(customer);
                                    }
                                });
                                _this.old_input = _this.search_input_string;
                            }
                        }
                    }, 2000);
                } else {
                    this.searchShow = false;
                }
            }
        },
        mounted() {
            let client = algolia('8RJ1CFIKV0', 'c1071e95978a460f2e7df4dfe9b65488');
            this.article_index = client.initIndex('fakerli_article');
        }
    };
</script>