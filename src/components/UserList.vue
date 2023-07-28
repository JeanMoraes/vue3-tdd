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
        <div class="card-footer">
            <button class="btn btn-outline-secondary btn-sm" v-if="page.page > 0" @click="loadData(this.page.page - 1)" title="previous">previous</button>
            <button class="btn btn-outline-secondary btn-sm float-end" v-if="page.totalPages > page.page + 1" @click="loadData(this.page.page + 1)" title="next">next</button>
        </div>
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
        this.loadData()
    },
    methods: {
        async loadData(pageIndex) {
            const response = await loadUsers(pageIndex)
            this.page = response.data
        },
        async loadPrevious() {
            const response = await loadUsers(this.page.page - 1)
            this.page = response.data
        }
    }
}
</script>