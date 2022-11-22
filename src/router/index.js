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
    path: "/profile/edit/psychologist",
    name: "EditProfilePsychologist",
    component: () => import("../views/EditProfilePsychologist.vue"),
    meta: {
      auth: true,
      noAuthPsychologist: true,
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
    path: "/managearticle",
    name: "ManageArticle",
    component: () => import("../views/ManageArticle.vue"),
    meta: {
      auth: true,
      authPsychologist: true,
    },
  },
  {
    path: "/managearticle/:post_id",
    name: "EditArticle",
    component: () => import("../views/ManageArticle.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/heal",
    name: "Heal",
    component: () => import("../views/Heal.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/listener",
    name: "Listener",
    component: () => import("../views/AllListener.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/psychologist",
    name: "Psychologist",
    component: () => import("../views/AllPsychologist.vue"),
    meta: {
      auth: true,
    },
  },
  {
    path: "/blog",
    name: "Blog",
    component: () => import("../views/Blog.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    beforeEnter: (to, from, next) => {
      next({ name: "Home" });
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
    to.meta.noAuthPsychologist &&
    !store.getters.isLogin &&
    store.getters.getAccount.role === "Psychologist"
  ) {
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
