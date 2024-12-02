import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'main',
            redirect: '/search',
            component: () => import('@/views/MainPage.vue'),
            children: [
                {
                    path: '/search',
                    name: 'search',
                    component: () => import('@/views/PaperSearch.vue'),
                    meta: {title: '文献检索'}
                },
                {
                    path: '/paperDetail/:paperId',
                    name: 'paperDetail',
                    component: () => import('@/views/PaperDetail.vue'),
                    meta: {title: '文献详情'}
                },
                {
                    path: '/paperSuggest',
                    name: 'paperSuggest',
                    component: () => import('@/views/PaperSuggest.vue'),
                    meta: {title: '文献推荐'}
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('@/views/User.vue'),
                    meta: {title: '用户中心'}
                }
            ]
        }, {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue'),
            meta: {title: '登录'}
        }, {
            path: '/register',
            name: 'register',
            component: () => import('@/views/Register.vue'),
            meta: {title: '注册'}
        },
    ],
})

router.beforeEach((to, _, next) => {
    const token: string | null = sessionStorage.getItem('token');

    if (to.meta.title) {
        document.title = "Linked Papers | "+to.meta.title
    }

    if (token) {
        if (to.path === '/login') {
            next('/search')
        } else {
            next()
        }
    } else {
        if (to.path === '/user') {
            next('/login')
        }else if (to.path === '/paperSuggest') {
            next('/login')
        } else {
            next()
        }
    }
})

export default router
