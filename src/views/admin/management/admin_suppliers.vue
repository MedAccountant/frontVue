<template>
    <!-- Supplier List Section -->
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
            ></supplier>
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

    <!-- Add Supplier Modal Section -->
    <div v-if="show" class="fixed inset-0 flex items-center justify-center">
        <div
            class="absolute inset-0 bg-slate-500 bg-opacity-60"
            @click.stop="show = false"
        ></div>
        <div
            @click.stop
            class="w-96 bg-white border-2 border-violet-950 relative flex flex-col gap-2 p-3"
        >
            <input
                v-model="newSupplier.email"
                placeholder="Email"
                class="input-field"
            />
            <input
                v-model="newSupplier.name"
                placeholder="Name"
                class="input-field"
            />
            <label for="departments" class="text-gray-700"
                >Select departments</label
            >
            <select
                name="departments"
                multiple
                v-model="newSupplier.departments"
                class="select-field"
            >
                <option
                    v-for="(item, index) of departments"
                    :value="{
                        departmentName: item.departmentName,
                        workingMarker: true,
                    }"
                    :key="index"
                    class="p-2"
                >
                    {{ item.departmentName }}
                </option>
            </select>
            <div class="mt-2">
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
            <button @click="addNewSupplier" class="btn-primary">
                Submit form
            </button>
            <div v-if="!dataValid" class="text-sm text-red-500">
                Data not valid
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

<style scoped>
/* Add your existing styles and the new styles here */
.supplier-list-container {
    min-height: 100vh;
    width: 8/12;
    grid-template-columns: 2;
    justify-items: center;
    align-items: center;
    margin: auto;
    overflow: clip;
}

.supplier-list {
    display: flex;
    flex-direction: column;
    gap: 3;
    height: 1/2;
    overflow: auto;
    align-items: center;
}

.no-suppliers-message {
    font-size: 5xl;
    font-weight: medium;
}

.add-supplier-button {
    cursor: pointer;
}

.add-supplier-modal-background {
    min-height: 100vh;
    width: full;
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0;
    left: 0;
}

.add-supplier-modal {
    width: 96;
    background-color: white;
    border: 2px solid #8b5cf6;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    gap: 2;
    padding: 3;
}

/* Add more styles as needed */
</style>
