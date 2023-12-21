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
            <positionList
                :positionListArr="positionsListPass"
                @deletePos="
                    (x) =>
                        (positionsListPass = positionsListPass.filter(
                            (i) => i.positionDataId != x
                        ))
                "
            ></positionList>
        </div>
    </div>
</template>

<script setup>
import positionList from "@/views/editor/management/positionList.vue";
import { usePositionStore } from "@/stores/usePositionStore";
import { onMounted, ref, reactive } from "vue";
import { API_URL } from "@/constants";
import { checkAuth } from "@/hooks/check_auth";
const PosStore = usePositionStore();
const { authStore } = checkAuth();
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
        const response = await fetch(`${API_URL}Vista/editor/departments`, {
            headers: {
                Authorization: authStore.getToken,
            },
        });
        if (response.ok) {
            const data = await response.json();

            myDepartments.value = data;
        }
    } catch (error) {
        console.log(error);
    }
});
async function selectMode(mode) {
    if (mode == "global_mode") {
        selectedMode.isGlobal = true;
        selectedMode.selectedDepartment = "";
        linkWithMode.value = `${API_URL}Vista/editor/new_positions`;
    } else {
        selectedMode.isGlobal = false;
        selectedMode.selectedDepartment = mode;
        linkWithMode.value = `${API_URL}Vista/editor/${selectedMode.selectedDepartment}/new_positions`;
    }
    try {
        const response = await fetch(`${linkWithMode.value}`, {
            headers: {
                Authorization: authStore.getToken,
            },
        });
        if (response.ok) {
            const data = await response.json();
            positionsListPass.value = data;
            selectedMode.isSelected = "list";
            PosStore.setEditorMode(mode === "global_mode" ? "global" : mode);
        }
    } catch (error) {
        console.log(error);
    }
}
</script>

<style scoped></style>
