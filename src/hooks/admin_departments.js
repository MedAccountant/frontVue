import { onMounted, ref, reactive } from "vue";
import { API_URL } from "@/constants";
import { checkAuth } from "./check_auth";

export function departmentManagement() {
    const { authStore } = checkAuth();
    const departments = ref([]);
    const newDepartmentName = reactive({
        value: "",
        ready: true,
    });
    onMounted(async () => {
        try {
            const response = await fetch(`${API_URL}Vista/admin/departments`, {
                method: "GET",
                headers: {
                    Authorization: authStore.getToken,
                },
            });
            const data = await response.json();
            for (let item of data) {
                departments.value.push(item);
            }
        } catch (error) {
            console.log(error);
        }
    });

    async function addNewDepartment() {
        newDepartmentName.value = newDepartmentName.value.trim();
        if (newDepartmentName.value.length > 0) {
            try {
                const response = await fetch(
                    `${API_URL}Vista/admin/departments`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            departmentName: newDepartmentName.value,
                            workingMarker: true,
                        }),
                        headers: {
                            "Content-type": "application/json",
                            Authorization: authStore.getToken,
                        },
                    }
                );
                if (response) {
                    departments.value.push({
                        departmentName: newDepartmentName.value,
                        workingMarker: true,
                    });
                }
            } catch (error) {
                console.log(error);
            } finally {
                newDepartmentName.ready = true;
                newDepartmentName.value = "";
            }
        } else {
            newDepartmentName.ready = false;
        }
    }
    return { addNewDepartment, departments, newDepartmentName };
}
