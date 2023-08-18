import SecureLS from "secure-ls"

const secureLS = new SecureLS()

const setItem = (key, value) => {
    secureLS.set(key, value)
    // localStorage.setItem(key, JSON.stringify(value))
}

const getItem = (key) => {
    return secureLS.get(key)
    // const stored = localStorage.getItem(key)
    // if(!stored) {
    //     return null
    // }

    // try {
    //     return JSON.parse(stored)
    // } catch {
    //     return stored
    // }
}

const clear = () => {
    localStorage.clear()
}

export default {
    setItem,
    getItem,
    clear
}