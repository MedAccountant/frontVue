<template>
    <div class="grid grid-cols-3 w-96 border-2 border-violet-950 p-4">
        <div class="text-ellipsis">
            {{ departmentInfo.departmentName }}
        </div>

        <div
            class="text-center"
            :class="{
                'text-red-600': !departmentInfo.workingMarker,
                'text-green-700': departmentInfo.workingMarker,
            }"
        >
            {{ departmentInfo.workingMarker }}
        </div>
        <button
            class="text-end text-red-400 text-sm self-center"
            @click="deleteDepartment"
        >
            delete
        </button>
    </div>
</template>

<script setup>
import { toRef } from "vue";
import { API_URL } from "@/constants";
const props = defineProps(["departmentInfo"]);

const emits = defineEmits(["deleteSingleDepartment"]);
const departmentInfo = toRef(props.departmentInfo);
async function deleteDepartment() {
    console.log(JSON.stringify(departmentInfo.value));
    try {
        const response = await fetch(`${API_URL}Vista/admin/departments`, {
            method: "DELETE",
            body: JSON.stringify(departmentInfo.value),
            headers: {
                "Content-type": "application/json",
            },
        });
        if (response.status < 300) {
            emits(
                "deleteSingleDepartment",
                departmentInfo.value.departmentName
            );
        }
    } catch (error) {
        console.log(error);
    }
}
</script>

<style scoped></style>
