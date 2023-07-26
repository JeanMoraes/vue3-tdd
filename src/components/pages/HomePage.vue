<template>
    <div data-testid="home-page">
        <UserList />
    </div>
</template>

<script>
import UserList from '../UserList.vue'
export default {
    components: {
        UserList,
    }
}
</script>