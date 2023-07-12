<template>
    <div class="h-full flex flex-col items-center py-4 bg-base-100 px-4 rounded-md shadow-md shadow-primary transition-opacity duration-300">
        <div class="flex flex-col w-full gap-8 items-center">
            <p class="text-3xl font-thin">LOGIN</p>
            <form @submit.prevent="onLoginSubmit">
                <div class="h-full w-full flex flex-col gap-8 justify-center items-center">

                    <div class="flex flex-col gap-3">
                        <div class="lg:w-80 flex flex-col">
                            <input v-model="login.email" type="text" placeholder="Email" autocomplete="email"
                                @input="debouncedValidateEmail('login')" :class="{ 'input-error': loginFormErrors.email }"
                                class="input input-bordered input-primary w-full max-w-xs input-sm" />
                            <p v-show="loginFormErrors.email" class="ml-2 text-xs font-light text-error">{{
                                loginFormErrors.email }}</p>
                        </div>
                        <div class="lg:w-80 flex flex-col">
                            <input v-model="login.password" type="password" placeholder="Password"
                                @input="debouncedValidatePassword('login')" :class="{ 'input-error': loginFormErrors.password }"
                                class="input input-bordered input-primary w-full max-w-xs input-sm" />
                            <p v-show="loginFormErrors.password" class="ml-2 text-xs font-light text-error">{{
                                loginFormErrors.password }}</p>
                        </div>
                    </div>

                    <button class="btn btn-primary lg:btn-wide">Login</button>
                </div>
                <p class="text-center text-sm font-light font-base-content my-3">
                    Dont have an account?
                    <router-link to="/signup">
                        <a class="link link-info">Signup</a>
                    </router-link>
                </p>
            </form>
        </div>
    </div>
</template>
  
<script setup>
import { reactive } from 'vue';
import * as Yup from 'yup';
import { debounce } from 'lodash';
import { userLogin } from '../services/apiService'
import toastMessage from '../utils/toasts'
import { useRouter } from 'vue-router';

const router = useRouter();

const loginFormSchema = Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().min(5).max(14).required(),
});


let loginFormErrors = reactive({});

const login = reactive({
    email: '',
    password: '',
});


const debouncedValidateEmail = debounce((form) => {
    const emailField = form === 'login' ? login.email : signup.email;
    const errors = form === 'login' ? loginFormErrors : signupFormErrors;
    const schema = form === 'login' ? loginFormSchema : signupFormSchema;

    schema
        .validateAt('email', { email: emailField })
        .then(() => {
            errors.email = '';
        })
        .catch((err) => {
            errors.email = err.message;
        });
}, 300);

const debouncedValidatePassword = debounce((form) => {
    const passwordField = form === 'login' ? login.password : signup.password;
    const errors = form === 'login' ? loginFormErrors : signupFormErrors;
    const schema = form === 'login' ? loginFormSchema : signupFormSchema;

    schema
        .validateAt('password', { password: passwordField })
        .then(() => {
            errors.password = '';
        })
        .catch((err) => {
            errors.password = err.message;
        });
}, 300);

const onLoginSubmit = () => {
    loginFormSchema
        .validate(login, { abortEarly: false })
        .then(async () => {
            loginFormErrors.email = '';
            loginFormErrors.password = '';
            
            // make api call to login, load in toast
            // if successful, redirect to dashboard page
            // if unsuccessful, show error message as toast
            try {
                const resp = await userLogin(login.email, login.password)
                if(resp.status === 200){
                    toastMessage("success", "success")
                    console.log(resp)
                    localStorage.setItem('jwt', resp.data.token)
                    router.push('/dashboard');
                }
            } catch (error) {
                console.log("error", error)
                toastMessage(error, 'error');
            }
        })
};

</script>
  
  