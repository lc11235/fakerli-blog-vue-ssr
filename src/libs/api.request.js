import HttpRequset from '@/libs/axios';
import config from '@/config';
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;

const axios = new HttpRequset(baseUrl);
export default axios;