import axios from '@/libs/api.request';

export const postTagInsert = (formData) => {
    return axios.request({
        url: 'api/backend/tag/insert',
        method: 'post',
        data: formData,
        source: 'server'
    });
};

export const getTagList = () => {
    return axios.request({
        url: 'api/backend/tag/list',
        method: 'get',
        source: 'server'
    });
};

export const getTagClassifyList = () => {
    return axios.request({
        url: 'api/backend/tag/classifyList',
        method: 'get',
        source: 'server'
    });
};

export const getRecoverTag = ({ tag_name }) => {
    return axios.request({
        url: 'api/backend/tag/recover',
        params: {
            tag_name
        },
        method: 'get',
        source: 'server'
    });
};

export const getDeleteTag = ({ tag_name }) => {
    return axios.request({
        url: 'api/backend/tag/delete',
        params: {
            tag_name
        },
        method: 'get',
        source: 'server'
    });
};

export const getDeleteCompletelyTag = ({ tag_name }) => {
    return axios.request({
        url: 'api/backend/tag/deleteCompletely',
        params: {
            tag_name
        },
        method: 'get',
        source: 'server'
    });
};