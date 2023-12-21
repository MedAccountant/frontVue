<template>
    <div
        class="grid grid-flow-row gap-1 bg-black border-4 border-black"
        v-if="positionListArr.length !== 0"
    >
        <position
            :positionInfo="pos"
            v-for="pos of positionListArr"
            :key="pos.id"
            @deletePosition="
                (x) => {
                    emits('deletePos', x);
                }
            "
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
import position from "@/components/editor/position.vue";
import { toRefs } from "vue";

const props = defineProps(["positionListArr"]);
const { positionListArr } = toRefs(props);
const emits = defineEmits(["deletePos"]);
console.log(positionListArr);
</script>

<style scoped></style>
