import { createApp } from 'vue'
import { ForbiddenError, UnauthorizedError } from './utils/Errors'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import LoginForm from './views/LoginForm.vue'
import UsersList from './views/UsersList.vue'

const app = createApp(App)

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: LoginForm,
        },
        {
            path: '/users',
            component: UsersList,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/',
            redirect: '/users'
        }
    ]
})

// Global error handler
app.config.errorHandler = (err) => {
    // Handling Authentication Errors
    if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
        localStorage.removeItem('token');
        router.push('/login');
    }

    // Handling other errors
    console.error(err);
};

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('token');
        if (token) {
            // User is authenticated, proceed to the route
            next();
        } else {
            // User is not authenticated, redirect to login
            next('/login');
        }
    } else {
        // Non-protected route, allow access
        next();
    }
});

app.use(router)
app.mount('#app')