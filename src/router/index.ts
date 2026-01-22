import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Note from '../Note.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/StickyNote'
    },
    {
        path: '/stickyNote',
        name: 'StickyNote',
        component: () => import('../views/StickyNote.vue')
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('../views/Setting.vue')
    },
    {
        path: '/timing',
        name: 'Timing',
        component: () => import('../views/Timing.vue')
    },
    {
        path: '/todo',
        name: 'Todo',
        component: () => import('../views/Todo.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
