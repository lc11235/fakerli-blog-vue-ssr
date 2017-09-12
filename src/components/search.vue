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
                        <div class="algolia-search-input-icon">
                            <i class="fa fa-search"></i>
                        </div>
                        <div class="algolia-search-input">
                            <input @input="showSearch" class="search-input" type="text" placeholder="Search" spellcheck="false">
                        </div>
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
    import api from '~api';
    export default {
        name: 'search',
        data() {
            return {
                searchShow: false,
                search_input_string: '',
                old_input: '',
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
                    setTimeout(async function () {
                        if (_this.search_input_string !== _this.old_input) {
                            if (_this.search_input_string !== _this.old_input) {
                                $('ul.results').empty();
                                const { data: { message, code, data }} = await api.get('frontend/search', _this.search_input_string);
                                if (code === -200) {
                                    console.log(message);
                                    return;
                                }
                                if (code === 200) {
                                    console.log(data);
                                }
                                _this.old_input = _this.search_input_string;
                            }
                        }
                    }, 2000);
                } else {
                    this.searchShow = false;
                }
            }
        }
    };
</script>