import { createStore } from 'vuex'
import storage from './storage'

const store = createStore({
    state() {
        return storage.getItem('auth')
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
    storage.setItem('auth', state)
})

export const resetAuthState = () => {
    store.commit('reset', storage.getItem('auth'))
}

export default store