import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录，重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        //如果已经请求过用户数据，直接放行
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')
          // 路由转换
          let myRoutes = myFilterAsyncRoutes(store.getters.menuList)
          // 404
          myRoutes.push({
            path: '*',
            redirect: '/404',
            hidden: true
          })
          // 动态添加路由
          router.addRoutes(myRoutes)
          // 存至全局变量
          global.myRoutes = myRoutes

          next({ ...to, replace: true })  // 防止刷新后页面空白

        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

//将数据库存储的路由配置信息，解析成前端的对象形式
function myFilterAsyncRoutes(menuList) {
  menuList.filter(menu => {
    // 核心：处理 component 转换成前端能识别的组件对象
    if (menu.component === 'Layout') {
      menu.component = Layout
      console.log(menu.component);
    } else {
      menu.component = require(`@/views/${menu.component}.vue`).default
    }
    // 递归处理子菜单
    if (menu.children && menu.children.length) {
      menu.children = myFilterAsyncRoutes(menu.children)
    }
    return true
  })
  return menuList;
}

