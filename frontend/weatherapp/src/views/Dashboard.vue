<template>
  <navWrapper>
    <div>
      <section class="bg-gray-50">
        <div class="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div class="mx-auto max-w-xl text-center">
            <h1 class="text-3xl font-extrabold sm:text-5xl">
              Understand User Flow.
              <strong class="font-extrabold text-red-700 sm:block">
                Increase Conversion.
              </strong>
            </h1>

            <div>
              <button @click="pauseReceiving">Pause</button>
              <button @click="resumeReceiving">Resume</button>

              <ul>
                <li v-for="message in messages" :key="message">{{ message }}</li>
              </ul>
            </div>

            <div class="mt-8 flex flex-wrap justify-center gap-4">
              <a class="block w-full rounded bg-red-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                href="/get-started">
                Get Started
              </a>

              <a class="block w-full rounded px-12 py-3 text-sm font-medium text-red-600 shadow hover:text-red-700 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
                href="/about">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  </navWrapper>
</template>

<script setup>
import navWrapper from '../components/navWrapper.vue'
import { ref, onBeforeUnmount, onMounted, onUnmounted } from 'vue';
import { Client } from 'paho-mqtt';
import { v4 as uuidv4 } from 'uuid';

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
  const data = message.payloadString;
  console.log("🚀 ~ file: Dashboard.vue:77 ~ onMessageArrived ~ data:", data)
  messages.value.push(data);
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

onBeforeUnmount(() => {
  client.end(); // Disconnect from the MQTT broker when the component is unmounted
});
</script>