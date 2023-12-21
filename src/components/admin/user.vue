<template>
    <div
        class="w-auto grid justify-between gap-2 border-4 p-4 rounded-sm grid-cols-4 border-purple-500 border-opacity-30 mt-2"
    >
        <div class="name">{{ user.login }}</div>
        <div class="role">{{ user.role }}</div>
        <button class="user_info text-blue-500" @click="showInfo = true">
            info
        </button>
        <button
            class="user_info text-red-500"
            @click="deleteUser"
            v-if="authStore.getName != user.login"
        >
            delete
        </button>
        <div class="text-green-500" v-else>Current account</div>
    </div>

    <div
        class="min-h-screen w-full backdrop-blur-sm absolute top-0 left-0 flex justify-center items-center bg-slate-500 bg-opacity-75"
        v-if="showInfo === true"
        @click.stop="showInfo = false"
    >
        <div
            class="info w-96 text-xl rounded-sm border-4 border-violet-900"
            @click.stop
        >
            <div
                class="bg-white text-zinc-900 p-2 grid grid-cols-2 justify-between border border-violet-900"
            >
                <p>Name:</p>
                <p class="text-end text-2xl">{{ user.nickname }}</p>
            </div>
            <div
                class="bg-white text-zinc-900 p-2 grid grid-cols-2 justify-between border border-violet-900"
            >
                <p>Login:</p>
                <p class="text-end text-2xl">{{ user.login }}</p>
            </div>
            <div
                class="bg-white text-zinc-900 p-2 grid grid-cols-2 justify-between border border-violet-900"
            >
                <p>Role:</p>
                <p class="text-end text-2xl">{{ user.role }}</p>
            </div>
            <div
                class="bg-white text-zinc-900 p-2 grid grid-cols-2 justify-between border border-violet-900"
            >
                <p>Departments:</p>
                <div class="text-end text-2xl">
                    <p v-for="(department, index) of user.departments">
                        {{ index + 1 }}. {{ department.departmentName }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { toRef, ref } from "vue";
import { API_URL } from "@/constants";
import { checkAuth } from "@/hooks/check_auth";
const props = defineProps(["userInfo"]);
const emits = defineEmits(["deleteUserFromList"]);
const user = toRef(props.userInfo);
const showInfo = ref(false);
const { authStore } = checkAuth();
async function deleteUser() {
    console.log(JSON.stringify(user.value));
    try {
        const response = await fetch(
            `${API_URL}Vista/admin/users?login=${user.value.login}`,
            {
                method: "DELETE",

                headers: {
                    Authorization: authStore.getToken,
                },
            }
        );
        if (response.status) {
            emits("deleteUserFromList", user.value.login);
        }
    } catch (error) {
        console.log(error);
    }
}
</script>

<style scoped></style>
