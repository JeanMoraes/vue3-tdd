<template>
    <div class="card">
        <div class="card-header text-center">
            <h3>Users</h3>
        </div>
        <ul class="list-group list-group-flush">
            <li
                v-for="user in page.content"
                :key="user.id"
                class="list-group-item list-group-item-action">
                {{ user.username }}
            </li>
        </ul>
    </div>
</template>

<script>

import { loadUsers } from '../api/apiCalls'
export default {
    data() {
        return {
            page: {
                content: [],
                page: 0,
                size: 0,
                totalPages: 0
            }
        }
    },
    async mounted() {
        const response = await loadUsers()
        this.page = response.data
    }
}
</script>