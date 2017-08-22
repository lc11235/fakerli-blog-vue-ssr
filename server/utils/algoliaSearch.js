const algoliasearch = require('algoliasearch');

const client = algoliasearch("8RJ1CFIKV0", "704359425e7c16b4db6acbcd2faba6ad");
const indexTag = client.initIndex("fakerli_tag"),
      indexArtcile = client.initIndex("fakerli_article");

const idToObjectID = (json) => {
    let tempJson = JSON.stringify(json);
    tempJson = tempJson.replace('_id', 'objectID');
    return JSON.parse(tempJson);
}

/**
 * 添加tag的资料，用singleFlag来标识是添加一笔还是多笔资料
 * @method
 * @param  {[type]} tagJSON     [description]
 * @param  {[type]} singleFlag  [description]
 * @return {[type]}             [description]
 */
exports.addTag = (tagJSON, singleFlag) => {
    // 注意到此处，将json资料中的一个key:_id更换为objectID。
    // 这是algolia的特殊要求，每个资料都要有唯一标识符
    tagJSON = idToObjectID(tagJSON);
    if(singleFlag){
        indexTag.addObject(tagJSON, (err, content) => {
            if(err){
                console.log(err);
            }
        });
    } else {
        indexTag.addObjects(tagJSON, (err, content) => {
            if(err){
                console.log(err);
            }
        });
    }
};

/**
 * 更新tag的资料，用singleFlag来标识是更新一笔还是多笔资料
 * 此处的更新是全量替换
 * @method
 * @param  {[type]} tagJSON     [description]
 * @param  {[type]} singleFlag  [description]
 * @return {[type]}             [description]
 */
exports.updateTag = (tagJSON, singleFlag) => {
    tagJSON = idToObjectID(tagJSON);
    if(singleFlag){
        indexTag.saveObject(tagJSON, (err, content) => {
            indexTag.waitTask(content.taskID, function(err) {
                if (!err) {
                  console.log('object ' + content.objectID + ' indexed');
                }
            });
        });
    } else {
        indexTag.saveObjects(tagJSON, (err, content) => {
            if(err){
                console.log(err);
            }
        })
    }
};

/**
 * 更新tag的资料，用singleFlag来标识是更新一笔还是多笔资料
 * 此处的更新是部分替换
 * 部分替换的JSON格式参考下面的地址所述
 * https://www.algolia.com/doc/api-client/javascript/indexing/#partial-update-objects
 * @method
 * @param  {[type]} tagJSON     [description]
 * @param  {[type]} singleFlag  [description]
 * @return {[type]}             [description]
 */

exports.partialUpdateTag = (tagJSON, singleFlag) => {
    tagJSON = idToObjectID(tagJSON);
    if(singleFlag){
        indexTag.partialUpdateObject(tagJSON, (err, content) => {
            if(err){
                console.log(err);
            }
        });
    } else {
        indexTag.partialUpdateObjects(tagJSON, (err, content) => {
            if(err){
                console.log(err);
            }
        })
    }
};

/**
 * 删除tag的资料，用singleFlag来标识是更新一笔还是多笔资料
 * 依照之前定好的objectID来删除
 * @method
 * @param  {[type]} tagJSON     [description]
 * @param  {[type]} singleFlag  [description]
 * @return {[type]}             [description]
 */
exports.deleteTag = (objectID, singleFlag) => {
    if(singleFlag){
        indexTag.deleteObject(objectID, (err, content) => {
            if(err){
                console.log(err);
            }
        });
    } else {
        indexTag.deleteObjects(objectID, (err, content) => {
            if(err){
                console.log(err);
            }
        });
    }
}

/**
 * 删除tag的资料，通过查询来删除，algolia会删除所有符合查询条件的资料
 * 因此需要小心使用
 * @method
 * @param  {[type]} query     [description]
 * @return {[type]}             [description]
 */
exports.deleteTag = (query) => {
    indexTag.deleteByQuery(query, (err, content) => {
        if(err){
            console.log(err);
        }
    });
}

exports.addArticle = (articleJSON, singleFlag) => {
    articleJSON = idToObjectID(articleJSON);
    if(singleFlag){
        indexArtcile.addObject(articleJSON, (err, content) => {
            if(err) console.log(err);
            console.log(content);
            indexArtcile.waitTask(content.taskID, function(err) {
                if (!err) {
                  console.log('object ' + content.objectID + ' indexed');
                } else {
                    console.log(err);
                }
            });
        });
    } else {
        indexArtcile.addObjects(articleJSON, (err, content) => {
            if(err){
                console.log(err);
            }
        });
    }
};
