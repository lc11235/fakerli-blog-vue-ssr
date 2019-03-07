const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const backendArticle = require('../api/backend-article');
const backendTag = require('../api/backend-tag');
const backendUser = require('../api/backend-user');
const backendMessage = require('../api/backend-message');
const backendData = require('../api/backend-data');
const frontendArticle = require('../api/frontend-article');
const frontendArchive = require('../api/frontend-archive');
const frontendSearch = require('../api/frontend-search');
const isAdmin = require('./is-admin');

// API
// ================ 后台 ================
// ------- 文章 -------
// 管理时, 获取文章列表
router.get('/backend/article/list', isAdmin, backendArticle.getList);
// 管理时，获取单篇文章
router.get('/backend/article/item', isAdmin, backendArticle.getItem);
// 管理时，发布文章
router.post('/backend/article/insert', isAdmin, multipartMiddleware, backendArticle.insert);
// 管理时，删除文章
router.get('/backend/article/delete', isAdmin, backendArticle.deletes);
// 管理时，彻底删除文章
router.get('/backend/article/deleteCompletely', isAdmin, backendArticle.deleteCompletely);
// 管理时，恢复文章
router.get('/backend/article/recover', isAdmin, backendArticle.recover);
// 管理时，编辑文章
router.post('/backend/article/modify', isAdmin, multipartMiddleware, backendArticle.modify);
// 管理时，上传md文件
router.post('/backend/article/upload', isAdmin, backendArticle.upload);

// ------- 标签 -------
// 管理时, 获取普通标签列表
router.get('/backend/tag/getTagList', isAdmin, backendTag.getTagList);

// 管理时, 插入单个普通标签
router.post('/backend/tag/insertTagSingle', isAdmin, multipartMiddleware, backendTag.insertTagSingle);

// 管理时, 删除单个普通标签
router.get('/backend/tag/deleteTagSingle', isAdmin, backendTag.deleteTagSingle);

// 管理时, 修改单个普通标签
router.post('/backend/tag/modifyTagSingle', isAdmin, multipartMiddleware, backendTag.modifyTagSingle);

// 管理时, 查询单个普通标签
router.get('/backend/tag/getTagSingle', isAdmin, backendTag.getTagSingle);

// 管理时, 恢复单个普通标签
router.get('/backend/tag/recoverTagSingle', isAdmin, backendTag.recover);

// 管理时，彻底删除单个普通标签
router.get('/backend/tag/deleteTagCompletelySingle', isAdmin, backendTag.deleteTagCompletelySingle);

// -----------------------------------------
// 管理时, 获取特征标签列表
router.get('/backend/tag/getTagClassifyList', isAdmin, backendTag.getClassifyList);

// 管理时, 插入单个特征标签
router.post('/backend/tag/insertClassifyTagSingle', isAdmin, multipartMiddleware, backendTag.insertClassifyTagSingle);

// 管理时, 删除单个特征标签
router.get('/backend/tag/deleteClassifyTagSingle', isAdmin, backendTag.deleteClassifyTagSingle);

// 管理时, 修改单个特征标签
router.post('/backend/tag/modifyClassifyTagSingle', isAdmin, multipartMiddleware, backendTag.modifyClassifyTagSingle);

// 管理时, 查询单个特征标签
router.get('/backend/tag/getClassifyTagSingle', isAdmin, backendTag.getClassifyTagSingle);

// 管理时, 恢复单个特征标签
router.get('/backend/tag/recoverClassifyTagSingle', isAdmin, backendTag.recoverClassifyTagSingle);

// 管理时，彻底删除单个特征标签
router.get('/backend/tag/deleteClassifyTagCompletelySingle', isAdmin, backendTag.deleteClassifyTagCompletelySingle);

// ------- 管理 -------
// 后台注册
router.post('/backend/admin/register', multipartMiddleware, backendUser.insert);
// 后台登录
router.post('/backend/admin/login', multipartMiddleware, backendUser.login);
// 后台登出
router.post('/backend/admin/logout', isAdmin, backendUser.logout);
// 取得用户信息
router.get('/backend/admin/get_info', isAdmin, backendUser.getInfo);
// 管理列表
router.get('/backend/admin/list', isAdmin, backendUser.getList);
// 获取单个管理员
router.get('/backend/admin/item', isAdmin, backendUser.getItem);
// 编辑管理员
router.post('/backend/admin/modify', isAdmin, multipartMiddleware, backendUser.modify);
// 删除管理员
router.get('/backend/admin/delete', isAdmin, backendUser.deletes);
// 恢复管理员
router.get('/backend/admin/recover', isAdmin, backendUser.recover);

// ------- 消息 -------

// 取得未读消息条数
router.get('/backend/message/count', isAdmin, backendMessage.getUnreadMessageCount);
// 取得已读，未读，回收站的消息
router.get('/backend/message/init', isAdmin, backendMessage.getAllMessage);

// 取得拖拽列表
router.get('/backend/data/get_drag_list', isAdmin, backendData.getDragList);

// ================= 前台 =================
// ------ 文章 ------
// 前台浏览时, 获取文章列表
router.get('/frontend/article/list', frontendArticle.getList);
// 前台浏览时, 获取单篇文章
router.get('/frontend/article/item', frontendArticle.getItem);

// ------ 归档 ------
// 归档列表
router.get('/frontend/archive/listTitle', frontendArchive.getListTitle);

// ======= 搜索 =========
// 前台搜索
router.get('/frontend/search', frontendSearch.search);

// ------ 404 ------
router.get('*', (req, res) => {
    res.json({
        code: -200,
        message: '没有找到该页面'
    });
});

module.exports = router;