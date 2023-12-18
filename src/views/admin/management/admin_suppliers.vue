<template>
    <div
        v-if="!show"
        class="min-h-screen w-8/12 grid grid-cols-2 items-center justify-center m-auto overflow-clip"
    >
        <div class="flex flex-col gap-3 h-1/2 overflow-auto items-center">
            <supplier
                v-if="suppliersList.length > 0"
                v-for="item of suppliersList"
                :supplierInfo="item"
                @deleteSupplier="(x) => deleteItemFromSuppliers(x)"
                :key="item.email"
            >
            </supplier>
            <div v-else class="text-5xl font-medium">
                No suppliers at your company
            </div>
        </div>
        <div @click="show = true" class="cursor-pointer">
            <div
                class="backdrop-blur-xl p-3 ml-auto font-medium border-2 border-violet-950 w-40 text-center relative"
            >
                Add new supplier
            </div>
        </div>
    </div>

    <div
        class="min-h-screen w-full backdrop-blur-sm bg-slate-500 bg-opacity-60 absolute top-0 left-0"
        v-if="show"
        @click.stop="show = false"
    >
        <div
            @click.stop
            class="w-96 bg-white border-2 border-violet-950 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 p-3"
        >
            <input
                type="email"
                class="p-3 focus:outline-none bg-slate-400 bg-opacity-20 border border-opacity-20 border-violet-950"
                placeholder="Email"
                v-model="newSupplier.email"
            />
            <input
                type="text"
                class="p-3 focus:outline-none bg-slate-400 bg-opacity-20 border border-opacity-20 border-violet-950"
                placeholder="Name"
                v-model="newSupplier.name"
            />
            <label for="departments">Select departments</label>
            <select
                name="departments"
                id=""
                multiple
                v-model="newSupplier.departments"
                class="bg-violet-950 text-white"
            >
                <option
                    v-for="(item, index) of departments"
                    :value="{
                        departmentName: item.departmentName,
                        workingMarker: true,
                    }"
                    :ket="index"
                    class="p-2 border border-opacity-50 border-white"
                >
                    {{ item.departmentName }}
                </option>
            </select>
            <div class="">
                Selected departments:
                <div class="grid grid-cols-4 grid-rows-2">
                    <div
                        v-for="item of newSupplier.departments"
                        class="text-center"
                    >
                        {{ item.departmentName }}
                    </div>
                </div>
            </div>
            <button
                @click="addNewSupplier"
                class="p-2 bg-purple-400 bg-opacity-70 border-black border-opacity-75 border"
            >
                Submit form
            </button>
            <div v-if="!dataValid" class="text-sm text-red-500">
                data not valid
            </div>
        </div>
    </div>
</template>

<script setup>
import supplier from "@/components/admin/supplier.vue";
import { API_URL } from "@/constants";
import { onMounted, ref, reactive } from "vue";
import { departmentManagement } from "@/hooks/admin_departments";

const show = ref(false);
const suppliersList = ref([]);
const { departments } = departmentManagement();
const newSupplier = reactive({
    email: "",
    departments: [],
    name: "",
    workingMarker: true,
});
const dataValid = ref(true);
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
async function deleteItemFromSuppliers(x) {
    try {
        const response = await fetch(`${API_URL}Vista/admin/suppliers`, {
            method: "DELETE",
            body: JSON.stringify(x),
            headers: {
                "Content-type": "application/json",
            },
        });
        if (response.status < 300) {
            suppliersList.value = suppliersList.value.filter(
                (i) => i.email !== x.email
            );
        }
    } catch (error) {}
}

async function addNewSupplier(x) {
    if (
        newSupplier.email.length > 4 &&
        newSupplier.name.length > 0 &&
        validateEmail(newSupplier.email)
    ) {
        try {
            const response = await fetch(`${API_URL}Vista/admin/suppliers`, {
                method: "POST",
                body: JSON.stringify(newSupplier),
                headers: {
                    "Content-type": "application/json",
                },
            });
            if (response.status < 300) {
                suppliersList.value.push({
                    email: newSupplier.email,
                    departments: newSupplier.departments,
                    name: newSupplier.name,
                });
                newSupplier.email = "";
                newSupplier.departments = [];
                newSupplier.name = "";
                show.value = false;
                dataValid.value = true;
            } else {
                dataValid.value = false;
            }
        } catch (error) {
            show.value = true;
            dataValid.value = false;
            console.log(error);
        }
    } else {
        dataValid.value = false;
    }
}
onMounted(async () => {
    try {
        const response = await fetch(`${API_URL}Vista/admin/suppliers`);
        const data = await response.json();
        for (let item of data) {
            suppliersList.value.push(item);
        }
    } catch (error) {
        console.log(error);
    }
});
</script>

<style scoped></style>
