import { useJwtStore } from "@/stores/useJwtStore";

export function checkAuth() {
    const authStore = useJwtStore();
    const action = !authStore.getLoggedState
        ? "/login"
        : authStore.getRole.toLowerCase();
    return { authStore, action };
}
