<template>
    <div
        class="absolute top-0 left-0 min-h-screen flex center bg-black bg-opacity-20 backdrop-blur-md w-full justify-center items-center"
        @click.stop="emits('close')"
    >
        <div
            @click.stop
            class="w-3/4 bg-white border-2 border-violet-950 flex flex-col p-11 rounded-2xl dialog items-center"
        >
            <div class="grid grid-flow-col gap-3 text-center mb-5">
                <div
                    @click="goToPage(item)"
                    class="text-indigo-400 cursor-pointer"
                    :class="{
                        'text-violet-500': pages.current_page === item,
                    }"
                    v-for="item of pages.allPages"
                    :key="item.current_page"
                >
                    {{ item }}
                </div>
            </div>
            <!-- info -->
            <div
                class="flex flex-col w-full items-center"
                v-if="pages.current_page === 'info'"
            >
                <div class="text-2xl text-slate-500 font-bold">
                    {{ positionInfo.name }}
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
                                :key="item.attributeName"
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
                            <div
                                v-for="item of dataToEdit.limits"
                                :key="item.startDate"
                                class="grid grid-cols-4"
                            >
                                <div>
                                    min:
                                    <div class="text-red-500">
                                        {{ item.min }}
                                    </div>
                                </div>
                                <div>
                                    max:
                                    <div class="text-green-500">
                                        {{ item.max }}
                                    </div>
                                </div>
                                <div>
                                    start date:
                                    <div class="text-blue-500">
                                        {{ item.startDate }}
                                    </div>
                                </div>
                                <div>
                                    end date:
                                    <div class="text-blue-500">
                                        {{ item.endDate }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Marker -->
                    <div class="gap-4 self-end justify-self-end flex flex-col">
                        <button
                            v-if="PosStore.getEditorMode !== 'global'"
                            @click="saveCurrent"
                            class="bg-violet-500 text-white rounded-2xl py-2 px-6 cursor-pointer"
                        >
                            Save local changes
                        </button>
                        <button
                            @click="saveChanges"
                            class="bg-violet-500 text-white rounded-2xl py-2 px-6 cursor-pointer"
                        >
                            Save position
                        </button>
                    </div>
                </div>
            </div>
            <!-- add limits -->
            <div
                class="flex flex-col w-full items-center gap-3"
                v-if="pages.current_page === 'add limits'"
            >
                <input
                    type="number"
                    placeholder="min"
                    class="border-b border-black focus:outline-none text-left"
                    v-model="limitData.min"
                />
                <input
                    type="number"
                    placeholder="max"
                    class="border-b text-left border-black focus:outline-none"
                    v-model="limitData.max"
                />
                <select
                    name=""
                    id=""
                    v-if="mode === 'global'"
                    v-model="limitData.department"
                    class="border-b border-black focus:outline-none text-left bg-white p-3"
                >
                    <option disabled value="">Select department</option>
                    <option
                        v-for="item of dataToEdit.departmentsWherePositionOccurs"
                        :value="item"
                        :key="item.departmentName"
                    >
                        {{ item.departmentName }}
                    </option>
                </select>

                <input
                    type="date"
                    v-model="limitData.startDate"
                    placeholder="Start date"
                    class="border-b border-black focus:outline-none text-left"
                />
                <input
                    type="date"
                    v-model="limitData.endDate"
                    placeholder="End date"
                    class="border-b text-left border-black focus:outline-none"
                />
                <button
                    @click="addLimit"
                    class="bg-violet-500 text-white rounded-2xl py-2 px-6 cursor-pointer"
                >
                    Add limit
                </button>
            </div>
            <!-- add attributes -->
            <div
                class="flex flex-col w-full items-center gap-4"
                v-if="pages.current_page === 'add attributes'"
            >
                <input
                    type="text"
                    v-model="attributeData.attributeName"
                    placeholder="Attribute"
                    class="border-b border-black focus:outline-none text-left"
                />
                <input
                    type="text"
                    v-model="attributeData.value"
                    placeholder="Value"
                    class="border-b border-black focus:outline-none text-left"
                />
                <button
                    @click="addAttribute"
                    class="bg-violet-500 px-4 py-2 rounded-2xl"
                >
                    Add attribute
                </button>
            </div>
            <!-- edit attributes -->
            <div
                v-if="pages.current_page === 'edit attributes'"
                class="w-full flex flex-col items-center gap-3"
            >
                <!-- select attribute to edit -->
                <select
                    v-model="attributeToEdit"
                    class="p-3 border-b border-black focus:outline-none bg-white"
                >
                    <option disabled :value="-1">
                        select attribute to edit
                    </option>
                    <option
                        v-for="(item, index) of dataToEdit.attributes"
                        :value="index"
                        :key="index"
                    >
                        {{ item.attributeName }}
                    </option>
                </select>
                <div v-if="attributeToEdit !== -1" class="flex flex-col gap-3">
                    <input
                        v-model="
                            dataToEdit.attributes[attributeToEdit].attributeName
                        "
                        type="text"
                        class="border-b border-black focus:outline-none text-left"
                    />
                    <input
                        v-model="dataToEdit.attributes[attributeToEdit].value"
                        type="text"
                        class="border-b border-black focus:outline-none text-left"
                    />
                    <button
                        class="bg-red-400 text-white rounded-2xl py-2 px-4"
                        @click="
                            dataToEdit.attributes =
                                dataToEdit.attributes.filter(
                                    (item, index) => index != attributeToEdit
                                );
                            pages.current_page = 'info';
                        "
                    >
                        delete
                    </button>
                </div>
            </div>
            <!-- edit limits -->
            <div
                class="w-full flex flex-col items-center gap-3"
                v-if="pages.current_page === 'edit limits'"
            >
                <select
                    v-model="limitToEdit"
                    class="p-3 border-b border-black focus:outline-none bg-white"
                >
                    <option disabled :value="-1">
                        select limit by start date
                    </option>
                    <option
                        v-for="(item, index) of dataToEdit.limits"
                        :value="index"
                        :key="index"
                    >
                        {{ item.startDate }}
                    </option>
                </select>
                <div class="flex flex-col gap-3" v-if="limitToEdit !== -1">
                    <input
                        type="number"
                        v-model="dataToEdit.limits[limitToEdit].min"
                        class="border-b border-black focus:outline-none text-left"
                    />
                    <input
                        type="number"
                        v-model="dataToEdit.limits[limitToEdit].max"
                        class="border-b border-black focus:outline-none text-left"
                    />
                    <input
                        type="date"
                        v-model="dataToEdit.limits[limitToEdit].startDate"
                        class="border-b border-black focus:outline-none text-left"
                    />
                    <input
                        type="date"
                        v-model="dataToEdit.limits[limitToEdit].endDate"
                        class="border-b border-black focus:outline-none text-left"
                    />
                    <select
                        class="border-b border-black focus:outline-none text-left bg-white p-3"
                        v-if="mode === 'global'"
                        v-model="dataToEdit.limits[limitToEdit].department"
                    >
                        <option
                            v-for="item of dataToEdit.departmentsWherePositionOccurs"
                            :value="item"
                            :key="item.departmentName"
                        >
                            {{ item.departmentName }}
                        </option>
                    </select>
                    <button
                        class="bg-red-400 text-white rounded-2xl py-2 px-4"
                        @click="
                            dataToEdit.limits = dataToEdit.limits.filter(
                                (item, index) => index != limitToEdit
                            );
                            pages.current_page = 'info';
                        "
                    >
                        delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, toRefs, reactive, resolveDynamicComponent } from "vue";
import { usePositionStore } from "@/stores/usePositionStore";
import { useJwtStore } from "@/stores/useJwtStore";
import { API_URL } from "@/constants";

const jwt = useJwtStore();
const PosStore = usePositionStore();
const props = defineProps({
    positionInfo: Object,
});
const pages = reactive({
    current_page: "info",
    allPages: [
        "info",
        "add attributes",
        "add limits",
        "edit attributes",
        "edit limits",
    ],
});
if (PosStore.getEditorMode === "global") {
    pages.allPages = ["info"];
}
const { positionInfo } = toRefs(props);
const dataToEdit = ref({});
const emits = defineEmits(["close"]);
const mode = ref(PosStore.getEditorMode);

const limitData = ref({
    min: "",
    max: "",
    startDate: "",
    endDate: "",
    department:
        mode.value === "global"
            ? ""
            : { departmentName: mode, workingMarker: true },
});
const limitToEdit = ref(-1);
const attributeData = ref({
    attributeName: "",
    value: "",
});
const attributeToEdit = ref(-1);
const addLimit = () => {
    if (
        limitData.value.min >= 0 &&
        limitData.value.max >= 0 &&
        limitData.value.startDate &&
        limitData.value.endDate
    ) {
        dataToEdit.value.limits.push(limitData.value);
        limitData.value = {
            min: "",
            max: "",
            startDate: "",
            endDate: "",
            department:
                mode.value === "global"
                    ? ""
                    : { departmentName: mode, workingMarker: true },
        };
        pages.current_page = "info";
    } else {
        alert(
            "Check your fields\nAll fields must be filled and min max must be greater than 0"
        );
    }
};
const addAttribute = () => {
    dataToEdit.value.attributes.push(attributeData.value);
    attributeData.value = {
        attributeName: "",
        value: "",
    };
    pages.current_page = "info";
};
const goToPage = (page) => {
    if (page == "edit attributes" && dataToEdit.value.attributes.length == 0) {
        alert("Nothing to edit");
    } else if (page == "edit limits" && dataToEdit.value.limits.length == 0) {
        alert("Nothing to edit");
    } else {
        pages.current_page = page;
    }
};
let link = "";
async function saveCurrent() {
    try {
        const response = await fetch(link, {
            method: "PUT",
            body: JSON.stringify(dataToEdit.value),
            headers: {
                Authorization: jwt.getToken,
                "Content-type": "application/json",
            },
        });
        if (response.ok) {
            emits("close");
        }
    } catch (error) {
        console.log(error);
    }
}

async function saveChanges() {
    let bodyObj = {};
    if (PosStore.getEditorMode === "global") {
        bodyObj = dataToEdit.value;
    }
    try {
        const response = await fetch(link, {
            method: "POST",
            body: JSON.stringify(bodyObj),
            headers: {
                Authorization: jwt.getToken,
                "Content-type": "application/json",
            },
        });
        if (response.ok) {
            emits("close");
        } else {
            const data = await response.text();
            alert(data);
        }
    } catch (error) {
        console.log(error);
    }
}
onMounted(async () => {
    if (PosStore.getEditorMode === "global") {
        link = `${API_URL}Vista/editor/current_position_info?currentPositionId=${positionInfo.value.currentPositionId}`;
    } else {
        link = `${API_URL}Vista/editor/${PosStore.getEditorMode}/current_position_info?currentPositionId=${positionInfo.value.currentPositionId}`;
    }
    try {
        const response = await fetch(link, {
            headers: {
                Authorization: jwt.getToken,
            },
        });

        if (response.ok) {
            dataToEdit.value = await response.json();
            console.log(dataToEdit.value);
        }
    } catch (error) {}
});
</script>
