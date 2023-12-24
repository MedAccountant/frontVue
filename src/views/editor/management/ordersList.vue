<template>
    <div class="grid grid-flow-row gap-5">
        <div v-for="(order, index) of orderListArr" :key="index">
            <order :orderInfo="order" />
        </div>
    </div>
</template>

<script setup>
import { toRefs } from "vue";
import order from "@/components/editor/order.vue";
const props = defineProps({
    orderListArr: Array,
});
const { orderListArr } = toRefs(props);
</script>

<style scoped></style>
