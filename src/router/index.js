import Vue from 'vue'
import VueRouter from 'vue-router'

// 懒加载引入
const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/Category')
const Cart = () => import('../views/cart/Cart')
const Profile = () => import('../views/profile/Profile')
const Detail = () => import('../views/detail/Detail')

// 1.安装插件
Vue.use(VueRouter)

// 2.创建router
const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/category',
    component: Category
  },
  {
    path: '/cart',
    component: Cart
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    // 动态路由传递
    path: '/detail/:iid',
    component: Detail
    // 通过query传递，前面会带有iid=字样
    // path: '/detail',
    // component: Detail
  }
]
const router = new VueRouter({
    routes,
    mode: 'history'

})

// 3.导出
export default router