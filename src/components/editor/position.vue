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
                @click="openPositionEditor"
            >
                {{ position.name }}
            </div>
        </div>
        <div
            v-for="i of 4"
            class="bg-white p-4 text-center"
            :class="{
                'bg-violet-500 text-white': position.editedMarker,
            }"
        >
            {{
                position.attributeNames[i]
                    ? position.attributeNames[i]
                    : "empty"
            }}
        </div>
    </div>

    <div
        class="absolute top-0 left-0 min-h-screen flex center bg-black bg-opacity-20 backdrop-blur-md w-full justify-center items-center"
        v-if="isPositionEditing"
        @click.stop="isPositionEditing = false"
    >
        <div
            @click.stop
            class="w-3/4 bg-white border-2 border-violet-950 flex flex-col p-11 rounded-2xl dialog items-center"
        >
            <div class="text-2xl text-slate-500 font-bold">
                {{ position.name }}
            </div>
            <div class="flex justify-around w-full">
                <!-- Attributes -->
                <div class="w-1/3 text-center">
                    <span class="text-2xl text-slate-500 font-bold"
                        >Attributes</span
                    >
                    <div
                        class="grid grid-flow-row border-2 border-violet-400 p-5 rounded-2xl"
                    >
                        <div
                            v-for="item of dataToEdit.attributes"
                            class="grid grid-cols-2 border-b-2 border-b-indigo-400 mb-2 p-2"
                        >
                            <div class="text-left">
                                {{ item.attributeName }}
                            </div>
                            <div class="text-right">{{ item.value }}</div>
                        </div>
                    </div>
                </div>
                <!-- Marker -->
                <!-- Limits -->
                <div class="w-1/3 text-center">
                    <span class="text-2xl text-slate-500 font-bold"
                        >Limits</span
                    >
                    <div
                        class="grid grid-flow-row border-2 border-violet-400 p-5 rounded-2xl"
                    >
                        <div v-for="item of dataToEdit.limits">{{ item }}</div>
                    </div>
                </div>
                <!-- Marker -->
            </div>
            <div class="flex gap-4">
                <div>Add limit</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { toRef, ref } from "vue";
import { usePositionStore } from "@/stores/usePositionStore";
import { API_URL } from "@/constants";
import { useJwtStore } from "@/stores/useJwtStore";
const jwt = useJwtStore();
const props = defineProps(["positionInfo"]);
const position = toRef(props, "positionInfo");
const PosStore = usePositionStore();
const mode = PosStore.getEditorMode;
const departments = PosStore.getDepartments;
const isPositionEditing = ref(false);
const dataToEdit = ref({});

async function openPositionEditor() {
    isPositionEditing.value = true;
    let link = "";
    if (PosStore.getEditorMode === "global") {
        link = `${API_URL}Vista/editor/new_position_info?newPositionId=${position.value.positionDataId}`;
    } else {
        link = `${API_URL}Vista/editor/${PosStore.getEditorMode}/new_position_info?newPositionId=${position.value.positionDataId}`;
    }
    try {
        const response = await fetch(link, {
            headers: {
                Authorization: jwt.getToken,
            },
        });
        if (response.ok) {
            dataToEdit.value = await response.json();
        }
    } catch (error) {}
}
</script>

<style scoped>
.dialog {
    height: 80vh;
}
</style>
