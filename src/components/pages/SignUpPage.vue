<template>
    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
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
                        <span v-if="apiProgress" class="spinner-border spinner-border-sm" role="status"></span>
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
import axios from "axios"
import Input from "../../components/Input.vue"

export default {
    name: "SignUpPage",
    components: {
        Input
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
        submit() {
            this.apiProgress = true

            axios
            .post('/api/1.0/users', {
                username: this.username,
                email: this.email,
                password: this.password
            }, {
                headers: {
                    "Accept-Language": this.$i18n.locale
                }
            })
            .then(() => {
                this.signUpSuccess = true
            })
            .catch((error) => {
                if(error.response.status === 400) {
                    this.errors = error.response.data.validationErrors
                }
                this.apiProgress = false
            })
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