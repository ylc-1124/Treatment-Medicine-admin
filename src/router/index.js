import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home' ,affix: true}
    }]
  },
  //
  // {
  //   path: '/sys',
  //   component: Layout,
  //   redirect: '/sys/user',
  //   name: 'sysManage',
  //   meta: { title: '系统管理', icon: 'sys' },
  //   children: [
  //     {
  //       path: 'user',
  //       name: 'User',
  //       component: () => import('@/views/sys/User'),
  //       meta: { title: '用户管理', icon: 'userManage' }
  //     },
  //     {
  //       path: 'role',
  //       name: 'Role',
  //       component: () => import('@/views/sys/Role'),
  //       meta: { title: '角色管理', icon: 'roleManage' }
  //     }
  //   ]
  // },
  // {
  //   path: '/doctor',
  //   component: Layout,
  //   redirect: '/doctor/query',
  //   name: 'doctorManage',
  //   meta: { title: '医生管理', icon: 'doctor' },
  //   children: [
  //     {
  //       path: 'info',
  //       name: 'DoctorInfo',
  //       component: () => import('@/views/doctor/info'),
  //       meta: { title: '医生信息管理', icon: 'doctor' }
  //     },
  //     {
  //       path: 'check',
  //       name: 'DoctorCheck',
  //       component: () => import('@/views/doctor/check'),
  //       meta: { title: '医生资质审核', icon: 'doctorCheck' }
  //     }
  //   ]
  // },
  // {
  //   path: '/patient',
  //   component: Layout,
  //   redirect: '/patient/info',
  //   name: 'patientManage',
  //   meta: { title: '患者管理', icon: 'patient' },
  //   children: [
  //     {
  //       path: 'info',
  //       name: 'PatientInfo',
  //       component: () => import('@/views/patient/info'),
  //       meta: { title: '患者信息管理', icon: 'patient' }
  //     }
  //   ]
  // },
  // {
  //   path: '/drug',
  //   component: Layout,
  //   redirect: '/drug/query',
  //   name: 'drugManage',
  //   meta: { title: '药品管理', icon: 'drug' },
  //   children: [
  //     {
  //       path: 'info',
  //       name: 'DrugInfo',
  //       component: () => import('@/views/drug/info'),
  //       meta: { title: '药品信息管理', icon: 'drug' }
  //     }
  //   ]
  // },
  // {
  //   path: '/drugManufacturer',
  //   component: Layout,
  //   redirect: '/drugManufacturer/info',
  //   name: 'drugManufacturerManage',
  //   meta: { title: '药品厂家管理', icon: 'factory' },
  //   children: [
  //     {
  //       path: 'info',
  //       name: 'DrugManufacturerInfo',
  //       component: () => import('@/views/drugManufacturer/info'),
  //       meta: { title: '药品厂家信息管理', icon: 'factory' }
  //     }
  //   ]
  // },
  // {
  //   path: '/order',
  //   component: Layout,
  //   redirect: '/order/info',
  //   name: 'orderManage',
  //   meta: { title: '订单管理', icon: 'order' },
  //   children: [
  //     {
  //       path: 'info',
  //       name: 'orderInfo',
  //       component: () => import('@/views/order/info'),
  //       meta: { title: '订单管理', icon: 'order' }
  //     }
  //   ]
  // },
  // {
  //   path: '/findDoctor',
  //   component: Layout,
  //   redirect: '/findDoctor',
  //   name: 'findDoctor',
  //   meta: { title: '找医生', icon: 'doctorQuery' },
  //   children: [
  //     {
  //       path: 'byHospital',
  //       name: 'findByHospital',
  //       component: () => import('@/views/findDoctor/byHospital'),
  //       meta: { title: '按医院查找', icon: 'hospital' }
  //     },
  //     {
  //       path: 'byDepartment',
  //       name: 'findByDepartment',
  //       component: () => import('@/views/findDoctor/byDepartment'),
  //       meta: { title: '按科室推荐', icon: 'keshi' }
  //     }
  //   ]
  // },
  // {
  //   path: '/consultRecord',
  //   component: Layout,
  //   redirect: '/consultRecord/online',
  //   name: 'consultRecord',
  //   meta: { title: '问诊记录', icon: 'wz' },
  //   children: [
  //     {
  //       path: 'onlinePat',
  //       name: 'onlinePat',
  //       component: () => import('@/views/consultation/onlinePat'),
  //       meta: { title: '待问诊', icon: 'wz' }
  //     },
  //     {
  //       path: 'rejected',
  //       name: 'rejectedRecord',
  //       component: () => import('@/views/consultation/rejected'),
  //       meta: { title: '已拒绝', icon: 'jujue' }
  //     },
  //   ]
  // },
  // {
  //   path: '/findDrug',
  //   component: Layout,
  //   redirect: '/findDrug/buy',
  //   name: 'findDrug',
  //   meta: { title: '药品购买', icon: 'drug' },
  //   children: [
  //     {
  //       path: 'buy',
  //       name: 'drugBuy',
  //       component: () => import('@/views/findDrug/buy'),
  //       meta: { title: '购买药品', icon: 'drugBuy' }
  //     },
  //     {
  //       path: 'myOrder',
  //       name: 'myOrder',
  //       component: () => import('@/views/order/myOrder'),
  //       meta: { title: '我的订单', icon: 'order' }
  //     }
  //   ]
  // },
  // {
  //   path: '/query',
  //   component: Layout,
  //   redirect: '/query',
  //   name: 'findDrug',
  //   meta: { title: '便民查询', icon: 'query' },
  //   children: [
  //     {
  //       path: 'pres',
  //       name: 'PrescriptionQuery',
  //       component: () => import('@/views/prescription/query'),
  //       meta: { title: '处方查询', icon: 'prescription' }
  //     },
  //     {
  //       path: 'drug',
  //       name: 'drugQuery',
  //       component: () => import('@/views/findDrug/query'),
  //       meta: { title: '药品信息查询', icon: 'drug' }
  //     },
  //     {
  //       path: 'manufacturer',
  //       name: 'drugManufacturerQuery',
  //       component: () => import('@/views/findManufacturer/query'),
  //       meta: { title: '药品厂家查询', icon: 'factory' }
  //     }
  //   ]
  // },
  // {
  //   path: '/consultation',
  //   component: Layout,
  //   redirect: '/consultation',
  //   name: 'onlineConsultation',
  //   meta: { title: '在线问诊', icon: 'wz' },
  //   children: [
  //     {
  //       path: 'handle',
  //       name: 'requestHandle',
  //       component: () => import('@/views/consultation/handle'),
  //       meta: { title: '问诊请求', icon: 'wzqq' }
  //     },
  //     {
  //       path: 'onlineDoc',
  //       name: 'onlineDoc',
  //       component: () => import('@/views/consultation/onlineDoc'),
  //       meta: { title: '在线问诊', icon: 'wz' }
  //     },
  //     {
  //       path: 'pres',
  //       name: 'prescriptionCreate',
  //       component: () => import('@/views/prescription/create'),
  //       meta: { title: '处方开具', icon: 'prescription' }
  //     }
  //   ]
  // },
  //
  // // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
