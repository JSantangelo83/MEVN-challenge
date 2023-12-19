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

library.add(faCheck, faXmark, faTrash, faPenToSquare, faPlus)

const app = createApp(App)
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: LoginForm,
            meta: {
                hideForAuth: true,
            }
        },
        {
            path: '/users',
            component: UsersList,
            meta: {
                requiresAuth: true
            }
        },
        // fallback
        { path: '/:pathMatch(.*)*', redirect: '/login' }
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

app.config.errorHandler = (err: unknown) => {
    handleErrors(err);
}

function handleErrors(err: unknown) {
    if (err instanceof DefaultError) {
        swalError(err.title, err.error);
    }
    // Handling Authotication Errors
    if (err instanceof UnauthorizedError || err instanceof ForbiddenError) {
        localStorage.removeItem('token');
        router.push('/login');
    }

    // Handling other errors
    console.error(err);
}

router.beforeEach((to, _, next) => {
    const token = localStorage.getItem('token');
    const { requiresAuth, hideForAuth } = to.meta || {};

    if (requiresAuth) {
        token ? next() : next('/login');
    } else if (hideForAuth) {
        token ? next('/users') : next();
    } else {
        next();
    }
});

app.use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')