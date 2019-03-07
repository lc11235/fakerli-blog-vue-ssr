import axios from '@/libs/api.request';

export const getArticleList = (config) => {
    return axios.request({
        url: 'api/backend/article/getArticleList',
        method: 'get',
        params: config,
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

export const deleteArticleSingle = (articleId) => {
    return axios.request({
        url: 'api/backend/article/deleteArticleSingle',
        method: 'get',
        params: {
            articleId
        },
        source: 'server'
    });
};

export const recoverArticleSingle = (articleId) => {
    return axios.request({
        url: 'api/backend/article/recoverArticleSingle',
        method: 'get',
        params: {
            articleId
        },
        source: 'server'
    });
};