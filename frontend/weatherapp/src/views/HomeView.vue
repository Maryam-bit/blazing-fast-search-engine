<template>
  <navWrapper>
    <section
      class="absolute top-0 w-full bg-[url(@/assets/imagebg.png)] bg-cover bg-center bg-no-repeat">
      <div class="absolute inset-0 bg-base-100/75">
      </div>

      <div
        class="relative lg:mx-32 px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center justify-between lg:px-8 h-screen gap-10">
        <div v-if="$route.path === '/'" class="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right lg:mb-0 mb-10">
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
            <router-link to="/login">
              <a class="btn btn-primary text-primary-content block w-full rounded px-12 py-3 text-sm font-medium shadow focus:outline-none sm:w-auto">
                Get Started
              </a>
            </router-link>

            <a @click="toggleModal"
              class="btn btn-secondary text-secondary-content block w-full rounded px-12 py-3 text-sm font-medium shadow focus:outline-none focus:ring sm:w-auto">
              Learn More
            </a>
          </div>
        </div>
        
        <div v-if="$route.path === '/login'">
          <LoginForm />
        </div>

        <div v-else-if="$route.path === '/signup'">
          <SignupForm />
        </div>

        <!-- Weather widget -->
        <div class="flex h-full items-center">
          <WeatherWidget />
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

  </navWrapper>
</template>

<script setup>
import navWrapper from '@/components/navWrapper.vue'
import BaseModal from '@/components/BaseModal.vue'
import WeatherWidget from '@/components/WeatherWidget.vue'
import { ref} from 'vue'

import LoginForm from '@/components/LoginForm.vue'
import SignupForm from '@/components/SignupForm.vue'


const learn_more_modal = ref(false)
const auth_modal = ref(false)

const toggleModal = () => learn_more_modal.value = !learn_more_modal.value

</script>