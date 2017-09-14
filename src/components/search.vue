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
                            $('ul.results').empty();
                            const { data: { message, code, data }} = await api.get('frontend/search', { search: _this.search_input_string });
                            if (code === -200) {
                                console.log(message);
                                return;
                            }
                            if (code === 200) {
                                if (data.hits.total === 0) {
                                    return;
                                } else {
                                    console.log(data);
                                    for (let i = 0; i < data.hits.total; i++) {
                                        let title = data.hits.hits[i]._source.title;
                                        let tags = data.hits.hits[i]._source.tags;
                                        let content = '';
                                        let indexStartCount = 0;
                                        let indexEndCount = 0;
                                        let start = 0;
                                        let end = 45;
                                        let stringGole = '';
                                        console.log(data.hits.hits[i].highlight);
                                        // todo: 需要处理查询出来的content，需要精确控制html标签。
                                        if (data.hits.hits[i].highlight) {
                                            content = data.hits.hits[i].highlight.content[0];
                                            indexStartCount = content.indexOf('<b>');
                                            indexEndCount = content.lastIndexOf('</b>');
                                            start = indexStartCount - 5 < 0 ? 0 : indexStartCount - 5;
                                            end = indexEndCount + 45 > content.length ? content.length : indexEndCount + 45;
                                            stringGole = content.substring(start, end);
                                        } else {
                                            content = data.hits.hits[i]._source.content;
                                            stringGole = content.substring(start, end);
                                        }
                                        let customer = '<a href="/article/' + title + '" class="list-group-item">' + tags[0] + ' ' + stringGole + '</a>';
                                        $('ul.results').append(customer);
                                    }
                                }
                            }
                            _this.old_input = _this.search_input_string;
                        }
                    }, 2000);
                } else {
                    this.searchShow = false;
                }
            }
        }
    };
</script>