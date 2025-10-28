import MainLayout from "../layouts/MainLayout.vue"

const routes = [
    { 
        path: '/',
        name: 'MainLayout', 
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'tasks',
                component: () => import('../views/Tasks.vue'),
                meta: { title: 'All Tasks' }
            },
            {
                path: 'categories',
                name: 'categories',
                component: () => import('../views/Categories.vue'),
                meta: { title: 'All Categories' }
            }
        ] 
    },
]

export default routes