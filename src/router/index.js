import Vue from 'vue'
import VueRouter from 'vue-router'
// import Hello from '@/components/Hello'

Vue.use(VueRouter)

const Home = r => require.ensure([], () => r(require('@/views/home.vue')), 'home')
// const punchCard = r => require.ensure([], () => r(require('@/views/punch-card/punch-card.vue')), 'punchCard')
// const vocationManage = r => require.ensure([], () => r(require('@/views/vocation-manage/vocation-manage.vue')), 'vocationManage')
// const vocationInfo = r => require.ensure([], () => r(require('@/views/vocation-manage/vocation-info.vue')), 'vocationInfo')
// const vocationRecord = r => require.ensure([], () => r(require('@/views/vocation-manage/vocation-record.vue')), 'vocationRecord')
// const myScheduling = r => require.ensure([], () => r(require('@/views/my-scheduling/my-scheduling.vue')), 'myScheduling')
// const exceptionManage = r => require.ensure([], () => r(require('@/views/exception-manage/exception-manage.vue')), 'exceptionManage')
// const exceptionApply = r => require.ensure([], () => r(require('@/views/exception-manage/exception-apply.vue')), 'exceptionApply')
// const myApply = r => require.ensure([], () => r(require('@/views/my-apply/my-apply.vue')), 'myApply')
// const outApply = r => require.ensure([], () => r(require('@/views/out-apply/out-apply.vue')), 'outApply')
// const myApprove = r => require.ensure([], () => r(require('@/views/my-approve/my-approve.vue')), 'myApprove')
const translation = r => require.ensure([], () => r(require('@/views/translation/index.vue')), 'translation')

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { title: '主页', keepAlive: false },
    component: Home,
  },
  // {
  //   path: '/punchCard',
  //   name: 'punchCard',
  //   meta: {title: '打卡', keepAlive: false},
  //   component: punchCard,
  // },
  // {
  //   path: '/vocationManage',
  //   name: 'vocationManage',
  //   meta: {title: '假期管理', keepAlive: false},
  //   component: vocationManage,
  // },
  // {
  //   path: '/vocationInfo',
  //   name: 'vocationInfo',
  //   meta: {title: '假期申请', keepAlive: false},
  //   component: vocationInfo,
  // },
  // {
  //   path: '/vocationRecord',
  //   name: 'vocationRecord',
  //   meta: {title: '假期记录', keepAlive: false},
  //   component: vocationRecord,
  // },
  // {
  //   path: '/vocationDetail',
  //   name: 'vocationDetail',
  //   meta: {title: '休假详情', keepAlive: false},
  //   component: vocationInfo,
  // },
  // {
  //   path: '/myScheduling',
  //   name: 'myScheduling',
  //   meta: {title: '我的排班', keepAlive: false},
  //   component: myScheduling,
  // },
  // {
  //   path: '/exceptionManage',
  //   name: 'exceptionManage',
  //   meta: {title: '异常管理', keepAlive: false},
  //   component: exceptionManage,
  // },
  // {
  //   path: '/exceptionApply',
  //   name: 'exceptionApply',
  //   meta: {title: '异常申请', keepAlive: false},
  //   component: exceptionApply,
  // },

  // {
  //   path: '/myApply',
  //   name: 'myApply',
  //   meta: {title: '我的申请', keepAlive: false},
  //   component: myApply,
  // },
  // {
  //   path: '/outApply',
  //   name: 'outApply',
  //   meta: {title: '外出申请', keepAlive: false},
  //   component: outApply,
  // },
  // {
  //   path: '/myApprove',
  //   name: 'myApprove',
  //   meta: {title: '待审批', keepAlive: false},
  //   component: myApprove,
  // },
  {
    path: '/translation',
    name: 'translation',
    meta: { title: '翻译', keepAlive: false },
    component: translation,
  },
]

let router = new VueRouter({
  routes,
})

let setWechatTitle = function (title) {
  document.title = title
  let mobile = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(mobile)) {
    let iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    // iframe.setAttribute("src", require("../assets/images/vocation-manage/add@3.png"))
    let iframeCallback = function () {
      setTimeout(function () {
        iframe.removeEventListener('load', iframeCallback)
        document.body.removeChild(iframe)
      }, 0)
    }

    iframe.addEventListener('load', iframeCallback)
    document.body.appendChild(iframe)
  }
}

router.afterEach((route) => {
  setWechatTitle(route.meta.title)
})

export default router
