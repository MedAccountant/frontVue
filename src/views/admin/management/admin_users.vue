<template>
    <div class="w-full min-h-screen flex justify-center items-center gap-6">
        <div class="border-red-400 rounded-lg flex-col flex">
            <user
                v-for="user of users"
                :key="user.name"
                :userInfo="user"
                @deleteUserFromList="
                    (x) => (users = users.filter((i) => i.login != x))
                "
            >
            </user>
        </div>
        <button
            @click="addUserFetchAndShow"
            class="border-violet-800 border-opacity-50 border-4 p-2"
        >
            Add new user
        </button>
    </div>
    <div
        v-if="showAddUser"
        @click.prevent="showAddUser = false"
        class="w-full min-h-screen flex justify-center items-center absolute top-0 left-0 backdrop-blur-xl flex-col"
    >
        <div
            class="w-1/4 flex flex-col gap-0 border-4 border-violet-500"
            @click.stop
        >
            <input
                class="p-5 border-violet-800 border-4 text-xl"
                placeholder="Name"
                v-model="userForAdd.nickname"
            />
            <input
                class="p-5 border-violet-800 border-4 text-xl"
                placeholder="Login"
                v-model="userForAdd.login"
                name="login_input"
            />

            <input
                class="p-5 border-violet-800 border-4 text-xl"
                placeholder="Password"
                type="text"
                v-model="userForAdd.password"
                name="pass_input"
            />

            <select
                class="p-5 border-violet-800 border-4 text-xl bg-white"
                v-model="userForAdd.role"
            >
                <option disabled value="">Chose role</option>
                <option
                    v-for="(option_val, index) of roles"
                    :key="option_val"
                    :value="option_val"
                >
                    {{ option_val }}
                </option>
            </select>
            <select
                v-if="userForAdd.role !== 'Admin'"
                class="p-5 border-violet-800 border-4 text-xl bg-white"
                v-model="departmentsTake"
                :multiple="userForAdd.role === 'Editor'"
            >
                <option disabled value="" :key="0">Chose departments:</option>
                <option
                    v-for="item of departments"
                    :value="item.departmentName"
                    :key="item.departmentName"
                >
                    {{ item.departmentName }}
                </option>
            </select>

            <button
                class="p-5 border-violet-800 border-4 text-xl"
                @click="addNewUser"
            >
                Add user
            </button>
        </div>
        <label
            class="text-red-500 text-center text-base mb-2 mt-3"
            for="login_input"
            v-if="userForAdd.login.length > 0 && userForAdd.login.length < 5"
        >
            Login length show be more then 4</label
        >
        <label
            class="text-red-500 text-center text-base mt-3"
            for="pass_input"
            v-if="
                userForAdd.password.length > 0 && userForAdd.password.length < 8
            "
        >
            Password length show be more then 7</label
        >
        <label
            class="text-red-500 text-center text-base mt-3"
            v-if="!userForAdd.dataAccepted"
        >
            Check your input fields one more time
        </label>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import user from "@/components/admin/user.vue";
import { API_URL } from "@/constants";
import { checkAuth } from "@/hooks/check_auth";
import { fetchData } from "@/hooks/fetchHook";
const { authStore } = checkAuth();
const users = ref([]);
const showAddUser = ref(false);
const userForAdd = reactive({
    login: "",
    nickname: "",
    password: "",
    role: "",
    departments: [],
    dataAccepted: true,
});
const departmentsTake = ref([]);
const roles = ref(["Admin", "DataProducer", "Editor"]);
const departments = ref([]);
async function addUserFetchAndShow() {
    showAddUser.value = true;
    if (departments.value.length === 0) {
        try {
            const response = await fetchData({
                url: `${API_URL}Vista/admin/departments`,
            });
            const data = await response.data;
            for (let item of data) {
                departments.value.push(item);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
async function addNewUser() {
    const isValidData =
        userForAdd.password.length >= 8 &&
        userForAdd.login.length >= 5 &&
        userForAdd.nickname.length >= 1 &&
        (departmentsTake.value.length > 0 || userForAdd.role === "Admin") &&
        userForAdd.role !== "";

    if (isValidData) {
        userForAdd.dataAccepted = true;

        if (userForAdd.role === "Admin") {
            userForAdd.departments = departments.value;
        } else if (userForAdd.role === "Editor") {
            for (let department of departmentsTake.value) {
                userForAdd.departments.push({
                    departmentName: department,
                    workingMarker: true,
                });
            }
        } else {
            userForAdd.departments.push({
                departmentName: departmentsTake.value,
                workingMarker: true,
            });
        }

        const data = JSON.stringify({
            login: userForAdd.login,
            password: userForAdd.password,
            nickname: userForAdd.nickname,
            departments: userForAdd.departments,
            role: userForAdd.role,
        });
        console.log(data);
        try {
            const response = await fetchData({
                url: `${API_URL}Vista/admin/users`,
                methodOption: "POST",
                bodyData: data,
                headersData: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                users.value.push({
                    login: userForAdd.login,
                    nickname: userForAdd.nickname,
                    role: userForAdd.role,
                    departments: userForAdd.departments,
                });
            }
            showAddUser.value = false;
        } catch (error) {
            console.log(error);
        } finally {
            userForAdd.login = "";
            userForAdd.password = "";
            userForAdd.nickname = "";
            userForAdd.role = "";
            userForAdd.departments = [];
        }
    } else {
        userForAdd.dataAccepted = false;
    }
}

onMounted(async () => {
    try {
        const response = await fetchData({
            url: `${API_URL}Vista/admin/users`,
            headers: {
                Authorization: authStore.getToken,
            },
        });
        const data = await response.data;
        console.log(response);
        for (let item of data) {
            users.value.push(item);
        }
    } catch (error) {
        console.log(error);
    }
});
</script>

<style scoped>
input:focus {
    outline: none;
}
</style>
