<template>
    <div class="min-h-screen w-full flex justify-center items-center gap-5">
        <select
            v-model="fileToUpload.types.selectedType"
            class="p-3 bg-slate-100 bg-opacity-40 border-2 border-violet-950"
        >
            <option disabled value="">Select document type</option>
            <option
                v-for="types of fileToUpload.types.variants"
                :key="types"
                :value="types"
            >
                {{ types }}
            </option>
        </select>
        <div class="flex flex-col gap-2">
            <form method="post" enctype="multipart/form-data">
                <label class="input-file">
                    <input
                        type="file"
                        name="file"
                        @change="fileToUpload.file = $event.target.files[0]"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    />

                    <span class="input-file-btn" v-if="fileToUpload.file">{{
                        fileToUpload.file.name
                    }}</span>
                    <span class="input-file-btn" v-else> Chose file </span>

                    <span class="input-file-text">
                        Accepted data types: xlsx, csv</span
                    >
                </label>
            </form>
        </div>
        <button
            class="p-3 bg-slate-100 bg-opacity-40 text-violet-950"
            v-if="fileToUpload.file && fileToUpload.types.selectedType"
            @click="uploadFile"
        >
            Upload
        </button>
    </div>
</template>

<script setup>
import { reactive } from "vue";
import { API_URL } from "@/constants";
import { checkAuth } from "@/hooks/check_auth.js";
const { authStore } = checkAuth();

const fileToUpload = reactive({
    file: null,
    types: {
        variants: ["ActualData", "WriteOffData", "AdmissionData"],
        selectedType: "",
    },
});

async function uploadFile() {
    try {
        const formData = new FormData();
        formData.append(
            "file",
            fileToUpload.file,
            fileToUpload.file.name.split(".")[0] +
                new Date().getTime().toString() +
                "." +
                fileToUpload.file.name.split(".")[1]
        );
        console.log(formData.get("file"));
        const response = await fetch(
            `${API_URL}Vista/DataProducer/files?doc_type=${fileToUpload.types.selectedType}`,
            {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: authStore.getToken,
                },
            }
        );
        console.log(response);
        if (response.status < 300) {
            alert("Uploaded");
        }
    } catch (error) {
        console.log(error);
        alert("Error");
    } finally {
        fileToUpload.file = null;
        fileToUpload.types.selectedType = "";
    }
}
</script>

<style scoped>
.input-file {
    position: relative;
    display: inline-block;
}
.input-file-btn {
    position: relative;
    display: inline-block;
    cursor: pointer;
    outline: none;
    text-decoration: none;
    font-size: 14px;
    vertical-align: middle;
    color: rgb(255 255 255);
    text-align: center;
    border-radius: 4px;
    background-color: #419152;
    line-height: 22px;
    height: 40px;
    padding: 10px 20px;
    box-sizing: border-box;
    border: none;
    margin: 0;
    transition: background-color 0.2s;
}
.input-file-text {
    padding: 0 10px;
    line-height: 40px;
    display: inline-block;
}
.input-file input[type="file"] {
    position: absolute;
    z-index: -1;
    opacity: 0;
    display: block;
    width: 0;
    height: 0;
}

/* Focus */
.input-file input[type="file"]:focus + .input-file-btn {
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Hover/active */
.input-file:hover .input-file-btn {
    background-color: #59be6e;
}
.input-file:active .input-file-btn {
    background-color: #2e703a;
}

/* Disabled */
.input-file input[type="file"]:disabled + .input-file-btn {
    background-color: #eee;
}
</style>
