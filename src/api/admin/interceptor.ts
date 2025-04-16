import type {AxiosRequestConfig, AxiosResponse} from 'axios';
import axios from 'axios';
import {Message} from '@arco-design/web-vue';
import {clearToken, getToken} from '@/utils/auth';
import router from "@/views/admin/server/router/index.vue";
import {useRoute} from "vue-router";

export interface HttpResponse<T = unknown> {
    status: number;
    msg: string;
    code: number;
    data: T;
    total: number;
}

if (import.meta.env.VITE_API_BASE_URL) {
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}



axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // let each request carry token
        // this example using the JWT token
        // Authorization is a custom headers key
        // please modify it according to the actual situation
        const token = getToken();
        if (token) {
            if (!config.headers) {
                config.headers = {};
            }
            config.headers.Authorization =token;
        }
        return config;
    },
    (error) => {
        // do something
        return Promise.reject(error);
    }
);
// add response interceptors
axios.interceptors.response.use(
    (response: AxiosResponse<HttpResponse>) => {
        return response.data;
    },
    (error) => {
        let message = "";
        switch (error.response.status) {
            case 400:
                message = "请求错误(400)";
                
                break;
            case 422:
                message = "请求错误(400)";
                
                break;
            case 401:
                message = "未授权，请重新登录(401)";
                // 这里可以做清空storage并跳转到登录页的操作
                break;
            case 403:
                useRoute().fullPath="/login"
                break;
            case 404:
                message = "请求出错(404)";
                break;
            case 408:
                message = "请求超时(408)";
                break;
            case 500:
                message = "服务器错误(500)";
                break;
            case 501:
                message = "服务未实现(501)";
                break;
            case 502:
                message = "网络错误(502)";
                break;
            case 503:
                message = "服务不可用(503)";
                break;
            case 504:
                message = "网络超时(504)";
                break;
            case 505:
                message = "HTTP版本不受支持(505)";
                break;
            default:
                message = `连接出错(${error.response.status})!`;
        }
        if (error.response.data?.errors) {
            message=""
           const errs =error.response.data.errors
           Object.keys(errs).forEach(key => {
               if (!message.trim()){
                   message += `${errs[key]}`
               }
           })
        }else if  (error.response?.data?.message) {
            message=error.response.data.message
        }else if(error.response.data?.data?.message) {
            message=error.response.data.data.message
        }
        Message.error({
            content:message,
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    }
);
