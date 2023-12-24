<script setup>
import { ref, onMounted } from "vue";
import { API_URL } from "./constants";
import { RouterLink, RouterView } from "vue-router";
import { useRoute, useRouter } from "vue-router";
import { checkAuth } from "@/hooks/check_auth";
const router = useRouter();
const route = useRoute();
const { action, authStore } = checkAuth();
onMounted(() => {
    router.push(action);
});
function logOut() {
    authStore.removeToken();
    router.push("/login");
}
function goBack() {
    router.back();
}

async function checkAuthorization() {
    try {
        const response = await fetch(`${API_URL}auth_check`, {
            method: "GET",
            headers: {
                Authorization: authStore.getToken,
            },
        });
        const text = await response.text();
        console.log(text);
        if (response.ok) {
            console.log(text);
        } else {
            authStore.removeToken();
        }
    } catch (err) {
        console.log(err);
    }
}
setInterval(checkAuthorization, 1000 * 60 * 15);
</script>

<template>
    <div class="">
        <button
            @click="logOut"
            v-if="authStore.getLoggedState"
            class="fixed right-0 top-0 bg-red-500 rounded text-white m-10 p-2 hover:bg-red-600 transition-all"
        >
            logout
        </button>

        <button
            @click="goBack"
            v-if="
                authStore.getLoggedState &&
                route.fullPath !== '/admin' &&
                route.fullPath !== '/editor' &&
                route.fullPath !== '/depman'
            "
            class="fixed left-0 top-0 bg-slate-600 rounded text-white m-10 p-2 hover:bg-slate-700 transition-all"
        >
            back
        </button>
        <RouterView></RouterView>
    </div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
}
</style>
