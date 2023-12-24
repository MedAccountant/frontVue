<template>
    <div class="min-h-screen flex items-center justify-center">
        <canvas id="myChart"></canvas>
    </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { Chart } from "chart.js/auto";
import { checkAuth } from "@/hooks/check_auth";
import { useStatisticStore } from "@/stores/statisticStore";
const statisticStore = useStatisticStore();
const { authStore } = checkAuth();

const dataToChart = reactive({
    labels: [],
    datasets: [],
});

let linkToFetch = statisticStore.getLink;
linkToFetch = linkToFetch.split("?");
linkToFetch = linkToFetch[0] + "/statistic?" + linkToFetch[1];
onMounted(async () => {
    try {
        const res = await fetch(linkToFetch, {
            headers: {
                Authorization: authStore.getToken,
            },
        });
        if (res.ok) {
            const data = await res.json();

            for (let item of data.statistic) {
                dataToChart.labels.push(item.dateTime.slice(0, 10));
                dataToChart.datasets.push(item.count);
            }
            // const config = {
            //     type: "line",
            //     options: {},
            //     data: {
            //         labels: dataToChart.labels,
            //         datasets: [
            //             {
            //                 data: dataToChart.datasets,
            //                 label: "Statistic",
            //                 fill: false,
            //                 borderColor: "rgb(75, 192, 192)",
            //             },
            //         ],
            //     },
            // };
            // const myChart = new Chart(document.getElementById("myChart"), {
            //     labels: dataToChart.labels,
            //     config,
            // });

            const ctx = document.getElementById("myChart");

            new Chart(ctx, {
                type: "line",
                data: {
                    labels: [...dataToChart.labels],
                    datasets: [
                        {
                            label: "Quantity of item",
                            data: [...dataToChart.datasets],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    } catch (error) {
        console.log(error);
    }
});
</script>

<style scoped>
canvas {
    width: 1000px !important;
    height: 600px !important;
}
</style>
