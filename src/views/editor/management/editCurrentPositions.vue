<template>
    <div class="min-h-screen w-full flex items-center justify-center">
        <div
            class="flex flex-col gap-2"
            v-if="selectedMode.isSelected == 'choice'"
        >
            <span>Select <b>Global</b> mode or <b>department name</b> </span>
            <div class="grid grid-cols-2 gap-4 mt-5 relative items-start">
                <div
                    class="bg-violet-950 text-white text-center p-2 rounded-md hover:shadow-sm hover:shadow-violet-950 transition-all cursor-pointer hover:-translate-y-1"
                    @click="selectMode('global_mode')"
                >
                    Global
                </div>
                <div
                    class="grid grid-flow-row rounded-md text-center text-white gap-4 overflow-scroll items-start max-h-72"
                >
                    <div
                        v-for="department of myDepartments"
                        :key="department.departmentName"
                        @click="selectMode(department.departmentName)"
                        class="rounded-md p-2 bg-violet-950 hover:shadow-sm hover:shadow-violet-950 transition-all cursor-pointer hover:-translate-y-1"
                    >
                        {{ department.departmentName }}
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="selectedMode.isSelected == 'list'"
            class="overflow-scroll mt-20"
        >
            <currentPositionList :positionListArr="positionsListPass">
            </currentPositionList>
        </div>
    </div>
</template>

<script setup>
import { fetchData } from "@/hooks/fetchHook";
import { onMounted, ref, reactive } from "vue";
import currentPositionList from "@/views/editor/management/currentPositionList.vue";
import { usePositionStore } from "@/stores/usePositionStore";
import { API_URL } from "@/constants";
import { useJwtStore } from "@/stores/useJwtStore";
const PosStore = usePositionStore();
const authStore = useJwtStore();
const myDepartments = ref([]);
const selectedMode = reactive({
    isGlobal: false,
    selectedDepartment: "",
    isSelected: "choice",
});
const positionsListPass = ref([]);
const linkWithMode = ref("");

onMounted(async () => {
    try {
        const response = await fetchData({
            url: `${API_URL}Vista/editor/departments`,
            methodOption: "GET",
        });
        if (response.ok) {
            myDepartments.value = await response.data;
        }
    } catch (error) {}
});

async function selectMode(mode) {
    if (mode == "global_mode") {
        selectedMode.isGlobal = true;
        selectedMode.selectedDepartment = "";
        linkWithMode.value = `${API_URL}Vista/editor/current_positions`;
    } else {
        selectedMode.isGlobal = false;
        selectedMode.selectedDepartment = mode;
        linkWithMode.value = `${API_URL}Vista/editor/${selectedMode.selectedDepartment}/current_positions`;
    }
    try {
        const response = await fetch(`${linkWithMode.value}`, {
            method: "GET",
            headers: {
                Authorization: authStore.getToken,
            },
        });
        if (response.ok) {
            positionsListPass.value = await response.json();
            selectedMode.isSelected = "list";
            PosStore.setEditorMode(mode === "global_mode" ? "global" : mode);
        }
    } catch (error) {
        console.log(error);
    }
}
</script>

<style scoped></style>
