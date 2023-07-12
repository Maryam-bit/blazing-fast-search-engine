<template>
    <div class="h-full flex flex-col items-center py-4 bg-base-100 px-4 rounded-md shadow-xl">
        <div class="flex flex-col w-full gap-8 items-center">
            <p class="text-3xl font-thin">SIGN-UP</p>
            <form @submit.prevent="onSignupSubmit">
                <div class="h-full w-full flex flex-col gap-8 justify-center items-center">

                    <div class="flex flex-col gap-3">
                        <div class="lg:w-80 flex flex-col">
                            <input v-model="signup.username" type="text" placeholder="Username"
                                @input="debouncedValidateUsername" :class="{ 'input-error': signupFormErrors.username }"
                                class="input input-bordered input-primary w-full max-w-xs input-sm" />
                            <p v-show="signupFormErrors.username" class="ml-2 text-xs font-light text-error">{{
                                signupFormErrors.username }}</p>
                        </div>
                        <div class="lg:w-80 flex flex-col">
                            <input v-model="signup.email" type="email" placeholder="Email"
                                @input="debouncedValidateEmail('signup')" :class="{ 'input-error': signupFormErrors.email }"
                                class="input input-bordered input-primary w-full max-w-xs input-sm" />
                            <p v-show="signupFormErrors.email" class="ml-2 text-xs font-light text-error">{{
                                signupFormErrors.email }}</p>
                        </div>
                        <div class="lg:w-80 flex flex-col">
                            <input v-model="signup.password" type="password" placeholder="Password"
                                @input="debouncedValidatePassword('signup')"
                                :class="{ 'input-error': signupFormErrors.password }"
                                class="input input-bordered input-primary w-full max-w-xs input-sm" />
                            <p v-show="signupFormErrors.password" class="ml-2 text-xs font-light text-error">{{
                                signupFormErrors.password }}</p>
                        </div>
                    </div>

                    <button class="btn btn-primary lg:btn-wide">Signup</button>
                </div>
                <p class="text-center text-sm font-light font-base-content my-3">
                    Already have an account?
                    <router-link to="/login">
                        <a class="link link-info">Login</a>
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
import toastMessage from '../utils/toasts'
import { userRegister } from '../services/apiService'
import { useRouter } from 'vue-router';

const router = useRouter();

const signupFormSchema = Yup.object().shape({
    username: Yup.string().min(5).max(14).required(),
    email: Yup.string().required().email(),
    password: Yup.string().min(5).max(14).required(),
});

let signupFormErrors = reactive({});

const signup = reactive({
    username: '',
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

const debouncedValidateUsername = debounce(() => {
    signupFormSchema
        .validateAt('username', signup)
        .then(() => {
            signupFormErrors.username = '';
        })
        .catch((err) => {
            signupFormErrors.username = err.message;
        });
}, 300);

const onSignupSubmit = () => {
    signupFormSchema
        .validate(signup, { abortEarly: false })
        .then(async () => {
            signupFormErrors.username = '';
            signupFormErrors.email = '';
            signupFormErrors.password = '';
            console.log(signup)

            // make api call to signup, load in toast
            // if successful, redirect to login page
            // if unsuccessful, show error message as toast
            try {
                const resp = await userRegister(signup.username, signup.email, signup.password)
                console.log("🚀 ~ file: SignupForm.vue:122 ~ .then ~ resp:", resp)
                if(resp.status == 201){
                    toastMessage("success", "success")
                    console.log(resp)
                    router.push('/login');
                }
            } catch (error) {
                console.log("error", error)
                toastMessage(error, 'error');
            }
            
        })
};
</script>