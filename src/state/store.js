import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            isLoggedIn: false,
        }
    },
    mutations: {
        loginSuccess(state) {
            state.isLoggedIn = true
        }
    }
})

export default store