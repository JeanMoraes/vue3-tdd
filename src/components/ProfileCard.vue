<template>
    <div class="card text-center">
        <div class="card-header">
            <img
                :src="user.image ? `/image/${user.image}` : '/image/profile.png'"
                :alt="user.username"
                width="200"
                class="rounded-circle shadow"
            />
        </div>
        <div class="card-body">
            <h3>{{ user.username }}</h3>
        </div>

    </div>
</template>

<script>
export default {
    name: 'ProfileCard',
    props: {
        user: Object
    }
}
</script>