import {defineStore} from 'pinia';
import {getUserInfo, login as userLogin, logout as userLogout,} from '@/api/login';
import {clearToken, setRole, setToken} from '@/utils/auth';
import {removeRouteListener} from '@/utils/route-listener';
import {UserState} from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
    state: (): UserState => ({
        name: undefined,
        avatar: undefined,
        job: undefined,
        organization: undefined,
        location: undefined,
        email: undefined,
        introduction: undefined,
        personalWebsite: undefined,
        jobName: undefined,
        organizationName: undefined,
        locationName: undefined,
        phone: undefined,
        registrationDate: undefined,
        accountId: undefined,
        certification: undefined,
        role: '',
    }),

    getters: {
        userInfo(state: UserState): UserState {
            return {...state};
        },
    },

    actions: {
        switchRoles() {
            return new Promise((resolve) => {
                this.role = this.role === 'user' ? 'admin' : 'user';
                resolve(this.role);
            });
        },
        // Set user's information
        setInfo(partial: Partial<UserState>) {
            this.$patch(partial);
        },

        // Reset user's information
        resetInfo() {
            this.$reset();
        },
        // Get user's information
        async info() {
            const {data} = await getUserInfo();
            const userState: UserState = {
                role: "",
                name: data?.email,
                email: data?.email,
                avatar: data?.avatar_url,
                app_description: data?.app_description
            }
            this.setInfo(userState);
        },

        // Login
        async login(params: any) {
            try {
                const {data} = await userLogin(params);
                setToken(data.auth_data);
                setRole(data.is_admin);
            } catch (err) {
                clearToken();
                throw err;
            }
        },
        logoutCallBack() {
            const appStore = useAppStore();
            this.resetInfo();
            clearToken();
            removeRouteListener();
            appStore.clearServerMenu();
        },
        // Logout
        async logout() {
            try {
                await userLogout();
            } finally {
                this.logoutCallBack();
            }
        },
    },
});

export default useUserStore;
