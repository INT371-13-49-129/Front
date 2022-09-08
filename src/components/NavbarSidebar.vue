<template>
  <div>
    <vs-navbar shadow square center-collapsed v-model="active">
      <template #left>
        <vs-avatar circle @click="activeSidebar = !activeSidebar" class="my-2">
          <i class="bx bx-user"></i>
        </vs-avatar>
      </template>
      <img src="../assets/logo.png" width="83.45px" height="28px" />
      <template #right>
        <img src="../assets/img/chat.svg" width="40px" height="40px" />
      </template>
    </vs-navbar>
    <vs-sidebar absolute v-model="active" :open.sync="activeSidebar">
      <template #logo>
        <div class="flex items-center -ml-2">
          <vs-avatar circle>
            <i class="bx bx-user"></i>
          </vs-avatar>
          <div class="ml-4">
            <div class="font-semibold text-xl break-all">
              {{ isLogin ? account.username : "Guest" }}
            </div>
          </div>
        </div>
      </template>
      <vs-sidebar-item id="Home">
        <template #icon>
          <i class="bx bx-home" @click="$router.push('/')"></i>
        </template>
        <div class="text-lg" @click="$router.push('/')">Home</div>
      </vs-sidebar-item>
      <vs-sidebar-item id="Messages" v-if="isLogin">
        <template #icon>
          <i
            class="bx bx-message-rounded"
            @click="$router.push('/messages')"
          ></i>
        </template>
        <div class="text-lg" @click="$router.push('/messages')">Messages</div>
      </vs-sidebar-item>
      <vs-sidebar-item v-if="!isLogin">
        <template #icon>
          <i
            @click="$router.push('/login')"
            class="bx bx-log-in text-gray-700"
          ></i>
        </template>
        <div @click="$router.push('/login')" class="text-lg text-gray-700">
          Login
        </div>
      </vs-sidebar-item>
      <vs-sidebar-item v-if="!isLogin">
        <template #icon>
          <i
            @click="$router.push('/signup')"
            class="bx bx-user text-gray-700"
          ></i>
        </template>
        <div @click="$router.push('/signup')" class="text-lg text-gray-700">
          Sign up
        </div>
      </vs-sidebar-item>
      <vs-sidebar-item v-if="isLogin">
        <template #icon>
          <i @click="logout()" class="bx bx-log-out text-red-500"></i>
        </template>
        <div @click="logout()" class="text-lg text-red-500">Logout</div>
      </vs-sidebar-item>
      <template #footer>
        <img
          src="../assets/logo.png"
          width="83.45px"
          height="28px"
          class="ml-16"
        />
      </template>
    </vs-sidebar>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      active: this.$route.name,
      activeSidebar: false,
    };
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
    }),
  },
};
</script>
