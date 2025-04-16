import { DEFAULT_LAYOUT } from "../../base";
import { AppRouteRecordRaw } from "../../types";

const DASHBOARD: AppRouteRecordRaw = {
  path: "/myuser",
  name: "user",
  component: DEFAULT_LAYOUT,
  meta: {
    locale: "menu.user",
    requiresAuth: true,
    icon: "icon-dashboard",
    order: 4
  },
  children: [
    {
      path: "/center",
      name: "center",
      component: () => import("@/views/user/user/center/index.vue"),
      meta: {
        locale: "menu.user.center",
        requiresAuth: true,
        roles: ["*"]
      }
    },
    {
      path: "/ticket",
      name: "ticket",
      component: () => import("@/views/user/user/ticket/index.vue"),
      meta: {
        locale: "menu.user.ticket",
        requiresAuth: true,
        roles: ["*"]
      }
    },
    {
      path: "/traffic",
      name: "traffic",
      component: () => import("@/views/user/user/traffic/index.vue"),
      meta: {
        locale: "menu.user.traffic",
        requiresAuth: true,
        roles: ["*"]
      }
    }
  ]
};

export default DASHBOARD;
