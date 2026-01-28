import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/todo'
    },
    {
        path: '/stickyNote',
        name: 'StickyNote',
        component: () => import('../views/StickyNote.vue'),
        meta: { KeepAlive: true }
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('../views/Setting.vue'),
    },
    {
        path: '/timing',
        name: 'Timing',
        component: () => import('../views/Timing.vue'),
        meta: { KeepAlive: true }
    },
    {
        path: '/todo',
        name: 'Todo',
        component: () => import('../views/Todo.vue'),
        meta: { KeepAlive: true }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
