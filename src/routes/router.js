import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../components/pages/HomePage'
import SignUpPage from '../components/pages/SignUpPage'
import LoginPage from '../components/pages/LoginPage'
import UserPage from '../components/pages/UserPage'
import AccountActivationPage from '../components/pages/AccountActivationPage'

const routes = [
    {
        path: '/', component: HomePage
    },
    {
        path: '/signup', component: SignUpPage
    },
    {
        path: '/login', component: LoginPage
    },
    {
        path: '/user/:id', component: UserPage
    },
    {
        path: '/activate/:token', component: AccountActivationPage
    }
]

const router = createRouter({ routes, history: createWebHistory()})

export default router