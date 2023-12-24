<template>
    <div
        class="flex justify-center mt-8 min-h-screen items-center flex-col gap-7"
    >
        <h2 class="text-4xl font-bold">Hello</h2>
        <h3 class="text-xl font-normal">What do you want to do?</h3>
        <div class="flex justify-around">
            <button
                @click="navigateTo(current_path + '/initializePositions')"
                class="menu-button"
            >
                Initialize positions
            </button>
            <button
                @click="navigateTo(current_path + '/editPositions')"
                class="menu-button"
            >
                Edit current positions
            </button>
            <button
                @click="navigateTo(current_path + '/orders')"
                class="menu-button"
            >
                Orders
            </button>
        </div>
        <span>Logged as '{{ name }}' ({{ role }})</span>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { checkAuth } from "@/hooks/check_auth";
const { authStore } = checkAuth();
const name = ref(authStore.getName);
const router = useRouter();
const current_path = useRoute().fullPath;
const role = ref(authStore.getRole);
function navigateTo(source) {
    router.push(source);
}
</script>

<style scoped>
.menu-button {
    margin: 0 8px;
    padding: 10px 20px;
    background-color: #3490dc;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.menu-button:hover {
    background-color: #2779bd;
}
</style>
