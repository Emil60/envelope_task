
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        name: 'OOSBarChart',
        component: () => import('../views/MainView.vue')
    },
    {
        path: '/stock-timeline-chart',
        name: 'StockTimelineChart',
        component: () => import('../views/AnalyticsDashboard.vue')
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router
