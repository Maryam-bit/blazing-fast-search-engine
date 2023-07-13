<template>
  <navWrapper>
    <section class="absolute top-0 w-full bg-[url(@/assets/7800.jpg)] bg-contain bg-center ">
      <div class="absolute inset-0 bg-base-100/90">
      </div>

      <div class="relative lg:mx-32 px-4 py-24 sm:px-6 lg:flex min-h-screen flex-col lg:px-8 gap-10">
        <div class="flex flex-col justify-center items-center">
          <div class="px-2 py-1 rounded-t-lg bg-base-content/90 shadow-xl">
            <p class="text-lg font-bold text-base-100">LIVE CONTROLS</p>
          </div>
          <div
            class="h-20 flex rounded-lg w-60 bg-base-100 shadow-lg border-base-content/50 border-[1px] justify-between px-10 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" @click="pause"
              :class="{ 'stroke-success': !dataState, 'stroke-base-content': dataState }"
              class="w-16 fill-none cursor-pointer hover:stroke-success/40">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1" @click="play"
              :class="{ 'stroke-success': dataState, 'stroke-base-content': !dataState }"
              class="w-16 fill-none cursor-pointer hover:stroke-success/40">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
            </svg>
          </div>
          <div class="px-2 py-1 rounded-b-lg bg-base-100/90 shadow-xl">
            <p class="text-lg font-bold text-info">{{ (!dataState) ? "PAUSED" : "PLAYING" }}</p>
          </div>
        </div>

        <div class="flex-col lg:flex-row lg:flex gap-10 justify-center items-center">
          <div class="w-full h-full flex flex-col rounded-lg bg-base-200 border-[1px] p-3">
            <p class="text-2xl p-2 font-bold">Live Temperature</p>
            <div id="chart1">
              <apexchart type="line" height="350" ref="chart1" :options="chartOptions" :series="series"></apexchart>
            </div>
          </div>
          <div class="w-full h-full flex flex-col rounded-lg bg-base-200 border-[1px] p-3 lg:mt-0 mt-3">
            <p class="text-2xl p-2 font-bold">Live Humidity</p>
            <div id="chart2">
              <apexchart type="line" height="350" ref="chart2" :options="chartOptions2" :series="series2"></apexchart>
            </div>
          </div>
        </div>

        <HistoryChart />

      </div>
    </section>
  </navWrapper>
</template>

<script setup>
import navWrapper from '@/components/navWrapper.vue'
import { ref, onBeforeUnmount, onMounted, onUnmounted } from 'vue';
import { Client } from 'paho-mqtt';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment'
import HistoryChart from '@/components/HistoryChart.vue'

const dataState = ref(false);

const play = () => {
  dataState.value = true;
  resumeReceiving()
}

const pause = () => {
  dataState.value = false;
  pauseReceiving()
}

const data = ref([]);
const data2 = ref([]);

const series = ref([
  {
    name: 'Temperature',
    data: data,
  },
]);
const series2 = ref([
  {
    name: 'Humidity',
    data: data2,
  },
]);

const chartOptions = ref({
  chart: {
    type: 'area',
    stacked: false,
    height: 350,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true,
    },
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000
      }
    },
    toolbar: {
      autoSelected: 'zoom',
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  title: {
    align: 'left',
  },
  fill: {
    type: 'solid',
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
  yaxis: {
    title: {
      text: 'Celcius',
    },
  },
  xaxis: {
    type: 'time',
    labels: {
      format: 'hh:mm:ss',
    }
  },
  tooltip: {
    shared: false,
    x: {
      format: 'hh:mm:ss',
    }
  },
});

const chartOptions2 = ref({
  chart: {
    type: 'area',
    stacked: false,
    height: 350,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true,
    },
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000
      }
    },
    toolbar: {
      autoSelected: 'zoom',
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
  },
  title: {
    align: 'left',
  },
  fill: {
    type: 'solid',
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
  yaxis: {
    title: {
      text: 'gm^3',
    },
  },
  xaxis: {
    type: 'time',
    labels: {
      format: 'hh:mm:ss',
    }
  },
  tooltip: {
    shared: false,
    x: {
      format: 'hh:mm:ss',
    }
  },
});


const messages = ref([]);
let client;

const connectToBroker = () => {
  // Replace 'your-broker-url' and 'your-client-id' with your MQTT broker and client ID
  client = new Client('ws://broker.hivemq.com:8000/mqtt', `client_${Date.now()}_${uuidv4()}`);
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  client.connect({
    onSuccess: onConnect,
    reconnect: true,
  });
};

const onConnect = () => {
  console.log('Connected to MQTT broker');
  client.subscribe('Weather_Data');
};

const onConnectionLost = (responseObject) => {
  if (responseObject.errorCode !== 0) {
    console.log('Connection lost:', responseObject.errorMessage);
  }
};

const onMessageArrived = (message) => {
  if (!dataState.value || message.retained) {
    return
  }
  const dataMQTT = message.payloadString;
  messages.value.push(dataMQTT);

  const newData = [{ x: moment().format('hh:mm:ss'), y: Math.ceil(JSON.parse(dataMQTT).temperature) }, { x: moment().format('hh:mm:ss'), y: Math.ceil(JSON.parse(dataMQTT).humidity) }];
  data.value.push(newData[0]);
  data2.value.push(newData[1]);

  // Limit the data length to a certain number of points
  const maxLength = 20;
  if (data.value.length > maxLength) {
    data.value.shift();
    data2.value.shift();
  }

  // Update the series data
  series.value[0].data = data.value;
  series2.value[0].data = data2.value;
};

const pauseReceiving = () => {
  client.unsubscribe('Weather_Data');
};

const resumeReceiving = () => {
  client.subscribe('Weather_Data');
};

onMounted(() => {
  connectToBroker();
});

onUnmounted(() => {
  client.disconnect();
});
</script>