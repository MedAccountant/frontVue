import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useJwtStore } from "../stores/useJwtStore";
import { API_URL } from "@/constants";

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

export function useLogin() {
    const router = useRouter();
    const tokenStore = useJwtStore();
    const login_info = reactive({ username: "", password: "" });
    const login_success = reactive({ result: true, bounce: false });

    async function send_login_data() {
        const data = {
            login: login_info.username,
            password: login_info.password,
        };
        console.log(data);
        try {
            const response = await fetch(`${API_URL}/auth`, {
                body: JSON.stringify(data),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const text = await response.json();

            const token = text.jwtToken;
            console.log(text);
            const jwt_info = parseJwt(token);
            if (jwt_info) {
                tokenStore.setPayload(jwt_info);
            }
            tokenStore.setToken(token);
            login_success.result = true;
        } catch (error) {
            login_success.result = false;
            login_success.bounce = true;
            setTimeout(() => {
                login_success.bounce = false;
            }, 1200);
            console.error("Login failed", error);
        } finally {
            if (login_success.result) {
                router.push(`/${tokenStore.getRole.toLowerCase()}`);
            }
        }
    }
    return { login_info, send_login_data, login_success };
}
