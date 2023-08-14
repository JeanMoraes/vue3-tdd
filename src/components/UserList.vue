<template>
    <div class="card">
        <div class="card-header text-center">
            <h3>{{$t('users')}}</h3>
        </div>
        <ul class="list-group list-group-flush">
            <li
                v-for="user in page.content"
                :key="user.id"
                class="list-group-item list-group-item-action"
                @click="$router.push(`/user/${user.id}`)"
            >
                <UserListItem :user="user"/> 
            </li>
        </ul>
        <div class="card-footer text-center">
            <button
                class="btn btn-outline-secondary btn-sm float-start"
                v-show="page.page > 0 && !pendingApiCall"
                @click="loadData(this.page.page - 1)"
                title="previous">
                    {{$t('previousPage')}}
            </button>

            <button
                class="btn btn-outline-secondary btn-sm float-end"
                v-show="page.totalPages > page.page + 1 && !pendingApiCall"
                @click="loadData(this.page.page + 1)"
                title="next">
                    {{$t('nextPage')}}
            </button>
            
            <SpinnerLoading v-show="pendingApiCall" size="normal" />
        </div>
    </div>
</template>

<script>
import UserListItem from './UserListItem.vue'
import SpinnerLoading from './SpinnerLoading.vue'

import { loadUsers } from '../api/apiCalls'
export default {
    components: {
        UserListItem,
        SpinnerLoading,
    },
    data() {
        return {
            page: {
                content: [],
                page: 0,
                size: 0,
                totalPages: 0
            },
            pendingApiCall: true,
        }
    },
    async mounted() {
        this.loadData()
    },
    methods: {
        async loadData(pageIndex) {
            this.pendingApiCall = true
            const response = await loadUsers(pageIndex)
            this.page = response.data
            this.pendingApiCall = false
        },
    }
}
</script>

<style scoped>
    li {
        cursor: pointer;
    }
</style>