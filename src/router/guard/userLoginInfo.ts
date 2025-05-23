import type { LocationQueryRaw, Router } from "vue-router";
import NProgress from "nprogress"; // progress bar
import { useUserStore } from "@/store";
import { isLogin } from "@/utils/auth";
import { adminUrl } from "@/utils/admin-url";

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (isLogin()) {
      try {
         if (to.path === `/${adminUrl}/`||to.path === `/${adminUrl}`){
          router.push(`/${adminUrl}/dashboard`);
        } else {
          await userStore.info();
          next();
        }
      } catch (error) {
        await userStore.logout();
        next({
          name: "login",
          query: {
            redirect: to.name,
            ...to.query
          } as LocationQueryRaw
        });
      }
    } else {
      if (to.name === "login") {
        next();
        return;
      }
      if (to.name === "register") {
        next();
        return;
      }
      if (to.name === "forgetPassword") {
        next();
        return;
      }
      next({
        name: "login",
        query: {
          redirect: to.name,
          ...to.query
        } as LocationQueryRaw
      });
    }
  });
}

