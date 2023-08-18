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
        loginSuccess(state, payload) {
            state.isLoggedIn = true;
            // state.id = id
            
            for(let key in payload) {
                state[key] = payload[key]
            }
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