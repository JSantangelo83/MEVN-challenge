import { createApp } from 'vue'
import { DefaultError, ForbiddenError, UnauthorizedError } from './utils/Errors'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import LoginForm from './views/LoginForm.vue'
import UsersList from './views/UsersList.vue'

//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faPenToSquare, faPlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { swalError } from './helpers/SwalHelper'
import { BaseResponseError } from './services/BaseService'

library.add(faCheck, faXmark, faTrash, faPenToSquare, faPlus)

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
window.onerror = (err: unknown) => {
    handleErrors(err);
};

// Global unhandled promise rejection handler
window.onunhandledrejection = (event: PromiseRejectionEvent) => {
    handleErrors(event.reason);
};

function handleErrors(err: unknown) {
    if (err instanceof DefaultError) {
        swalError(err.title, err.error);
    }
    // Handling Authentication Errors
    if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
        localStorage.removeItem('token');
        router.push('/login');
    }

    // Handling other errors
    console.error(err);
}

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
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')