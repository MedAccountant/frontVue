<template>
    <div class="flex justify-center items-center flex-col">
        <company
            v-for="(item, index) in companies"
            :key="index"
            :company="item.company"
            @delete="(x) => deleteCompany(x)"
        />
        <button @click="addNewCompany" class="bg-blue-500 text-white p-2 mt-4">
            Add New Company
        </button>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { API_URL } from "@/constants";
import { checkAuth } from "@/hooks/check_auth";
import company from "@/components/sys_admin/company.vue";
const companies = ref([]);
const authStore = checkAuth();
async function addNewCompany() {
    try {
        const response = await fetch(`${API_URL}sys_admin/companies`, {
            method: "POST",
            body: JSON.stringify({
                companyName: "Vista",
            }),
            headers: {
                "Content-type": "application/json",
                Authorization: authStore.getToken,
            },
        });
        const data = await response.json();
        companies.value.push({
            company: data,
        });
    } catch (err) {
        console.log(err);
    }
}
async function deleteCompany(companyToDelete) {
    try {
        const response = await fetch(`${API_URL}sys_admin/companies`, {
            method: "DELETE",
            headers: {
                Authorization: authStore.getToken,
            },
            body: JSON.stringify({ companyName: companyToDelete }),
        });
        if (response) {
            companies.value = companies.value.filter(
                (c) => c.companyName !== companyToDelete
            );
        }
    } catch (error) {}
}
async function getCompaniesList() {
    try {
        const response = await fetch(`${API_URL}sys_admin/companies`, {
            method: "GET",
            headers: {
                Authorization: authStore.getToken,
            },
        });
        const data = await response.json();
        for (let item of data) {
            companies.value.push({
                company: item,
                key: companies.value.length,
            });
        }
    } catch (error) {
        console.log(error);
    }
}

onMounted(async () => {
    await getCompaniesList();
});
</script>

<style scoped></style>
