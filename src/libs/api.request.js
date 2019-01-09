import HttpRequset from '@/libs/axios';
import config from '@/config';
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;
const timeout = config.timeout;

const axios = new HttpRequset(baseUrl, timeout);
export default axios;