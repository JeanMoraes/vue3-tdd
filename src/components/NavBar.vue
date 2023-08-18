<template>
    <div class="shadow-sm bg-light mb-3">
        <nav class="navbar navbar-expand bg-body-tertiary container">
        <div class="container-fluid p-0">
            <router-link class="navbar-brand" to="/" title="Home">
            <img src="../assets/hoaxify.png" width="60" alt="Vue3 + TDD" />
            Vue3 TDD
            </router-link>
            <ul class="navbar-nav ml-auto">
            <router-link class="nav-link" to="/">Home</router-link>
            <router-link v-if="$store.state.isLoggedIn" class="nav-link" :to="`/user/${$store.state.id}`">My Profile</router-link>
            <router-link v-if="!$store.state.isLoggedIn" class="nav-link" to="/signup">Sign Up</router-link>
            <router-link v-if="!$store.state.isLoggedIn" class="nav-link" to="/login">Login</router-link>
            </ul>
        </div>
        </nav>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
    name: 'NavBar',
    components: {
    RouterLink
  }
}
</script>