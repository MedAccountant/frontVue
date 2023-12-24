import { useJwtStore } from "@/stores/useJwtStore";

export function checkAuth() {
    const authStore = useJwtStore();

    // before mount send query to /checkAuth endpoint to check if token is valid
    // **** //

    const action = !authStore.getLoggedState
        ? "/login"
        : authStore.getRole.toLowerCase();
    return { authStore, action };
}
