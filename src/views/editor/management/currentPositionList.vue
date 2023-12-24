<template>
    <div
        class="grid grid-flow-row gap-1 bg-black border-4 border-black"
        v-if="positionListArr.length !== 0"
    >
        <currentPosition
            :positionInfo="pos"
            v-for="pos of positionListArr"
            :key="pos.id"
        />
    </div>
    <div
        v-else
        class="flex justify-center items-center text-2xl text-slate-400 font-extrabold"
    >
        <p>No positions</p>
    </div>
</template>

<script setup>
import currentPosition from "@/components/editor/currentPosition.vue";
import { toRefs } from "vue";

const props = defineProps(["positionListArr"]);
const { positionListArr } = toRefs(props);
const emits = defineEmits(["deletePos"]);
</script>

<style scoped></style>
