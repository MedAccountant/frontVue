import { createRouter, createWebHistory } from "vue-router";
import loginPage from "../views/loginPage.vue";
import admin from "@/views/admin/admin.vue";
import sys from "@/views/sys_admin/sys.vue";
import admin_users from "@/views/admin/management/admin_users.vue";
import editor from "@/views/editor/editor.vue";
import admin_suppliers from "@/views/admin/management/admin_suppliers.vue";
import admin_departments from "@/views/admin/management/admin_departments.vue";
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            component: loginPage,
        },
        {
            path: "/admin",
            component: admin,
        },
        {
            path: "/mega-admin",
            component: sys,
        },
        {
            path: "/admin/users",
            component: admin_users,
        },
        {
            path: "/editor",
            component: editor,
        },
        {
            path: "/admin/suppliers",
            component: admin_suppliers,
        },
        {
            path: "/admin/departments",
            component: admin_departments,
        },
    ],
});

export default router;
