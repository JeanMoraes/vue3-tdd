<template>
  <NavBar />
  <div class="container">
    <router-view />
    <LanguageSelector />
  </div>
</template>

<script>

import LanguageSelector from './components/LanguageSelector.vue'
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    LanguageSelector,
    NavBar,
  }
}
</script>
