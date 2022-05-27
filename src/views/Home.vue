<template>
  <div class="w-full h-full overflow-y-auto">
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
              {{ isLogin ? account.username : "Username" }}
            </div>
          </div>
        </div>
      </template>
      <vs-sidebar-item id="home">
        <template #icon>
          <i class="bx bx-home"></i>
        </template>
        <div class="text-lg">Home</div>
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
    <div class="mt-16 xl:w-160 w-full mx-auto">
      <div v-for="post in allPost" :key="post.post_id">
        <Post :post="post"></Post>
      </div>
    </div>
    <vs-dialog v-model="newPost">
      <template #header>
        <h4 class="mt-2 text-xl font-semibold">สร้างโพสต์</h4>
      </template>
      <div class="">
        <textarea
          class="focus:outline-none w-full h-40 bg-gray-100 px-6 py-4 rounded-xl mb-2"
          v-model.trim="text"
        ></textarea>
        <vs-select
          multiple
          label="ความรู้สึก"
          v-model="tags_feeling"
          class="mb-4 mt-3 input-post"
        >
          <vs-option
            v-for="tag in allTag.filter((t) => t.tag_type === 'Feeling')"
            :key="tag.tag_id"
            :label="tag.name"
            :value="tag"
          >
            {{ tag.name }}
          </vs-option>
        </vs-select>
        <vs-select
          multiple
          label="หมวดหมู่"
          v-model="tags_category"
          class="mb-4 input-post"
        >
          <vs-option
            v-for="tag in allTag.filter((t) => t.tag_type === 'Category')"
            :key="tag.tag_id"
            :label="tag.name"
            :value="tag"
          >
            {{ tag.name }}
          </vs-option>
        </vs-select>
        <vs-button
          class="w-full button-login"
          @click="text == '' ? '' : createPost()"
          >โพสต์</vs-button
        >
      </div>
    </vs-dialog>

    <div class="fixed bottom-6 right-7" v-if="isLogin">
      <vs-avatar circle primary class="cursor-pointer" @click="newPost = true">
        <i class="bx bx-plus"></i>
      </vs-avatar>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Post from "@/components/Post.vue";

export default {
  data() {
    return {
      tags_category: [],
      tags_feeling: [],
      active: "home",
      activeSidebar: false,
      newPost: false,
      text: "",
    };
  },
  components: {
    Post,
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/login");
    },
    async createPost() {
      await this.$store.dispatch("createPost", {
        text: this.text,
        post_tags: this.tags_feeling.concat(this.tags_category),
        refer_post_id: null,
      });
      this.newPost = false;
      this.text = "";
      this.tags_category = [];
      this.tags_feeling = [];
      await this.$store.dispatch("getAllPost");
    },
  },
  async mounted() {
    await this.$store.dispatch("getAllPost");
    await this.$store.dispatch("getAllTag");
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      allPost: "getAllPost",
      allTag: "getAllTag",
    }),
  },
};
</script>
<style lang="css">
.input-post .vs-select__input {
  width: 100% !important;
  border: 1px solid #eeeeee !important;
  border-radius: 8px !important;
  background: white;
}
.input-post.vs-select-content {
  max-width: 100%;
}
</style>
