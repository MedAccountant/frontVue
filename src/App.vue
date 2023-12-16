<script setup>
import { ref, onMounted } from "vue";
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
</script>

<template>
    <div class="">
        <button
            @click="logOut"
            v-if="authStore.getLoggedState"
            class="absolute right-0 top-0 bg-red-400 rounded text-white m-10 p-2"
        >
            logout
        </button>

        <button
            @click="goBack"
            v-if="
                authStore.getLoggedState &&
                route.fullPath !== '/admin' &&
                route.fullPath !== '/user' &&
                route.fullPath !== '/depman'
            "
            class="absolute left-0 top-0 bg-slate-600 rounded text-white m-10 p-2"
        >
            back
        </button>
        <RouterView></RouterView>
    </div>
</template>

<style></style>
