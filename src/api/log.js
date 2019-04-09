import axios from '@/libs/api.request';

export const getLogReqResList = (config) => {
    return axios.request({
        url: 'api/backend/tag/getLogReqResList',
        method: 'get',
        params: config,
        source: 'server'
    });
};