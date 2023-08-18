<template>
  <div class="shadow-sm bg-light mb-3">
    <nav class="navbar navbar-expand bg-body-tertiary container">
      <div class="container-fluid p-0">
        <router-link class="navbar-brand" to="/" title="Home">
          <img src="./assets/hoaxify.png" width="60" alt="Vue3 + TDD" />
        Vue3 TDD
        </router-link>
        <ul class="navbar-nav ml-auto">
          <router-link class="nav-link" to="/">Home</router-link>
          <router-link v-if="!$store.state.isLoggedIn" class="nav-link" to="/signup">Sign Up</router-link>
          <router-link v-if="!$store.state.isLoggedIn" class="nav-link" to="/login">Login</router-link>
        </ul>
      </div>
    </nav>
  </div>

  <div class="container">
    <router-view />
    <LanguageSelector />
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import LanguageSelector from './components/LanguageSelector.vue'

export default {
  name: 'App',
  components: {
    LanguageSelector,
    RouterLink, RouterView
  }
}
</script>
