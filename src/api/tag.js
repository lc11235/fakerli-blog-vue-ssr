import axios from '@/libs/api.request';

export const getTagList = (config) => {
    return axios.request({
        url: 'api/backend/tag/getTagList',
        method: 'get',
        params: config,
        source: 'server'
    });
};

export const getTagClassifyList = () => {
    return axios.request({
        url: 'api/backend/tag/getTagClassifyList',
        method: 'get',
        source: 'server'
    });
};

export const insertTagSingle = (formData) => {
    return axios.request({
        url: 'api/backend/tag/insertTagSingle',
        method: 'post',
        data: formData,
        source: 'server'
    });
};

export const deleteTagSingle = ({ tagId }) => {
    return axios.request({
        url: 'api/backend/tag/deleteTagSingle',
        params: {
            tagId
        },
        method: 'get',
        source: 'server'
    });
};

export const getTagSingle = ({ tagId }) => {
    return axios.request({
        url: 'api/backend/tag/getTagSingle',
        params: {
            tagId
        },
        method: 'get',
        source: 'server'
    });
};

export const recoverTagSingle = ({ tagId }) => {
    return axios.request({
        url: 'api/backend/tag/recoverTagSingle',
        params: {
            tagId
        },
        method: 'get',
        source: 'server'
    });
};

export const deleteCompletelyTagSingle = ({ tagId }) => {
    return axios.request({
        url: 'api/backend/tag/deleteTagCompletelySingle',
        params: {
            tagId
        },
        method: 'get',
        source: 'server'
    });
};