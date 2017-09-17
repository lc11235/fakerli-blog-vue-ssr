<template>
    <div class="search-results">
        <div class="search-opacity" v-show="show"></div>
        <div class="search-modal-wrap" v-show="show" @click="noShow">
            <div class="search-modal">
                <div class="search-modal-content">
                    <a @click="noShowClick" class="search-modal-close" href="javascript:;">
                        <i class="fa fa-times-circle"></i>
                    </a>
                    <div class="search-modal-header">
                        <div class="elastic-search-input-icon">
                            <i class="fa fa-search"></i>
                        </div>
                        <div class="elastic-search-input">
                            <input class="search-input" type="text" placeholder="Search" spellcheck="false">
                            <button @click="showSearch" type="button" class="search-button">搜索</button>
                        </div>
                    </div>
                    <div class="search-modal-body" v-show="searchShow">
                        <div class="search-card-block" v-for="item in search_result" :key="item.title">
                            <div class="search-card-title">
                                <router-link :to="'/article/' + item.title">{{ item.title }}</router-link>
                            </div>
                            <div class="search-card-content" v-html="item.content"></div>
                        </div>
                    </div>
                    <div class="search-modal-footer">
                        <span class="power-by">Powered by</span>
                        <a rel="nofollow" target="_blank" href="https://www.elastic.co/products/elasticsearch" class="elastic-logo">ElasticSearch</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="babel">
    import api from '~api';
    export default {
        name: 'search',
        data() {
            return {
                searchShow: false,
                search_input_string: '',
                old_input: '',
                search_result: [],
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
            async showSearch(event) {
                this.searchShow = true;
                if ($('.search-input').val() !== '') {
                    this.search_input_string = $('.search-input').val();
                    if (this.search_input_string !== this.old_input) {
                        $('ul.results').empty();
                        const { data: { message, code, data }} = await api.get('frontend/search', { search: this.search_input_string });
                        if (code === -200) {
                            console.log(message);
                            return;
                        }
                        if (code === 200) {
                            console.log(data);
                            this.search_result = data;
                        }
                    }
                    this.old_input = this.search_input_string;
                } else {
                    this.searchShow = false;
                }
            }
        }
    };
</script>