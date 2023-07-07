<template>
    <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
        <form class="card mt-5">
            <div class="card-header">
                <h1 class="text-center">Sign Up</h1>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input id="username" class="form-control" v-model="username" />
                </div>
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
                    <button class="btn btn-primary" :disabled="isDisabled || disabled" @click.prevent="submit">
                        <span v-if="apiProgress" class="spinner-border spinner-border-sm" role="status"></span>
                        Sign Up
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import axios from "axios"

export default {
    name: "SignUpPage",
    data(){
        return {
            disabled: false,
            username: '',
            email: '',
            password: '',
            passwordRepeat: '',
            apiProgress: false,
        }
    },
    methods: {
        submit() {
            this.disabled = true
            this.apiProgress = true
            axios.post('/api/1.0/users', {
                username: this.username,
                email: this.email,
                password: this.password
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