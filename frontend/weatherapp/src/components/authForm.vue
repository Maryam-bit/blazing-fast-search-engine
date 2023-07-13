<template>
    <div class="h-full flex flex-col items-center py-4">
      <div class="flex flex-col w-full gap-5 items-center">
        <p class="text-3xl font-thin">LOGIN</p>
        <form @submit.prevent="onLoginSubmit">
          <div class="h-full w-full flex flex-col gap-3 justify-center items-center">
            
            <div class="lg:w-80 flex flex-col">
              <input v-model="login.email" type="text" placeholder="Email" @input="debouncedValidateEmail('login')" :class="{'input-error': loginFormErrors.email}" class="input input-bordered input-primary w-full max-w-xs input-sm" />
              <p v-show="loginFormErrors.email" class="ml-2 text-xs font-light text-error">{{ loginFormErrors.email }}</p>
            </div>
            
            <div class="lg:w-80 flex flex-col">
              <input v-model="login.password" type="password" placeholder="Password" @input="debouncedValidatePassword('login')" :class="{'input-error': loginFormErrors.password}" class="input input-bordered input-primary w-full max-w-xs input-sm" />
              <p v-show="loginFormErrors.password" class="ml-2 text-xs font-light text-error">{{ loginFormErrors.password }}</p>
            </div>
            
            <button class="btn btn-primary lg:btn-wide">Login</button>
          </div>
        </form>
      </div>
  
      <div class="divider mt-8">OR</div>
  
      <div class="flex flex-col w-full gap-5 items-center">
        <p class="text-3xl font-thin">SIGN-UP</p>
        <form @submit.prevent="onSignupSubmit">
          <div class="h-full w-full flex flex-col gap-3 justify-center items-center">
  
            <div class="lg:w-80 flex flex-col">
              <input v-model="signup.username" type="text" placeholder="Username" @input="debouncedValidateUsername" :class="{'input-error': signupFormErrors.username}" class="input input-bordered input-primary w-full max-w-xs input-sm" />
              <p v-show="signupFormErrors.username" class="ml-2 text-xs font-light text-error">{{ signupFormErrors.username }}</p>
            </div>
  
            <div class="lg:w-80 flex flex-col">
              <input v-model="signup.email" type="email" placeholder="Email" @input="debouncedValidateEmail('signup')" :class="{'input-error': signupFormErrors.email}" class="input input-bordered input-primary w-full max-w-xs input-sm" />
              <p v-show="signupFormErrors.email" class="ml-2 text-xs font-light text-error">{{ signupFormErrors.email }}</p>
            </div>
  
            <div class="lg:w-80 flex flex-col">
              <input v-model="signup.password" type="password" placeholder="Password" @input="debouncedValidatePassword('signup')" :class="{'input-error': signupFormErrors.password}" class="input input-bordered input-primary w-full max-w-xs input-sm" />
              <p v-show="signupFormErrors.password" class="ml-2 text-xs font-light text-error">{{ signupFormErrors.password }}</p>
            </div>
  
            <button class="btn btn-primary lg:btn-wide">Signup</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue';
  import * as Yup from 'yup';
  import { debounce } from 'lodash';
  
  const loginFormSchema = Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().min(5).max(14).required(),
  });
  
  const signupFormSchema = Yup.object().shape({
    username: Yup.string().min(5).max(14).required(),
    email: Yup.string().required().email(),
    password: Yup.string().min(5).max(14).required(),
  });
  
  let loginFormErrors = reactive({});
  let signupFormErrors = reactive({});
  
  const login = reactive({
    email: '',
    password: '',
  });
  
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
  
  const onLoginSubmit = () => {
    loginFormSchema
      .validate(login, { abortEarly: false })
      .then(() => {
        loginFormErrors.email = '';
        loginFormErrors.password = '';
        alert('Logged in')
      })
      .catch((err) => {
        err.inner.forEach((error) => {
          loginFormErrors[error.path] = error.message;
        });
      });
  };
  
  const onSignupSubmit = () => {
    signupFormSchema
      .validate(signup, { abortEarly: false })
      .then(() => {
        signupFormErrors.username = '';
        signupFormErrors.email = '';
        signupFormErrors.password = '';
        // Perform signup logic
      })
      .catch((err) => {
        err.inner.forEach((error) => {
          signupFormErrors[error.path] = error.message;
        });
      });
  };
  
  </script>
  