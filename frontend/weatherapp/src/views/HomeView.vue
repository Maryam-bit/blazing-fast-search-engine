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

        <div v-if="$route.path === '/'">
          <button>Get Started</button>
        </div>

        <div v-else-if="$route.path === '/login'">
          <LoginForm />
        </div>

        <div v-else-if="$route.path === '/signup'">
          <SignupForm />
        </div>

        <!-- Weather widget -->
        <WeatherWidget />
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
import WeatherWidget from '../components/WeatherWidget.vue'
import { ref, onMounted, computed, watch } from 'vue'

import { useRoute } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import SignupForm from '../components/SignupForm.vue'


const learn_more_modal = ref(false)
const auth_modal = ref(false)

const toggleModal = () => learn_more_modal.value = !learn_more_modal.value
const toggleAuthModal = () => auth_modal.value = !auth_modal.value

</script>