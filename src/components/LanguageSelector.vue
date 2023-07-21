<template>
    <img src="https://flagsapi.com/US/flat/24.png" title="English" @click="$i18n.locale = 'en'" />
    <img src="https://flagsapi.com/BR/flat/24.png" title="Português" @click="$i18n.locale = 'pt-br'" />
</template>

<style scoped>
    img {
        cursor: pointer
    }
</style>