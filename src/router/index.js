import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: resolve => require(['@/pages/ResumeSearch.vue'], resolve),
    },
    {
      path: '/profile',
      component: resolve => require(['@/pages/Profile.vue'], resolve),
    },
    {
      path: '/about',
      component: resolve => require(['@/pages/About.vue'], resolve),
    },
    {
      path: '/staff/:id',
      name:'StaffPofile',
      component: resolve => require(['@/pages/StaffPofile.vue'], resolve),
    },
    {
      path: '/company/',
      component: resolve => require(['@/pages/CompanyList.vue'], resolve),
    },
    {
      path: '/company/staff',
      component: resolve => require(['@/pages/CompanyStaff.vue'], resolve),
    },
    {
      path: '/company/admin',
      component: resolve => require(['@/pages/form/Admin.vue'], resolve),
    },
    {
      path: '/company/:id',
      name:'CompanyProfile',
      component: resolve => require(['@/pages/CompanyProfile.vue'], resolve),
    },
    {
      path: '/register/company',
      component: resolve => require(['@/pages/form/Company.vue'], resolve),
    },
    {
      path: '/resume/add',
      component: resolve => require(['@/pages/form/Resume.vue'], resolve),
    }
  ]
})
