import axios from 'axios';
import store from '@/store';
import qs from 'qs';
// import { Spin } from 'iview'


const addErrorLog = errorInfo => {
    const { statusText, status, request: { responseURL }} = errorInfo;
    let info = {
        type: 'ajax',
        code: status,
        mes: statusText,
        url: responseURL
    };
    if (!responseURL.includes('save_error_logger')) {
        store.dispatch('addErrorLog', info);
    }
};

const checkStatus = res => {
    store.dispatch('global/gProgress', 100);
    if (res.status === 200 || res.status === 304) {
        return res;
    }
    return {
        data: {
            code: -404,
            message: res.statusText,
            data: ''
        }
    };
};

const checkCode = res => {
    if (res.data.code === -500) {
        window.location.href = '/backend/';
    } else if (res.data.code === -400) {
        window.location.href = '/';
    } else if (res.data.code !== -200 && res.data.code !== 200) {
        store.dispatch('global/showMsg', res.data.message);
    }
    return res;
};

class HttpRequest {
    constructor(baseUrl, timeout) {
        this.baseUrl = baseUrl;
        this.timeout = timeout;
        this.queue = {};
    }
    getInsideConfig(methodType, source) {
        const getHeaders = {
            'X-Requested-With': 'XMLHttpRequest'
        };
        const postHeaders = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        // const cookie = parseCookie(cookies);

        let headers = methodType === 'get' ? getHeaders : postHeaders;
        // headers = source === 'client' ? headers : Object.assign(headers, cookie);

        const config = {
            baseURL: this.baseUrl,
            timeout: this.timeout,
            headers: headers
        };
        return config;
    }
    destroy(url) {
        delete this.queue(url);
        if (!Object.keys(this.queue).length) {
            // Spin.hide()
        }
    }
    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {
            // 添加全局的loading
            if (!Object.keys(this.queue).length) {
                // Spin.show()  // 不建议开启，因为界面不友好
            }
            this.queue[url] = true;
            store.dispatch('global/gProgress', 50);
            if (config.method === 'post') {
                config.data = qs.stringify(config.data);
            }
            return config;
        }, error => {
            return Promise.reject(error);
        });
        // 响应拦截
        instance.interceptors.response.use(res => {
            // this.destroy(url);
            const { data, status } = res;
            return { data, status };
        }, error => {
            this.destroy(url);
            let errorInfo = error.response;
            if (!errorInfo) {
                const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error));
                errorInfo = {
                    statusText,
                    status,
                    request: { responseURL: config.url }
                };
            }
            addErrorLog(errorInfo);
            return Promise.reject(error);
        });
    }
    request(options) {
        const instance = axios.create();
        if (options.source === 'client') {
            options = Object.assign(this.getInsideConfig(options.method, options.source), options);
            this.interceptors(instance, options.url);
            return instance(options).then(checkStatus).then(checkCode);
        } else {
            options = Object.assign(this.getInsideConfig(options.method, options.source), options);
            this.interceptors(instance, options.url);
            return instance(options);
        }
    }
}

export default HttpRequest;