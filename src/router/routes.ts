import Layout from "@/layout/index.vue";
import type { RouteRecordRaw } from "vue-router";
import Finance from "@/views/finance/index.vue";
import i18n from "../locales/index";
import { computed } from "vue";
const {
  global: { locale, t }
} = i18n;

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "root",
    component: Layout,
    redirect: { name: "Finance" },
    children: [
      {
        path: "finance",
        name: "Finance",
        component: Finance,
        meta: {
          title: computed(() => t("my_investment"))
        }
      },
      {
        path: "community",
        name: "Community",
        component: () => import("@/views/community/index.vue"),
        meta: {
          title: computed(() => t("my_community"))
        }
      },
      {
        path: "team",
        name: "Team",
        component: () => import("@/views/team/index.vue"),
        meta: {
          title: computed(() => t("my_team"))
        }
      }
    ]
  }
];

export default routes;
