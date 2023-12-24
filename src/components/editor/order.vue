<template>
    <div
        class="border grid grid-rows-2 border-black p-3 cursor-pointer"
        @click="openInfo"
    >
        <div class="flex gap-2">
            <span>Дата заказа:</span>
            <span>{{ normalOrderName.date.slice(0, 10) }}</span>
        </div>

        <div class="flex gap-2">
            <span>Отдел:</span>
            <span>{{ normalOrderName.department }}</span>
        </div>
    </div>
    <div
        class="min-h-screen w-full flex items-center justify-center absolute top-0 left-0 bg-black bg-opacity-40 backdrop-blur-lg"
        v-if="isInfoOpen"
        @click.stop="isInfoOpen = false"
    >
        <div
            @click.stop
            class="bg-white border border-black rounded-2xl p-5 w-1/3 flex flex-col gap-5 justify-center"
        >
            <span class="text-center font-medium text-slate-400 text-lg"
                >Order info</span
            >
            <textarea
                type="text"
                v-model="orderFullInfo.description"
                placeholder="Description"
                class="p-5 h-60"
            ></textarea>
            <button
                class="border border-black rounded-xl text-center p-2 self-start bg-teal-900 text-white text-lg"
                @click="saveDescription"
            >
                Save description
            </button>
            <span class="text-center font-medium text-slate-400 text-lg"
                >Order file</span
            >
            <button
                @click="downloadFile"
                class="border border-black rounded-xl text-center p-2 self-start bg-teal-900 text-white text-lg"
            >
                Download file
            </button>

            <button
                @click="saveOrder"
                class="border border-black rounded-xl text-center p-2 self-start bg-teal-900 text-white text-lg"
            >
                Save order
            </button>
        </div>
    </div>
</template>

<script setup>
import { toRefs, reactive, ref } from "vue";
import { checkAuth } from "@/hooks/check_auth";
import { API_URL } from "@/constants";
const { authStore } = checkAuth();
const props = defineProps({
    orderInfo: Object,
});
const orderFullInfo = ref({});
const { orderInfo } = toRefs(props);

const isInfoOpen = ref(false);
let tmp = orderInfo.value.orderName.replace("/orders/", "").split(" ");
const normalOrderName = reactive({ date: tmp[0], department: tmp[3] });
tmp = orderInfo.value.orderName.replaceAll(" ", "_");

let link = `${API_URL}Vista/editor/${normalOrderName.department}/orders/${tmp}`;

async function openInfo() {
    isInfoOpen.value = !isInfoOpen.value;
    try {
        const response = await fetch(link, {
            headers: {
                Authorization: authStore.getToken,
            },
        });
        if (response.ok) {
            orderFullInfo.value = await response.json();
        }
    } catch (error) {
        console.log(error);
    }
}
async function saveDescription() {
    try {
        const response = await fetch(link, {
            method: "PUT",
            body: orderFullInfo.value.description,
            headers: {
                Authorization: authStore.getToken,
            },
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

async function downloadFile() {
    try {
        const response = await fetch(link + "/file", {
            method: "GET",
            headers: {
                Authorization: authStore.getToken,
                "Content-type": "application/json",
            },
        });
        if (response.ok) {
            const blobFile = await response.blob();
            const url = window.URL.createObjectURL(blobFile);
            const a = document.createElement("a");
            a.href = url;
            a.download = tmp + ".xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    } catch (error) {
        console.log(error);
    }
}

async function saveOrder() {
    try {
        const response = await fetch(link, {
            method: "POST",
            headers: {
                Authorization: authStore.getToken,
            },
        });
        if (response.ok) {
            alert("Order was saved");
        }
    } catch (error) {
        console.log(error);
    }
}
</script>

<style scoped></style>
