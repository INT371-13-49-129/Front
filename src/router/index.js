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
    meta: {
      auth: true,
    },
  },
  {
    path: "/messages/:account_id",
    name: "Message",
    component: () => import("../views/Message.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/profile",
    name: "MyProfile",
    component: () => import("../views/Profile.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/profile/edit",
    name: "EditProfile",
    component: () => import("../views/EditProfile.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/post/:post_id",
    name: "PostView",
    component: () => import("../views/PostView.vue"),
  },
  {
    path: "/profile/:account_id",
    name: "ProfileView",
    component: () => import("../views/ProfileView.vue"),
  },
  {
    path: "/mooddiary",
    name: "MoodDiary",
    component: () => import("../views/MoodDiary.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/article/manage",
    name: "ManageArticle",
    component: () => import("../views/ManageArticle.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/article",
    name: "Article",
    component: () => import("../views/Article.vue"),
    meta: {
      auth: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  await store.dispatch("getAccount");
  if (to.meta.noAuth && store.getters.isLogin) {
    next({ path: "/" });
  }
  if (to.meta.auth && !store.getters.isLogin) {
    next({ path: "/" });
  }
  if (
    to.meta.authPsychologist &&
    !store.getters.isLogin &&
    store.getters.account.role != "Psychologist"
  ) {
    next({ path: "/" });
  }
  next();
});

const originalPush = router.push;
router.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }

  return originalPush.call(this, location).catch((err) => {
    if (VueRouter.isNavigationFailure(err)) {
      return err;
    }

    return Promise.reject(err);
  });
};

export default router;
