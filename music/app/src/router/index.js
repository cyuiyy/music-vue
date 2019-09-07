import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path:"/",
      redirect:"/registry"
    },{
      path: '/music',
      component:()=>import ('@/view/Music')
    },{
      path:"/login",
      component:()=>import ('@/view/Login')
    },{
      path:"/registry",
      component:()=>import ('@/view/Registry')
    }
  ]
})
