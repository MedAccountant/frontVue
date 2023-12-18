<template>
    <div class="flex justify-center min-h-screen items-center flex-col mt-12">
        <div class="grid grid-cols-3 w-96 border-b-violet-950 mb-2">
            <div class="name">Dep-ent name</div>
            <div class="text-center">Working marker</div>
            <div class="text-end">Delete dep-ent</div>
        </div>
        <div class="grid grid-cols-1 gap-2">
            <department
                v-for="item of departments"
                :departmentInfo="item"
                @deleteSingleDepartment="
                    (x) =>
                        (departments = departments.filter(
                            (i) => i.departmentName != x
                        ))
                "
            ></department>
        </div>
        <div class="mt-2 grid grid-cols-2 w-96">
            <input
                type="text"
                class="border border-neutral-700 p-3 focus:outline-none"
                placeholder="Department name"
                v-model="newDepartmentName.value"
                name="inputNewDepartment"
            />

            <button @click="addNewDepartment">Add new department</button>
        </div>
        <label
            for="inputNewDepartment"
            class="text-red-400 text-sm font-light mt-2"
            v-if="newDepartmentName.ready === false"
            >Enter full name</label
        >
    </div>
</template>

<script setup>
import department from "@/components/admin/department.vue";
import { departmentManagement } from "@/hooks/admin_departments";
const { departments, addNewDepartment, newDepartmentName } =
    departmentManagement();
</script>

<style scoped></style>
