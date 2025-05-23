import type { RouteRecordNormalized } from 'vue-router';
import { isAdmin } from "@/utils/auth";

// const modules = import.meta.glob('./modules/user/*.ts', { eager: true });
const modulesAdmin = import.meta.glob('./modules/*/*.ts', { eager: true });
const externalModules = import.meta.glob('./externalModules/*.ts', {
    eager: true,
});

function formatModules(_modules: any, result: RouteRecordNormalized[]) {
    Object.keys(_modules).forEach((key) => {
        const defaultModule = _modules[key].default;
        if (!defaultModule) return;
        const moduleList = Array.isArray(defaultModule)
            ? [...defaultModule]
            : [defaultModule];
        const arrayObj: any[] = [];
        // @ts-ignore
        arrayObj.push(...moduleList)
        result.push(...moduleList);
    });
    return result;
}

function getModules() {
    if (isAdmin()) {
        return modulesAdmin
    }
    return modules
}

export const appRoutes: RouteRecordNormalized[] = formatModules(getModules(), []);

export const appExternalRoutes: RouteRecordNormalized[] = formatModules(
    externalModules,
    []
);
