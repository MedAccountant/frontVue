<template>
    <div class="grid grid-cols-5 gap-1">
        <div
            class="bg-white p-4 font-medium text-xl"
            :class="{
                'bg-violet-500 text-white': position.editedMarker,
            }"
        >
            <div
                class="transition-all hover:animate-pulse cursor-pointer"
                @click="isPositionEditing = true"
            >
                {{ position.name }}
            </div>
        </div>
        <div
            v-for="i of 4"
            class="bg-white p-4 text-center"
            :key="i"
            :class="{
                'bg-violet-500 text-white': position.editedMarker,
            }"
        >
            {{
                position.attributeNames[i - 1]
                    ? position.attributeNames[i - 1]
                    : "empty"
            }}
        </div>
    </div>
    <positionEdit
        v-if="isPositionEditing"
        :positionInfo="position"
        @close="isPositionEditing = false"
        @deletePos="emits('deletePosition', position.positionDataId)"
    />
</template>

<script setup>
import { toRef, ref } from "vue";
import positionEdit from "@/components/editor/positionEdit.vue";

const props = defineProps(["positionInfo"]);
const emits = defineEmits(["deletePosition"]);
const position = toRef(props, "positionInfo");
const isPositionEditing = ref(false);
</script>

<style scoped>
.dialog {
    height: 80vh;
}
</style>
