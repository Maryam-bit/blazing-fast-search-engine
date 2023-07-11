<template>
  <navWrapper>
    <section
      class="absolute top-0 w-full bg-[url(https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)] bg-cover bg-center bg-no-repeat">
      <div class="absolute inset-0 bg-base-100/75">
      </div>

      <div
        class="relative lg:mx-32 px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center justify-between lg:px-8 h-screen gap-10">
        <div class="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right lg:mb-0 mb-10">
          <h1 class="text-3xl font-extrabold sm:text-5xl">
            Your very own

            <strong class="block font-extrabold text-primary">
              Weather Station
            </strong>
          </h1>

          <p class="mt-4 max-w-lg sm:text-xl/relaxed">
            Signup now to experience amazing dashboard for live
            weather sensor data
          </p>

          <div class="mt-8 flex flex-wrap gap-4 text-center justify-center">
            <a @click="toggleAuthModal"
              class="btn btn-primary text-primary-content block w-full rounded px-12 py-3 text-sm font-medium shadow focus:outline-none sm:w-auto">
              Get Started
            </a>

            <a @click="toggleModal"
              class="btn btn-secondary text-secondary-content block w-full rounded px-12 py-3 text-sm font-medium shadow focus:outline-none focus:ring sm:w-auto">
              Learn More
            </a>
          </div>
        </div>

        <!-- Weather Widget -->
        <div class="flex lg:w-[400px] h-2/3 perspective">
          <div v-if="loading" class="spinner justify-center items-center flex w-full">
            <span className="loading loading-spinner text-primary"></span>
          </div>

          <div class="w-full h-full transform rotate-y" v-else>
            <div
              class="flex flex-col bg-base-100/90 rounded-lg w-full h-full border-base-300 border-[1px] shadow-[5px_2px_0px_theme('colors.primary')]">
              <div class="flex justify-between px-5 py-5 w-full lg:h-64">
                <div class="flex flex-col gap-1 justify-center">
                  <p class="text-5xl">{{ weather_data.data.current_weather.temperature }}&deg;</p>
                  <div class="w-full px-1 gap-2 flex flex-col">
                    <p class="text-md font-light">{{ current_weather.description }}</p>
                    <p class="text-md font-thin">{{ weather_data.data.daily.temperature_2m_max[0] }}&deg; /
                      {{ weather_data.data.daily.temperature_2m_min[0] }}&deg;</p>
                  </div>
                </div>

                <div class="flex items-center justify-center w-1/3">
                  <img
                    class="w-36 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md"
                    :src="current_weather.url" />
                </div>
              </div>
              <div class="flex flex-col w-full h-full">
                <div class=" flex justify-center items-center w-full h-full px-2">
                  <ul class="flex justify-between w-full">
                    <li v-for="item in daily_weather" :key="item"
                      class="h-20 flex flex-col gap-1 justify-center items-center">
                      <p class="text-xs font-light">{{ item.time }}</p>
                      <img :src=item.weather_img />
                      <p class="text-xs font-light">{{ item.temperature_2m_max }}&deg;</p>
                      <div class="flex gap-1 items-center">
                        <svg fill="#000000" width="9px" viewBox="0 -5 32 50" version="1.1"
                          xmlns="http://www.w3.org/2000/svg">
                          <path class="fill-base-content" fill-opacity="0.7"
                            d="M15.95 31.959c-6.041 0-10.956-4.848-10.956-10.806 0-6.959 9.739-20.151 10.153-20.71 0.188-0.252 0.482-0.402 0.796-0.404 0.349-0.003 0.611 0.144 0.802 0.393 0.419 0.548 10.261 13.507 10.261 20.721 0 5.959-4.96 10.806-11.056 10.806zM15.961 2.74c-2.325 3.302-8.967 13.189-8.967 18.413 0 4.855 4.018 8.806 8.956 8.806 4.993 0 9.056-3.95 9.056-8.806 0-5.418-6.692-15.157-9.045-18.413z">
                          </path>
                        </svg>
                        <p class="text-xs font-thin">{{ item.precipitation_sum }}</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="w-full h-5 flex justify-end items-center px-2">
                  <p class="text-xs font-thin">{{ current_weather.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <BaseModal :modal-active="learn_more_modal" @close-modal="toggleModal">
      <div class="text-black">
        <h1 class="text-2xl mb-1">About:</h1>
        <p class="mb-4">
          The Local Weather allows you to track the current and
          future weather of cities of your choosing.
        </p>
        <h2 class="text-2xl">How it works:</h2>
        <ol class="list-decimal list-inside mb-4">
          <li>
            Search for your city by entering the name into the
            search bar.
          </li>
          <li>
            Select a city within the results, this will take
            you to the current weather for your selection.
          </li>
          <li>
            Track the city by clicking on the "+" icon in the
            top right. This will save the city to view at a
            later time on the home page.
          </li>
        </ol>

        <h2 class="text-2xl">Removing a city</h2>
        <p>
          If you no longer wish to track a city, simply select
          the city within the home page. At the bottom of the
          page, there will be am option to delete the city.
        </p>
      </div>
    </BaseModal>

    <AuthModal :modal-active="auth_modal" @close-modal="toggleAuthModal">
      <AuthForm />
    </AuthModal>
  </navWrapper>
</template>

<script setup>
import navWrapper from '../components/navWrapper.vue'
import BaseModal from '../components/BaseModal.vue'
import AuthModal from '../components/authModal.vue'
import AuthForm from '../components/authForm.vue'
import { ref, onMounted, computed, watch } from 'vue'

import moment from 'moment'
import axios from 'axios'

const weather_codes = {
  0: {
    desc: 'Clear sky',
    img_code_day: '01d',
    img_code_night: '01n',
  },
  1: {
    desc: 'Mainly clear',
    img_code_day: '02d',
    img_code_night: '02n',
  },
  2: {
    desc: 'Partly cloudy',
    img_code_day: '02d',
    img_code_night: '02n',
  },
  3: {
    desc: 'Overcast',
    img_code_day: '04d',
    img_code_night: '04n',
  },
  45: {
    desc: 'Fog and depositing rime fog',
    img_code_day: '50d',
    img_code_night: '50n',
  },
  48: {
    desc: 'Fog and depositing rime fog',
    img_code_day: '50d',
    img_code_night: '50n',
  },
  51: {
    desc: 'Drizzle: Light intensity',
    img_code_day: '09d',
    img_code_night: '09n',
  },
  53: {
    desc: 'Drizzle: Moderate intensity',
    img_code_day: '09d',
    img_code_night: '09n',
  },
  55: {
    desc: 'Drizzle: Dense intensity',
    img_code_day: '09d',
    img_code_night: '09n',
  },
  56: {
    desc: 'Freezing Drizzle: Light intensity',
    img_code_day: '09d',
    img_code_night: '09n',
  },
  57: {
    desc: 'Freezing Drizzle: Dense intensity',
    img_code_day: '09d',
    img_code_night: '09n',
  },
  61: {
    desc: 'Rain: Slight intensity',
    img_code_day: '10d',
    img_code_night: '10n',
  },
  63: {
    desc: 'Rain: Moderate intensity',
    img_code_day: '10d',
    img_code_night: '10n',
  },
  65: {
    desc: 'Rain: Heavy intensity',
    img_code_day: '10d',
    img_code_night: '10n',
  },
  66: {
    desc: 'Freezing Rain: Light intensity',
    img_code_day: '13d',
    img_code_night: '13n',
  },
  67: {
    desc: 'Freezing Rain: Heavy intensity',
    img_code_day: '13d',
    img_code_night: '13n',
  },
  71: {
    desc: 'Snow fall: Slight intensity',
    img_code_day: '13d',
    img_code_night: '13n',
  },
  73: {
    desc: 'Snow fall: Moderate intensity',
    img_code_day: '13d',
    img_code_night: '13n',
  },
  75: {
    desc: 'Snow fall: Heavy intensity',
    img_code_day: '13d',
    img_code_night: '13n',
  },
  77: {
    desc: 'Snow grains',
    img_code_day: '13d',
    img_code_night: '13n',
  },
  80: {
    desc: 'Rain showers: Slight intensity',
    img_code_day: '09d',
    img_code_night: '09n',
  },
  81: {
    desc: 'Rain showers: Moderate intensity',
    img_code_day: '09d',
    img_code_night: '09n',
  },
  82: {
    desc: 'Rain showers: Violent intensity',
    img_code_day: '09d',
    img_code_night: '09n',
  },
  85: {
    desc: 'Snow showers: Slight intensity',
    img_code_day: '13d',
    img_code_night: '13n',
  },
  86: {
    desc: 'Snow showers: Heavy intensity',
    img_code_day: '13d',
    img_code_night: '13n',
  },
  95: {
    desc: 'Thunderstorm: Slight or moderate',
    img_code_day: '11d',
    img_code_night: '11n',
  },
  96: {
    desc: 'Thunderstorm with slight hail',
    img_code_day: '11d',
    img_code_night: '11n',
  },
  99: {
    desc: 'Thunderstorm with heavy hail',
    img_code_day: '11d',
    img_code_night: '11n',
  },
};

const loading = ref(true);
const learn_more_modal = ref(false)
const auth_modal = ref(true)
const weather_data = ref({})

const toggleModal = () => learn_more_modal.value = !learn_more_modal.value
const toggleAuthModal = () => auth_modal.value = !auth_modal.value
let coords = ref({})

onMounted(async () => {
  coords.value = await axios.get('http://ip-api.com/json')
  let { lat, lon } = coords.value.data

  coords = {
    lat: lat,
    lon: lon
  }
  console.log(coords)

  // Weather: open-meteo
  weather_data.value = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&current_weather=true`)
  console.log(weather_data.value.data)
  loading.value = false
})

const current_weather = computed(() => {
  if (loading.value) {
    return 'Loading...'
  }
  if (weather_data.value.data.length === 0) {
    return 'No weather data'
  }

  if (!loading.value) {
    const { is_day, weathercode, time } = weather_data.value.data.current_weather;
    const imgCode = is_day ? weather_codes[weathercode].img_code_day : weather_codes[weathercode].img_code_night;
    const desc = weather_codes[weathercode].desc
    const formatTime = moment(time).format('MMMM Do YYYY, h:mm a')
    console.log(formatTime)
    return { url: `https://openweathermap.org/img/wn/${imgCode}@4x.png`, description: desc, time: formatTime };
  }
})

const daily_weather = computed(() => {
  const { time, weathercode, temperature_2m_max, precipitation_sum } = weather_data.value.data.daily;
  let dailyWeather = [];

  for (let i = 0; i < time.length; i++) {
    dailyWeather.push(
      {
        weather_img: `https://openweathermap.org/img/wn/${weather_codes[weathercode[i]].img_code_day}@4x.png`,
        temperature_2m_max: temperature_2m_max[i],
        precipitation_sum: precipitation_sum[i],
        time: moment(time[i]).format('DD')
      }
    )
  }

  return dailyWeather;
});

</script>