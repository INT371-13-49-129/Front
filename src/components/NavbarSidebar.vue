<template>
  <div>
    <vs-navbar shadow square center-collapsed>
      <template #left>
        <img
          src="../assets/logo.png"
          width="83.45px"
          height="28px"
          class="cursor-pointer"
          @click="$router.push({ name: 'Home' })"
        />
        <div v-show="active == 'Home'" class="flex py-3 items-center ml-2">
          <div
            class="filter drop-shadow-all rounded-full bg-white flex items-center w-auto xl:flex-grow-0 flex-auto"
          >
            <input
              type="text"
              placeholder="ค้นหา"
              class="ml-3 mr-2 my-1 xl:w-96 flex-auto w-full"
              v-model.trim="searchInput"
              @keyup.enter="$emit('searchfilter', searchInput)"
            />
            <div
              @click="$emit('searchfilter', searchInput)"
              class="flex justify-center items-center mr-1 h-7 w-7 my-1 rounded-full bg-primary cursor-pointer flex-shrink-0"
            >
              <i class="bx bx-search text-white text-lg"></i>
            </div>
          </div>
          <div class="xl:hidden flex justify-center items-center">
            <i
              @click="$emit('modalTagShow')"
              class="bx bx-filter-alt text-2xl ml-1 cursor-pointer"
            ></i>
          </div>
        </div>
      </template>
      <template #right>
        <div v-if="isLogin" class="xl:flex hidden">
          <div
            class="rounded-full mx-2 w-10 h-10 flex justify-center items-center cursor-pointer"
            :class="
              active == 'Home'
                ? 'bg-primary bg-opacity-10 text-primary'
                : 'hover:bg-primary hover:bg-opacity-10 hover:text-primary'
            "
            @click="active == 'Home' ? '' : $router.push({ name: 'Home' })"
          >
            <i class="bx bx-home text-3xl"></i>
          </div>
          <div
            class="rounded-full mx-2 w-10 h-10 flex justify-center items-center cursor-pointer"
            :class="
              active == 'Heal'
                ? 'bg-primary bg-opacity-10 text-primary'
                : 'hover:bg-primary hover:bg-opacity-10 hover:text-primary'
            "
            @click="$router.push({ name: 'Heal' })"
          >
            <i class="bx bx-donate-heart text-3xl"></i>
          </div>
          <div
            class="rounded-full mx-2 w-10 h-10 flex justify-center items-center cursor-pointer"
            :class="
              active == 'MoodDiary'
                ? 'bg-primary bg-opacity-10 text-primary'
                : 'hover:bg-primary hover:bg-opacity-10 hover:text-primary'
            "
            @click="$router.push({ name: 'MoodDiary' })"
          >
            <i class="bx bx-book-open text-3xl"></i>
          </div>
          <div
            class="rounded-full mx-2 w-10 h-10 flex justify-center items-center cursor-pointer"
            :class="
              active == 'Messages'
                ? 'bg-primary bg-opacity-10 text-primary'
                : 'hover:bg-primary hover:bg-opacity-10 hover:text-primary'
            "
            @click="$router.push({ name: 'Messages' })"
          >
            <i class="bx bx-message-rounded text-3xl"></i>
          </div>
          <div
            class="rounded-full mx-2 w-10 h-10 flex justify-center items-center"
            v-show="false"
          >
            <i class="bx bx-bell text-3xl"></i>
          </div>
        </div>
        <vs-avatar circle class="my-2 ml-2">
          <img
            v-if="account && account.image_url"
            :src="getFile(account.image_url)"
            alt=""
            @click="modalAccountShow = true"
          />
          <i v-else @click="modalAccountShow = true" class="bx bx-user"></i>
        </vs-avatar>
      </template>
    </vs-navbar>
    <div
      class="fixed bottom-0 xl:hidden block z-10 bg-white w-full filter drop-shadow-all"
    >
      <div v-if="isLogin" class="flex justify-around my-2">
        <div
          class="rounded-full mx-2 w-10 h-10 flex justify-center items-center cursor-pointer"
          :class="
            active == 'Home'
              ? 'bg-primary bg-opacity-10 text-primary'
              : 'hover:bg-primary hover:bg-opacity-10 hover:text-primary'
          "
          @click="active == 'Home' ? '' : $router.push({ name: 'Home' })"
        >
          <i class="bx bx-home text-3xl"></i>
        </div>
        <div
          class="rounded-full mx-2 w-10 h-10 flex justify-center items-center cursor-pointer"
          :class="
            active == 'Heal'
              ? 'bg-primary bg-opacity-10 text-primary'
              : 'hover:bg-primary hover:bg-opacity-10 hover:text-primary'
          "
          @click="$router.push({ name: 'Heal' })"
        >
          <i class="bx bx-donate-heart text-3xl"></i>
        </div>
        <div
          class="rounded-full mx-2 w-10 h-10 flex justify-center items-center cursor-pointer"
          :class="
            active == 'MoodDiary'
              ? 'bg-primary bg-opacity-10 text-primary'
              : 'hover:bg-primary hover:bg-opacity-10 hover:text-primary'
          "
          @click="$router.push({ name: 'MoodDiary' })"
        >
          <i class="bx bx-book-open text-3xl"></i>
        </div>
        <div
          class="rounded-full mx-2 w-10 h-10 flex justify-center items-center cursor-pointer"
          :class="
            active == 'Messages'
              ? 'bg-primary bg-opacity-10 text-primary'
              : 'hover:bg-primary hover:bg-opacity-10 hover:text-primary'
          "
          @click="$router.push({ name: 'Messages' })"
        >
          <i class="bx bx-message-rounded text-3xl"></i>
        </div>
        <div
          class="rounded-full mx-2 w-10 h-10 flex justify-center items-center"
          v-show="false"
        >
          <i class="bx bx-bell text-3xl"></i>
        </div>
      </div>
    </div>
    <vs-dialog v-model="modalAccountShow">
      <div v-if="isLogin">
        <div
          class="flex items-center hover:bg-blue-100 rounded-xl cursor-pointer"
          @click="$router.push({ name: 'MyProfile' })"
        >
          <vs-avatar circle class="my-2 ml-2">
            <img
              v-if="account && account.image_url"
              :src="getFile(account.image_url)"
            />
            <i v-else class="bx bx-user"></i>
          </vs-avatar>
          <div class="ml-3 font-semibold text-lg">
            {{ getName(account) }}
          </div>
        </div>
        <div
          class="mt-2 ml-2 flex items-center border-t-2 border-b-2 py-2 hover:bg-blue-50 cursor-pointer"
          @click="$router.push({ name: 'EditProfile' })"
        >
          <i class="bx bx-cog text-3xl"></i>
          <div class="ml-3 font-semibold text-lg text-gray-700">Setting</div>
        </div>
        <div
          class="ml-2 flex items-center border-b-2 py-2 hover:bg-blue-50 cursor-pointer"
          @click="logout()"
        >
          <i class="bx bx-log-out text-3xl"></i>
          <div class="ml-3 font-semibold text-lg text-gray-700">Log out</div>
        </div>
      </div>
      <div v-else>
        <div class="flex items-center">
          <vs-avatar circle class="my-2 ml-2">
            <i class="bx bx-user"></i>
          </vs-avatar>
          <div class="ml-3 font-semibold text-lg">Guest</div>
        </div>
        <div
          class="mt-2 ml-2 flex items-center border-t-2 border-b-2 py-2 hover:bg-blue-50 cursor-pointer"
          @click="$router.push({ name: 'Login' })"
        >
          <i class="bx bx-log-in text-3xl"></i>
          <div class="ml-3 font-semibold text-lg text-gray-700">Log in</div>
        </div>
        <div
          class="ml-2 flex items-center border-b-2 py-2 hover:bg-blue-50 cursor-pointer"
          @click="$router.push({ name: 'SignUp' })"
        >
          <i class="bx bx-user text-3xl"></i>
          <div class="ml-3 font-semibold text-lg text-gray-700">Register</div>
        </div>
      </div>
    </vs-dialog>
  </div>
</template>
<script>
import mixin from "@/mixin/mixin.js";
import { mapGetters } from "vuex";

export default {
  mixins: [mixin],
  data() {
    return {
      modalAccountShow: false,
      searchInput: "",
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
    active() {
      if (this.$route.name == "Home") {
        return "Home";
      } else if (
        this.$route.name == "Message" ||
        this.$route.name == "Messages"
      ) {
        return "Messages";
      } else if (this.$route.name == "MoodDiary") {
        return "MoodDiary";
      } else if (this.$route.name == "Heal") {
        return "Heal";
      } else {
        return "";
      }
    },
  },
};
</script>
