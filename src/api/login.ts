import axios from 'axios';
import type {RouteRecordNormalized} from 'vue-router';
import {UserState} from '@/store/modules/user/types';
import {buildForm, OpResult} from "@/api/admin/public";
import {apiUrl, userApiUrl} from "@/api/api";
import {clearToken} from "@/utils/auth";

export interface LoginData {
    username: string;
    password: string;
}

export interface LoginRes {
    auth_data: string;
    is_admin: string
}

export function login(params: any) {
    return axios.post<LoginRes>('/api/v1/passport/auth/login', buildForm(params))
}

export function logout() {
    // return axios.post<LoginRes>('/api/user/logout');
    clearToken()
    return undefined
}

export function getUserInfo() {
    return axios.get('/api/v1/user/info');
}

export function GuestCommConfig() {
    return axios.get('/api/v1/guest/comm/config');
}

export function SendEmailVerify(params: any) {
    return axios.post<OpResult>(userApiUrl.sendEmailVerify, buildForm(params));
}

export function AuthForget(params: any) {
    return axios.post<OpResult>(userApiUrl.authForget, buildForm(params));
}


export function AuthRegister(params: any) {
    return axios.post<OpResult>(userApiUrl.authRegister, buildForm(params));
}
export function AuthUnificationRegister(params: any) {
    return axios.post<OpResult>(userApiUrl.authUnificationRegister, buildForm(params));
}

export function getMenuList() {
    return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
