const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const backendArticle = require('../api/backend-article');
const backendTag = require('../api/backend-tag');
const backendUser = require('../api/backend-user');
const backendMessage = require('../api/backend-message');
const backendData = require('../api/backend-data');
const backendLog = require('../api/backend-log');
const frontendArticle = require('../api/frontend-article');
const frontendArchive = require('../api/frontend-archive');
const frontendSearch = require('../api/frontend-search');
const isAdmin = require('./is-admin');

// ================ 后台 ================
// ------- 文章 -------
// 管理时, 获取文章列表
router.get('/backend/article/getArticleList', isAdmin, backendArticle.getArticleList);

// 管理时，获取单篇文章
router.get('/backend/article/getArticleSingle', isAdmin, backendArticle.getArticleSingle);

// 管理时，发布文章
router.post('/backend/article/insertArticleSingle', isAdmin, multipartMiddleware, backendArticle.insertArticleSingle);

// 管理时，删除文章
router.get('/backend/article/deleteArticleSingle', isAdmin, backendArticle.deleteArticleSingle);

// 管理时，彻底删除文章
router.get('/backend/article/deleteCompletelyArticleSingle', isAdmin, backendArticle.deleteCompletelyArticleSingle);

// 管理时，恢复文章
router.get('/backend/article/recoverArticleSingle', isAdmin, backendArticle.recoverArticleSingle);

// 管理时，编辑文章
router.post('/backend/article/modifyArticleSingle', isAdmin, multipartMiddleware, backendArticle.modifyArticleSingle);

// 管理时，上传md文件
router.post('/backend/article/upload', isAdmin, backendArticle.uploadArticleSingle);


// ------- 普通标签 -------
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
router.get('/backend/tag/recoverTagSingle', isAdmin, backendTag.recoverTagSingle);

// 管理时，彻底删除单个普通标签
router.get('/backend/tag/deleteTagCompletelySingle', isAdmin, backendTag.deleteTagCompletelySingle);


// ------- 特征标签 -------
// 管理时, 获取特征标签列表
router.get('/backend/tag/getClassifyTagList', isAdmin, backendTag.getClassifyTagList);

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


// ------- 注册登出 -------
// 后台注册
router.post('/backend/admin/register', multipartMiddleware, backendUser.register);

// 后台登录
router.post('/backend/admin/login', multipartMiddleware, backendUser.login);

// 后台登出
router.post('/backend/admin/logout', isAdmin, backendUser.logout);

// 取得用户信息
router.get('/backend/admin/get_info', isAdmin, backendUser.getInfo);


// ------- 普通账号 -------
// 获取普通用户账号列表
router.get('/backend/admin/getUserList', isAdmin, backendUser.getUserList);

// 增加单个普通用户账号
router.post('backend/admin/insertUserSingle', isAdmin, multipartMiddleware, backendUser.insertUserSingle);

// 删除单个普通用户账号
router.get('/backend/admin/deleteUserSingle', isAdmin, backendUser.deleteUserSingle);

// 编辑单个普通用户账号
router.post('/backend/admin/modifyUserSingle', isAdmin, multipartMiddleware, backendUser.modifyUserSingle);

// 获取单个普通用户账号
router.get('/backend/admin/getUserSingle', isAdmin, backendUser.getUserSingle);

// 恢复单个普通用户账号
router.get('/backend/admin/recoverUserSingle', isAdmin, backendUser.recoverUserSingle);

// 彻底删除单个普通用户账号
router.get('/backend/admin/deleteUserCompletelySingle', isAdmin, backendUser.deleteUserCompletelySingle);

// 审核单个普通账号
router.get('/backend/admin/comfirmUserSingle', isAdmin, backendUser.confirmUserSingle);

// 提升普通账号权限
router.get('/backend/admin/upgradeUserLevel', isAdmin, backendUser.upgradeUserLevel);

// 取消普通账号的登录
router.get('/backend/admin/logoutUserSingle', isAdmin, backendUser.logoutUserSingle);


// ------- 管理账号 -------
// 获取管理用户账号列表
router.get('/backend/admin/getAdminList', isAdmin, backendUser.getAdminList);

// 增加单个管理用户账号
router.post('backend/admin/insertAdminSingle', isAdmin, multipartMiddleware, backendUser.insertAdminSingle);

// 删除单个管理用户账号
router.get('/backend/admin/deleteAdminSingle', isAdmin, backendUser.deleteAdminSingle);

// 编辑单个管理用户账号
router.post('/backend/admin/modifyAdminSingle', isAdmin, multipartMiddleware, backendUser.modifyAdminSingle);

// 获取单个管理用户账号
router.get('/backend/admin/getAdminSingle', isAdmin, backendUser.getAdminSingle);

// 恢复单个管理用户账号
router.get('/backend/admin/recoverAdminSingle', isAdmin, backendUser.recoverAdminSingle);

// 彻底删除单个管理用户账号
router.get('/backend/admin/deleteAdminCompletelySingle', isAdmin, backendUser.deleteAdminCompletelySingle);

// 降低管理账号权限
router.get('/backend/admin/downgradeAdminLevel', isAdmin, backendUser.downgradeAdminLevel);

// 取消管理账号的登录
router.get('/backend/admin/logoutAdminSingle', isAdmin, backendUser.logoutAdminSingle);


// ------- 日志 -------
// 取得请求日志列表
router.get('/backend/log/getLogReqResList', isAdmin, backendLog.getLogReqResList);


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