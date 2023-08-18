<template>
   <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="login-page">
        <form class="card mt-5">
            <div class="card-header">
                <h1 class="text-center">Login</h1>
            </div>
            <div class="card-body">
                <Input id="email" label="E-mail" v-model="email" />
                <Input id="password" type="password" label="Password" v-model="password" />

                <div v-if="failMessage" class="alert alert-danger text-center">
                    {{ failMessage }}
                </div>

                <div class="text-center">
                    <button class="btn btn-primary" :disabled="isDisabled || apiProgress" @click.prevent="submit">
                        <!-- <SpinnerLoading v-if="apiProgress" /> -->
                        Login
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import Input from "../Input.vue"
// import SpinnerLoading from '../SpinnerLoading.vue'

import { login } from "../../api/apiCalls"
export default {
    name: 'LoginPage',
    components: {
        Input,
        // SpinnerLoading,
    },
    data() {
        return {
            email: '',
            password: '',
            apiProgress: false,
            failMessage: undefined,
        }
    },
    computed: {
        isDisabled() {
            return !(this.email && this.password)
        }
    },
    methods: {
        async submit() {
            this.apiProgress = true
            try{
                const response = await login({email: this.email, password: this.password})

                const data = {
                    ...response.data,
                    token: `Bearer ${response.data.token}`
                }
                this.$router.push('/')
                this.$store.commit('loginSuccess', data)
            } catch(error){
                this.failMessage = error.response.data.message
            }
            this.apiProgress = false
        }
    },
    watch: {
        email() {
            this.failMessage = undefined
        },
        password() {
            this.failMessage = undefined
        }
    }

}
</script>