import axios from '@/libs/api.request';

export const getArticleList = (config) => {
    return axios.request({
        url: 'api/backend/article/getArticleList',
        method: 'get',
        params: config,
        source: 'server'
    });
};

export const insertArticleSingle = (formData) => {
    return axios.request({
        url: 'api/backend/article/insertArticleSingle',
        method: 'post',
        data: formData,
        source: 'server'
    });
};

export const deleteArticleSingle = (articleId, tagList) => {
    return axios.request({
        url: 'api/backend/article/deleteArticleSingle',
        method: 'get',
        params: {
            articleId,
            tagList
        },
        source: 'server'
    });
};

export const modifyArticleSingle = (formData) => {
    return axios.request({
        url: 'api/backend/article/modifyArticleSingle',
        method: 'post',
        data: formData,
        source: 'server'
    });
};

export const getArticleSingle = (articleId) => {
    return axios.request({
        url: 'api/backend/article/getArticleSingle',
        method: 'get',
        params: {
            articleId
        },
        source: 'server'
    });
};

export const deleteCompletelyArticleSingle = (articleId, tagList) => {
    return axios.request({
        url: 'api/backend/article/deleteCompletelyArticleSingle',
        method: 'get',
        params: {
            articleId,
            tagList
        },
        source: 'server'
    });
};

export const recoverArticleSingle = (articleId, tagList) => {
    return axios.request({
        url: 'api/backend/article/recoverArticleSingle',
        method: 'get',
        params: {
            articleId,
            tagList
        },
        source: 'server'
    });
};