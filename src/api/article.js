import axios from '@/libs/api.request';

export const getArticleList = () => {
    return axios.request({
        url: 'api/backend/article/list',
        method: 'get',
        source: 'server'
    });
};