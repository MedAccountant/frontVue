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
import company from "@/components/sys_admin/company.vue";
const companies = ref([]);
async function deleteCompany(companyToDelete) {
    try {
        const response = await fetch(`${API_URL}sys_admin/companies`, {
            method: "DELETE",
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
