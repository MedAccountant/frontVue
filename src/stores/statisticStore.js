import { defineStore } from "pinia";

export const useStatisticStore = defineStore("statisticStore", {
    state: () => {
        return {
            linkToFetch: "",
        };
    },
    actions: {
        setLink(link) {
            this.linkToFetch = link;
        },
    },
    getters: {
        getLink: (state) => {
            return state.linkToFetch;
        },
    },
});
