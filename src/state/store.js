import { createStore } from 'vuex'

const store = createStore({
    state() {
        return JSON.parse(localStorage.getItem('auth'))
        // return {
        //     isLoggedIn: false,
        // }
    },
    mutations: {
        loginSuccess(state, id) {
            state.isLoggedIn = true,
            state.id = id
        },
        reset(state, initialState) {
            state.isLoggedIn = false;
            delete state.id

            for(let key in initialState) {
                state[key] = initialState[key]
            }
        }
    },
})

store.subscribe((mutations, state) => {
    localStorage.setItem('auth', JSON.stringify(state))
})

export const resetAuthState = () => {
    store.commit('reset', JSON.parse(localStorage.getItem('auth')))
}

export default store