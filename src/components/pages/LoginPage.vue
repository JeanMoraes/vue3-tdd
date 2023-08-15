<template>
   <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2" data-testid="login-page">
        <form class="card mt-5">
            <div class="card-header">
                <h1 class="text-center">Login</h1>
            </div>
            <div class="card-body">
                <Input id="email" label="E-mail" v-model="email" />
                <Input id="password" type="password" label="Password" v-model="password" />

                <div class="text-center">
                    <button class="btn btn-primary" :disabled="isDisabled">
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
        }
    },
    computed: {
        isDisabled() {
            return !(this.email && this.password)
        }
    }

}
</script>