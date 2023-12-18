<template>
    <div
        class="border-2 border-violet-950 flex gap-2 w-96 flex-col p-2 rounded-md"
    >
        <div class="data flex flex-col border-b-2 border-violet-900">
            <div>Email: {{ supplier.email }}</div>
            <div>Name: {{ supplier.name }}</div>
        </div>
        <div class="departments">
            Departments:
            <div v-for="item of supplier.departments" class="text-green-950">
                {{ item.departmentName }}
            </div>
        </div>
        <button
            class="text-sm font-light text-red-400 text-end"
            @click="emits('deleteSupplier', supplier)"
        >
            Delete
        </button>
    </div>
</template>

<script setup>
import { toRef, ref } from "vue";
const props = defineProps(["supplierInfo"]);
const emits = defineEmits(["deleteSupplier"]);
const supplier = toRef(props.supplierInfo);
</script>

<style scoped></style>
