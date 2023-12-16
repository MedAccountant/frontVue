<template>
    <div class="min-h-screen flex items-center justify-center">
        <form
            @submit.prevent="send_login_data"
            class="bg-white p-8 shadow-md rounded-md w-96"
        >
            <h2 class="text-2xl font-semibold mb-6">Login</h2>
            <div class="mb-4">
                <label
                    for="username"
                    class="block text-gray-600 text-sm font-medium"
                    >Username</label
                >
                <input
                    v-model="login_info.username"
                    type="text"
                    id="username"
                    class="mt-1 p-2 w-full border rounded-md"
                />
            </div>
            <div class="mb-4">
                <label
                    for="password"
                    class="block text-gray-600 text-sm font-medium"
                    >Password</label
                >
                <input
                    v-model="login_info.password"
                    :type="showPassword.isVisible ? 'text' : 'password'"
                    id="password"
                    class="mt-1 p-2 w-full border rounded-md"
                />

                <input
                    class="mt-2"
                    type="checkbox"
                    id="checkbox_show_pass"
                    v-model="showPassword.isVisible"
                    @change="showPassword ^ 1"
                />
                <label
                    for="checkbox_show_pass"
                    class="ms-2 text-sm text-opacity-75 text-gray-600 font-normal"
                    >Show password
                </label>
            </div>
            <div
                class="mb-4 text-red-500 font-light flex min-w-full text-xs justify-center"
                :class="{
                    'animate-bounce':
                        !login_success.result & login_success.bounce,
                }"
            >
                <p v-if="!login_success.result" class="">
                    Wrong login or password
                </p>
            </div>
            <button
                type="submit"
                class="w-full bg-blue-500 text-white p-2 rounded-md"
            >
                Login
            </button>
        </form>
    </div>
</template>

<script setup>
import { reactive } from "vue";
import { useLogin } from "../hooks/login.js";
import { checkAuth } from "@/hooks/check_auth";
const { login_info, send_login_data, login_success } = useLogin();
const { authStore } = checkAuth();
const showPassword = reactive({ isVisible: false });
</script>

<style scoped>
@keyframes bounce {
    0%,
    100% {
        transform: translateY(0%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
        transform: translateY(15%);
        animation-timing-function: cubic-bezier(0, 0, 0.6, 1);
    }
    25%,
    75% {
        transform: translateY(-15%);
        animation-timing-function: cubic-bezier(1, 0.3, 0.2, 1);
    }
}
.animate-bounce {
    animation: bounce 0.5s;
}
</style>
