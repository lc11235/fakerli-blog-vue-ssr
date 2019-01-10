import axios from '@/libs/api.request';

export const getTableData = () => {
    return axios.request({
        url: 'api/backend/data/get_table_data',
        method: 'get'
    });
};

export const getDragList = () => {
    return axios.request({
        url: 'api/backend/data/get_drag_list',
        method: 'get'
    });
};

export const errorReq = () => {
    return axios.request({
        url: 'api/backend/data/error_url',
        method: 'post'
    });
};

export const saveErrorLogger = info => {
    return axios.request({
        url: 'api/backend/data/save_error_logger',
        data: info,
        method: 'post'
    });
};

export const uploadImg = formData => {
    return axios.request({
        url: 'api/backend/data/image/upload',
        data: formData
    });
};

export const getOrgData = () => {
    return axios.request({
        url: 'api/backend/data/get_org_data',
        method: 'get'
    });
};
