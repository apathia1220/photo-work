import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/home.vue'
import AddPhoto from '../pages/addPhoto.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/add', component: AddPhoto }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
