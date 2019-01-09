import axios from '@/libs/api.request';

export const login = ({ username, password }) => {
    const data = {
        username,
        password
    };
    return axios.request({
        url: 'api/backend/admin/login',
        data,
        method: 'post',
        source: 'server'
    });
};

export const getUserInfo = () => {
    return axios.request({
        url: 'api/backend/admin/get_info',
        method: 'get',
        source: 'server'
    });
};

export const logout = () => {
    return axios.request({
        url: 'api/backend/admin/logout',
        method: 'post',
        source: 'server'
    });
};

export const getUnreadCount = () => {
    return axios.request({
        url: 'api/backend/message/count',
        method: 'get',
        source: 'server'
    });
};

export const getMessage = () => {
    return axios.request({
        url: 'api/backend/message/init',
        method: 'get',
        source: 'server'
    });
};

export const getContentByMsgId = msg_id => {
    return axios.request({
        url: 'api/backend/message/content',
        method: 'get',
        params: {
            msg_id
        },
        source: 'server'
    });
};

export const hasRead = msg_id => {
    return axios.request({
        url: 'api/backend/message/has_read',
        method: 'post',
        data: {
            msg_id
        },
        source: 'server'
    });
};

export const removeReaded = msg_id => {
    return axios.request({
        url: 'api/backend/message/remove_readed',
        method: 'post',
        data: {
            msg_id
        },
        source: 'server'
    });
};

export const restoreTrash = msg_id => {
    return axios.request({
        url: 'api/backend/message/restore',
        method: 'post',
        data: {
            msg_id
        },
        source: 'server'
    });
};
