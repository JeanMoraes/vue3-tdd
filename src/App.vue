<template>
  <div class="container">
    <HomePage />
    <!-- <SignUpPage /> -->
    <LanguageSelector />
  </div>
</template>

<script>
// import SignUpPage from './components/pages/SignUpPage.vue'
import HomePage from './components/pages/HomePage.vue'
import LanguageSelector from './components/LanguageSelector.vue'

export default {
  name: 'App',
  components: {
    // SignUpPage,
    HomePage,
    LanguageSelector
  }
}
</script>
