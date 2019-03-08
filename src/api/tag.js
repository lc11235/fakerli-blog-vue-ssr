import axios from '@/libs/api.request';

// ---------------普通标签的请求--------------------
export const getTagList = (config) => {
    return axios.request({
        url: 'api/backend/tag/getTagList',
        method: 'get',
        params: config,
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

export const modifyTagSingle = (formData) => {
    return axios.request({
        url: 'api/backend/tag/modifyTagSingle',
        data: formData,
        method: 'post',
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

export const deleteTagCompletelySingle = ({ tagId }) => {
    return axios.request({
        url: 'api/backend/tag/deleteTagCompletelySingle',
        params: {
            tagId
        },
        method: 'get',
        source: 'server'
    });
};

// ---------------特征标签的请求--------------------
export const getClassifyTagList = (config) => {
    return axios.request({
        url: 'api/backend/tag/getClassifyTagList',
        params: config,
        method: 'get',
        source: 'server'
    });
};

export const insertClassifyTagSingle = (formdata) => {
    return axios.request({
        url: 'api/backend/tag/insertClassifyTagSingle',
        data: formdata,
        method: 'post',
        source: 'server'
    });
};

export const deleteClassifyTagSingle = ({ tagId }) => {
    return axios.request({
        url: 'api/backend/tag/deleteClassifyTagSingle',
        params: {
            tagId
        },
        method: 'get',
        source: 'server'
    });
};

export const modifyClassifyTagSingle = (formdata) => {
    return axios.request({
        url: 'api/backend/tag/modifyClassifyTagSingle',
        data: formdata,
        method: 'post',
        source: 'server'
    });
};

export const getClassifyTagSingle = ({ tagId }) => {
    return axios.request({
        url: 'api/backend/tag/getClassifyTagSingle',
        params: {
            tagId
        },
        method: 'get',
        source: 'server'
    });
};

export const recoverClassifyTagSingle = ({ tagId }) => {
    return axios.request({
        url: 'api/backend/tag/recoverClassifyTagSingle',
        params: {
            tagId
        },
        method: 'get',
        source: 'server'
    });
};

export const deleteClassifyTagCompletelySingle = ({ tagId }) => {
    return axios.request({
        url: 'api/backend/tag/deleteClassifyTagCompletelySingle',
        params: {
            tagId
        },
        method: 'get',
        source: 'server'
    });
};