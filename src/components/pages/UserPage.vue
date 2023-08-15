<template>
    <div data-testid="user-page">
        <h1>User Page</h1>
        <ProfileCard :user="user" v-if="!pendingApiCall && !failResponse"/>
        <div v-if="pendingApiCall" class="alert alert-secondary text-center">
            <SpinnerLoading size="normal" />
        </div>
        <div v-if="failResponse" class="alert alert-danger text-center">
            {{ failResponse }}
        </div>
    </div>
</template>

<script>
import { getUserById } from '../../api/apiCalls'
import ProfileCard from '../ProfileCard'
import SpinnerLoading from '../SpinnerLoading'
export default {
    name: "UserPage",
    components: {
        ProfileCard,
        SpinnerLoading,
    },
    data() {
        return {
            user: {},
            failResponse: undefined,
            pendingApiCall: true,
        }
    },
    async mounted() {
        try {
            const response = await getUserById(this.$route.params.id)
            this.user = response.data
        } catch (error) {
            this.failResponse = error.response.data.message
        }

        this.pendingApiCall = false
    }
}
</script>