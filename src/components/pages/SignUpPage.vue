<template>
    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="signup-page">
        <form v-if="!signUpSuccess" class="card mt-5" data-testid="form-sign-up">
            <div class="card-header">
                <h1 class="text-center">{{$t('signUp')}}</h1>
            </div>
            <div class="card-body">
                <Input id="username" :label="$t('username')" v-model="username" :help="errors ? errors.username : ''" />
                <Input id="email" :label="$t('email')" v-model="email" :help="errors ? errors.email : ''" />
                <Input id="password" type="password" :label="$t('password')" v-model="password" :help="errors ? errors.password : ''" />
                <Input id="password-repeat" type="password" :label="$t('passwordRepeat')" v-model="passwordRepeat" :help="hasPasswordMismatch ? $t('passwordMismatchValidation') : ''" />

                <div class="text-center">
                    <button class="btn btn-primary" :disabled="isDisabled || apiProgress" @click.prevent="submit">
                        <SpinnerLoading v-if="apiProgress" />
                        {{$t('signUp')}}
                    </button>
                </div>
            </div>
        </form>
        <div v-if="signUpSuccess" class="alert alert-success" role="alert">
            Please check your e-mail to active your account
        </div>
    </div>
</template>

<script>
// import axios from "axios"
import { signUp } from "../../api/apiCalls"
import Input from "../../components/Input.vue"
import SpinnerLoading from "../../components/SpinnerLoading.vue"

export default {
    name: "SignUpPage",
    components: {
        Input,
        SpinnerLoading
    },
    data(){
        return {
            username: '',
            email: '',
            password: '',
            passwordRepeat: '',
            apiProgress: false,
            signUpSuccess: false,
            errors: {}
        }
    },
    methods: {
        async submit() {
            this.apiProgress = true

            try{
                await signUp({
                    username: this.username,
                    email: this.email,
                    password: this.password
                })
                this.signUpSuccess = true

            } catch (error) {
                if(error.response.status === 400) {
                    this.errors = error.response.data.validationErrors
                }
                this.apiProgress = false
            }
        }
    },
    computed: {
        isDisabled() {
            return (this.password && this.passwordRepeat) ? this.password !== this.passwordRepeat : true
        },
        hasPasswordMismatch() {
            return this.password !== this.passwordRepeat
        }
    },
    watch: {
        username() {
            delete this.errors.username
        },
        email() {
            delete this.errors.email
        },
        password() {
            delete this.errors.password
        }
    }
}
</script>