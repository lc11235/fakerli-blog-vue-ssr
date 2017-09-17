exports.filterSearchResult = (result, keyword) => {
    let value = {};
    let title = '';
    let content = '';
    let article = [];
    if (result.hits.total === 0) {
        value.result = false;
        return value;
    }
    for (let i = 0; i < result.hits.hits.length; i++) {
        title = result.hits.hits[i]._source.title;
        content = result.hits.hits[i]._source.content;
        content = content.replace(/<\/?.+?>/g, '');
        // content = content.replace(/\n/g, ' ');
        console.log(content);
        let indexStartCount = content.indexOf(keyword);
        let indexEndCount = indexStartCount + keyword.length;
        let start = indexStartCount - 10 < 0 ? 0 : indexStartCount - 10;
        let end = indexEndCount + 45 > content.length ? content.length : indexEndCount + 45;
        content = content.substring(start, end);
        let item = {
            title: title,
            content: content
        };
        article.push(item);
    }
    value.result = true;
    value.article = article;
    return value;
};