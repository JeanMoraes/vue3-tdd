<template>
    <img src="../assets/profile.png" :alt="user.username" width="30" class="rounded-circle shadow-sm" />
    {{ user.username}}
</template>

<script>
export default {
    props: {
        user: Object
    }
}
</script>