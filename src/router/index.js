import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      noAuth: true,
    },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: () => import("../views/SignUp.vue"),
    meta: {
      noAuth: true,
    },
  },
  {
    path: "/sendmail",
    name: "SendMail",
    component: () => import("../views/SendMail.vue"),
    meta: {
      noAuth: true,
    },
  },
  {
    path: "/confirmEmail",
    name: "ConfirmEmail",
    component: () => import("../views/ConfirmEmail.vue"),
  },
  {
    path: "/messages",
    name: "Messages",
    component: () => import("../views/AllMessage.vue"),
  },
  {
    path: "/messages/:account_id",
    name: "Message",
    component: () => import("../views/Message.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  await store.dispatch("getAccount");
  console.log(store.getters.isLogin);
  if (to.meta.noAuth && store.getters.isLogin) {
    next({ path: "/" });
  }
  next();
});

export default router;
