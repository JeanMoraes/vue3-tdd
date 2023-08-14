<template>
    <div data-testid="user-page">
        <h1>User Page</h1>
        <ProfileCard :user="user" />
    </div>
</template>

<script>
import { getUserById } from '../../api/apiCalls'
import ProfileCard from '../ProfileCard'
export default {
    name: "UserPage",
    components: {
        ProfileCard,
    },
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