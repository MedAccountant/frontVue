<template>
    <div class="border p-4 mb-4">
        <p class="text-lg font-bold">{{ company.companyName }}</p>
        <div class="flex mt-2">
            <button
                @click="emits('delete', company.companyName)"
                class="bg-red-500 text-white p-2 mr-2"
            >
                Delete
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps(["company"]);
const emits = defineEmits(["delete"]);
</script>
