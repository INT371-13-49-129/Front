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
        <Post :post="post" @referPost="referPost" @editPost="editPost"></Post>
      </div>
    </div>
    <vs-dialog v-if="isLogin" v-model="modalShow">
      <template #header>
        <h4 class="mt-2 text-xl font-semibold">
          {{ headerModal }}
        </h4>
      </template>
      <div class="">
        <div class="flex items-center mb-2">
          <vs-avatar size="40" circle>
            <i class="bx bx-user text-sm"></i>
          </vs-avatar>
          <div class="ml-3">
            <div class="font-semibold text-base">
              {{ account.username }}
              <span class="font-normal text-sm"
                ><span v-if="tags_feeling.length !== 0" class="mr-0.5"
                  >รู้สึก</span
                >
                <span
                  v-for="(post_tag, i) in tags_feeling"
                  :key="post_tag.post_tag_id"
                  >{{ post_tag.name
                  }}<span v-if="i < tags_feeling.length - 1" class="mr-0.5"
                    >,
                  </span></span
                >
              </span>
            </div>
            <div class="font-semibold text-xs">
              <span
                v-for="post_tag in tags_category"
                :key="post_tag.post_tag_id"
                class="mr-0.5"
                >#{{ post_tag.name }}
              </span>
            </div>
          </div>
        </div>
        <textarea
          class="focus:outline-none w-full bg-gray-100 px-6 py-4 rounded-xl mb-2 scroll"
          :class="refer_post.post_id ? 'h-20' : 'h-40'"
          v-model.trim="text"
        ></textarea>
        <div v-if="refer_post.post_id" class="p-3 border-2 rounded-xl mb-6">
          <Post :post="refer_post" :hideComent="true"></Post>
        </div>

        <vs-button
          class="w-full button-login"
          border
          @click="(modalTagShow = !modalTagShow), (tagSelect = 'Feeling')"
          >ความรู้สึก</vs-button
        >
        <vs-button
          class="w-full button-login"
          border
          @click="(modalTagShow = !modalTagShow), (tagSelect = 'Category')"
          >หมวดหมู่</vs-button
        >
        <div class="h-2"></div>
        <vs-button
          class="w-full button-login"
          @click="text == '' ? '' : isEdit ? sendEditPost() : createPost()"
          >โพสต์</vs-button
        >
      </div>
    </vs-dialog>
    <vs-dialog v-model="modalTagShow">
      <template #header>
        <h4 class="mt-2 text-lg font-semibold">คุณรู้สึกอย่างไร</h4>
      </template>
      <div class="flex gap-4">
        <div
          class="py-1 border-b-2 border-primary cursor-pointer"
          :class="tagSelect == 'Feeling' ? 'text-primary' : 'border-opacity-0'"
          @click="tagSelect = 'Feeling'"
        >
          ความรู้สึก
        </div>
        <div
          class="py-1 border-b-2 border-primary cursor-pointer"
          :class="tagSelect == 'Category' ? 'text-primary' : 'border-opacity-0'"
          @click="tagSelect = 'Category'"
        >
          หมวดหมู่
        </div>
      </div>
      <div
        v-for="tag in allTag.filter((t) => t.tag_type === tagSelect)"
        :key="tag.tag_id"
        class="my-1 py-2 px-2 hover:bg-primary hover:bg-opacity-5 cursor-pointer"
        :class="
          tags_feeling.find((t) => t.tag_id == tag.tag_id) ||
          tags_category.find((t) => t.tag_id == tag.tag_id)
            ? 'bg-primary bg-opacity-5 text-primary'
            : ''
        "
        @click="selectTag(tag)"
      >
        {{ tag.name }}
      </div>
      <vs-button class="w-full button-login" @click="modalTagShow = false"
        >ตกลง</vs-button
      >
    </vs-dialog>

    <div class="fixed bottom-6 right-7" v-if="isLogin">
      <vs-avatar circle primary class="cursor-pointer" @click="modalNewPost">
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
      modalShow: false,
      modalTagShow: false,
      tagSelect: "Feeling",
      isEdit: false,
      refer_post: {
        post_id: null,
      },
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
        refer_post_id: this.refer_post.post_id,
      });
      this.modalShow = false;
      this.isEdit = false;
      this.refer_post = {
        post_id: null,
      };
      this.edit_post = null;
      this.text = "";
      this.tags_category = [];
      this.tags_feeling = [];
      await this.$store.dispatch("getAllPost");
    },
    referPost(post) {
      this.modalShow = true;
      this.isEdit = false;
      this.refer_post = post;
      this.edit_post = null;
      this.text = "";
      this.tags_category = [];
      this.tags_feeling = [];
    },
    modalNewPost() {
      this.modalShow = true;
      this.isEdit = false;
      this.refer_post = {
        post_id: null,
      };
      this.edit_post = null;
      this.text = "";
      this.tags_category = [];
      this.tags_feeling = [];
    },
    editPost(post) {
      this.modalShow = true;
      this.isEdit = true;
      this.refer_post = {
        post_id: null,
      };
      this.edit_post = post;
      this.text = post.text;
      this.tags_category = post.tags_category.map((pt) => {
        return { ...pt.tag, post_tag_id: pt.post_tag_id };
      });
      this.tags_feeling = post.tags_feeling.map((pt) => {
        return { ...pt.tag, post_tag_id: pt.post_tag_id };
      });
    },
    selectTag(tag) {
      if (this.tagSelect == "Feeling") {
        if (this.tags_feeling.find((t) => t.tag_id == tag.tag_id)) {
          this.tags_feeling = this.tags_feeling.filter(
            (t) => t.tag_id != tag.tag_id
          );
        } else {
          this.tags_feeling.push(tag);
        }
      } else {
        if (this.tags_category.find((t) => t.tag_id == tag.tag_id)) {
          this.tags_category = this.tags_category.filter(
            (t) => t.tag_id != tag.tag_id
          );
        } else {
          this.tags_category.push(tag);
        }
      }
    },
    async sendEditPost() {
      await this.$store.dispatch("updatePost", {
        text: this.text,
        post_tags: this.tags_feeling.concat(this.tags_category),
        post_id: this.edit_post.post_id,
      });
      this.modalShow = false;
      this.isEdit = false;
      this.refer_post = {
        post_id: null,
      };
      this.edit_post = null;
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
    headerModal() {
      if (this.isEdit) {
        return "แก้ไขโพสต์";
      }
      if (this.refer_post.post_id) {
        return "รีโพสต์";
      }
      return "สร้างโพสต์";
    },
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
