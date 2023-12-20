import { defineStore } from "pinia";

export const usePositionStore = defineStore("positionStore", {
    state: () => {
        return {
            editor_mode: "",
            departments: [],
        };
    },
    actions: {
        setEditorMode(mode) {
            this.editor_mode = mode;
        },
        setDepartments(departments) {
            this.departments = departments;
        },
    },
    getters: {
        getEditorMode: (state) => {
            return state.editor_mode;
        },
        getDepartments: (state) => {
            return state.departments;
        },
    },
});
