import { defineStore } from "pinia";

export const useJwtStore = defineStore("token", {
    state: () => {
        return {
            jwt_token: undefined,
            is_user_logged: false,
            role: "",
            departments: [],
            name: "",
        };
    },
    actions: {
        setToken(token) {
            this.jwt_token = token;
            this.is_user_logged = true;
        },
        setPayload(payload) {
            console.log(payload);
            this.role = payload.role;
            this.name = payload.sub;
            this.departments = payload.departments;
        },
        removeToken() {
            this.jwt_token = undefined;
            this.is_user_logged = false;
            this.role = "";
            this.departments = [];
            this.name = "";
        },
    },
    getters: {
        getLoggedState: (state) => {
            return state.is_user_logged;
        },
        getToken: (state) => {
            return "Bearer " + state.jwt_token;
        },
        getRole: (state) => {
            return state.role;
        },
        getDepartments: (state) => {
            return state.departments;
        },
        getName: (state) => {
            return state.name;
        },
    },
    persist: true,
});
