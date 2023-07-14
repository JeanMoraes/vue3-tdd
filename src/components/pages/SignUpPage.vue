<template>
    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        <form v-if="!signUpSuccess" class="card mt-5" data-testid="form-sign-up">
            <div class="card-header">
                <h1 class="text-center">Sign Up</h1>
            </div>
            <div class="card-body">
                <Input id="username" label="Username" v-model="username" :help="errors ? errors.username : ''" />
                <div class="mb-3">
                    <label for="e-mail" class="form-label">E-mail</label>
                    <input id="e-mail" class="form-control" v-model="email" />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input id="password" class="form-control" type="password" v-model="password" />
                </div>
                <div class="mb-3">
                    <label for="password-repeat" class="form-label">Password Repeat</label>
                    <input id="password-repeat" class="form-control" type="password" v-model="passwordRepeat" />
                </div>

                <div class="text-center">
                    <button class="btn btn-primary" :disabled="isDisabled || apiProgress" @click.prevent="submit">
                        <span v-if="apiProgress" class="spinner-border spinner-border-sm" role="status"></span>
                        Sign Up
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
        }
    }
}
</script>