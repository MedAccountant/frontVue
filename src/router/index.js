import { createRouter, createWebHistory } from "vue-router";
import loginPage from "../views/loginPage.vue";
import admin from "@/views/admin/admin.vue";
import sys from "@/views/sys_admin/sys.vue";
import admin_users from "@/views/admin/management/admin_users.vue";
import editor from "@/views/editor/editor.vue";
import admin_suppliers from "@/views/admin/management/admin_suppliers.vue";
import admin_departments from "@/views/admin/management/admin_departments.vue";
import departmentsEditor from "@/views/editor/management/departmentsEditor.vue";
import initializePositions from "@/views/editor/management/initializePositions.vue";
import dataproducer from "@/views/dataProducer/dataproducer.vue";
import fileUpload from "@/views/dataProducer/fileUpload.vue";
import ordersEditor from "@/views/editor/management/ordersEditor.vue";
import editCurrentPositions from "@/views/editor/management/editCurrentPositions.vue";

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
        {
            path: "/editor/departments",
            component: departmentsEditor,
        },
        {
            path: "/editor/initializePositions",
            component: initializePositions,
        },
        {
            path: "/dataproducer",
            component: dataproducer,
        },
        {
            path: "/dataproducer/fileupload",
            component: fileUpload,
        },
        {
            path: "/editor/orders",
            component: ordersEditor,
        },
        {
            path: "/editor/editPositions",
            component: editCurrentPositions,
        },
    ],
});

export default router;
