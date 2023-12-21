<template>
    <div class="min-h-screen flex flex-col items-center justify-center gap-3">
        <select
            v-model="departments.chosen_department"
            class="p-3 border-b-2 border-black bg-white"
            @change="loadOrdersForDepartment"
        >
            <option disabled value="">Select department</option>
            <option
                v-for="department in departments.all_departments"
                :value="department.departmentName"
                :key="department.departmentName"
            >
                {{ department.departmentName }}
            </option>
        </select>
        <div
            v-if="orders.orders_empty"
            class="text-2xl text-slate-400 font-extrabold"
        >
            No orders
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { API_URL } from "@/constants";
import { checkAuth } from "@/hooks/check_auth";
const { authStore } = checkAuth();
const departments = reactive({ all_departments: [], chosen_department: "" });
const orders = reactive({ all_orders: [], orders_empty: false });

async function loadOrdersForDepartment() {
    console.log(1);
    try {
        const response = await fetch(
            `${API_URL}Vista/editor/${departments.chosen_department}/orders`,
            {
                headers: {
                    Authorization: authStore.getToken,
                },
            }
        );
        if (response.ok) {
            orders.all_orders = await response.json();
            if (orders.all_orders.length === 0) {
                orders.orders_empty = true;
            }
        }
    } catch (error) {}
}
onMounted(async () => {
    try {
        const response = await fetch(`${API_URL}Vista/editor/departments`, {
            headers: {
                Authorization: authStore.getToken,
            },
        });
        if (response.ok) {
            departments.all_departments = await response.json();
            console.log(departments.all_departments);
        }
    } catch (error) {}
});
</script>

<style scoped></style>
