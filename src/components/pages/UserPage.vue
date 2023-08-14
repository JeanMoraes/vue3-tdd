<template>
    <div data-testid="user-page">
        <h1>User Page</h1>
        {{ user.username }}
    </div>
</template>

<script>
import { getUserById } from '../../api/apiCalls'
export default {
    data() {
        return {
            user: {},
        }
    },
    async mounted() {
        const response = await getUserById(this.$route.params.id)
        this.user = response.data
    }
}
</script>