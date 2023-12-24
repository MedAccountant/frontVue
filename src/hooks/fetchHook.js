import { checkAuth } from "./check_auth";
import { useRouter } from "vue-router";
export async function fetchData({
    url = "",
    methodOption = "GET",
    headersData = {},
    bodyData = {},
}) {
    const router = useRouter();
    const { authStore } = checkAuth();
    const fetchOptions = {
        method: methodOption,
        headers: {
            Authorization: authStore.getToken,
            ...headersData,
        },
    };

    if (methodOption !== "GET") {
        fetchOptions.body = bodyData;
    }
    try {
        const response = await fetch(url, fetchOptions);
        if (response.ok) {
            const dataToSend = await response.json();

            return {
                ok: true,
                data: dataToSend,
            };
        } else if (response.status === 401) {
            authStore.removeToken;
            alert("Your session has expired. Please login again.");
            router.push("/login");
            return {
                ok: false,
                data: undefined,
            };
        }
    } catch (error) {
        throw error;
    }
}
