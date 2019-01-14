import axios from '@/libs/api.request';

export const postTagInsert = (formData) => {
    return axios.request({
        url: 'api/backend/tag/insert',
        method: 'post',
        data: formData,
        source: 'server'
    });
};