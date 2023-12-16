<template>
    <div></div>
</template>

<script setup>
import { toRef, ref } from "vue";
const props = defineProps(["supplierInfo"]);
const supplier = toRef(props.supplierInfo);
const showInfo = ref(false);
</script>

<style scoped></style>
