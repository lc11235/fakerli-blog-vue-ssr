const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const backendArticle = require('../api/backend-article');
const backendTag = require('../api/backend-tag');
const backendUser = require('../api/backend-user');
const frontendArticle = require('../api/frontend-article');
const frontendArchive = require('../api/frontend-archive');
const frontendSearch = require('../api/frontend-search');
const isAdmin = require('./is-admin');

// 添加管理员
router.get('/register', (req, res) => {
    res.render('admin-add.html', { title: '添加管理员', message: '' });
});
router.post('/register', (req, res) => {
    backendUser.insert(req, res);
});

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
// 管理时, 获取标签列表
router.get('/backend/tag/list', backendTag.getList);
// 管理时, 获取单个标签
router.get('/backend/tag/item', backendTag.getItem);
// 管理时, 添加标签
router.post('/backend/tag/insert', multipartMiddleware, isAdmin, backendTag.insert);
// 管理时, 删除标签
router.get('/backend/tag/delete', isAdmin, backendTag.deletes);
// 管理时，彻底删除标签
router.get('/backend/tag/deleteCompletely', isAdmin, backendTag.deleteCompletely);
// 管理时, 恢复标签
router.get('/backend/tag/recover', isAdmin, backendTag.recover);
// 管理时, 编辑标签
router.post('/backend/tag/modify', isAdmin, multipartMiddleware, backendTag.modify);

// ------- 管理 -------
// 后台登录
router.post('/backend/admin/login', multipartMiddleware, backendUser.login);
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