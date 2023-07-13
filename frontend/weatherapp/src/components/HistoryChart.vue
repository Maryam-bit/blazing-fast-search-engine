<template>
    <div class="flex flex-col w-full justify-center">
        <div class="h-20 flex justify-between">
            <div class="flex items-center gap-4">
                <div class="join">
                    <div class="flex gap-2 justify-center items-center p-2 bg-base-100 rounded-l-md rounded-r-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-base font-medium text-base-content">Start Time</span>
                    </div>
                    <input v-model="start" className="input input-bordered w-32 join-item" placeholder="1h" />
                </div>

                <div class="join">
                    <div class="flex gap-2 justify-center items-center p-2 bg-base-100 rounded-l-md rounded-r-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-base font-medium text-base-content">End Time</span>
                    </div>
                    <input v-model="end" v className="input input-bordered w-32 join-item" placeholder="2h" />
                </div>

                <button @click="searchData" className="btn">Search</button>
            </div>
            <div class="flex items-center">
                <button @click="getAlldata" className="btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Refresh All Data
                </button>
            </div>
        </div>
        <div class="w-full h-full flex flex-col rounded-lg bg-base-200 border-[1px] p-3 lg:mt-0 mt-3">
            <p class="text-2xl p-2 font-bold">Historic Data</p>
            <div id="chart">
                <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import moment from 'moment'
import toastMessage from '@/utils/toasts'
import { getSensorData, getRangedData } from '@/services/apiService'

const responseData = ref([])
const start = ref("")
const end = ref("")

const searchData = async () => {
    if(start.value == "" || end.value == "") {
        return
    }
    try {
        const resp = await getRangedData(start.value, end.value); // Call your API function to get the data
        responseData.value = resp.data;
        console.log("🚀 ~ getAlldata ~ responseData:", responseData.value);
        console.log(resp);

        // Update the series data based on the new response data
        series.value[0].data = responseData.value.map((item) => [
            moment(item._time).format('YYYY-MM-DD HH:mm:ss'),
            item.temperature,
        ]);
        series.value[1].data = responseData.value.map((item) => [
            moment(item._time).format('YYYY-MM-DD HH:mm:ss'),
            item.humidity,
        ]);
    } catch (error) {
        console.error(error);
        console.log("🚀 ~ file: HistoryChart.vue:85 ~ searchData ~ error:", error)
        toastMessage("Incorrect Range", "error")
    }
}

const getAlldata = async () => {
    try {
        const resp = await getSensorData(1000); // Call your API function to get the data
        responseData.value = resp.data;
        console.log("🚀 ~ getAlldata ~ responseData:", responseData.value);
        console.log(resp);

        // Update the series data based on the new response data
        series.value[0].data = responseData.value.map((item) => [
            moment(item._time).format('YYYY-MM-DD HH:mm:ss'),
            item.temperature,
        ]);
        series.value[1].data = responseData.value.map((item) => [
            moment(item._time).format('YYYY-MM-DD HH:mm:ss'),
            item.humidity,
        ]);
    } catch (error) {
        console.error(error);
    }
};

const series = ref([
    {
        name: 'Temperature',
        type: 'line',
        data: [],
    },
    {
        name: 'Humidity',
        type: 'line',
        data: [],
    },
]);

const chartOptions = ref({
    chart: {
        height: 350,
        type: 'line',
    },
    stroke: {
        curve: 'smooth',
    },
    fill: {
        type: 'solid',
        opacity: [0.35, 1],
    },
    markers: {
        size: 0,
    },
    yaxis: [
        {
            title: {
                text: 'Temperature',
            },
            labels: {
                formatter: function (val) {
                    return val + '%';
                },
            }
        },
        {
            opposite: true,
            title: {
                text: 'Humidity',
            },
            labels: {
                formatter: function (val) {
                    return val + '%';
                },
            }
        },
    ],
    xaxis: {
        type: 'datetime',
        labels: {
            format: 'hh:mm:ss',
        }
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: function (y) {
                if (typeof y !== "undefined") {
                    return y.toFixed(0)
                }
                return y;
            }
        }
    }
});

</script>