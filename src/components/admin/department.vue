<template>
    <div class="grid grid-cols-3 w-96 border-2 border-violet-950 p-4">
        <div class="name">{{ departmentInfo.departmentName }}</div>
        <div
            class="text-center"
            :class="{
                'text-red-600': !departmentInfo.workingMarker,
                'text-green-700': departmentInfo.workingMarker,
            }"
        >
            {{ departmentInfo.workingMarker }}
        </div>
        <div></div>
    </div>
</template>

<script setup>
import { toRef } from "vue";
const props = defineProps(["departmentInfo"]);
const departmentInfo = toRef(props.departmentInfo);
</script>

<style scoped></style>
