<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div
      class="mt-16 xl:mb-0 mb-12 xl:w-2/3 w-full mx-auto xl:pt-4 pt-2 xl:px-0 px-2"
    >
      <div
        class="flex justify-center relative items-center py-4 border-b-2 mb-2"
      >
        <i
          @click="hasHistory() ? $router.go(-1) : $router.go('/')"
          class="bx bx-chevron-left absolute left-0 text-2xl cursor-pointer"
        ></i>
        <div class="text-lg font-semibold">
          โพสต์ของ {{ post ? getName(post.account) : "" }}
        </div>
        <div></div>
      </div>
      <Post
        v-if="post"
        :post="post"
        @referPost="referPost"
        @editPost="editPost"
        @getAllPost="getPost"
      ></Post>
    </div>
    <ManagePost ref="managePost" @getAllPost="getPost"></ManagePost>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Post from "@/components/Post.vue";
import NavbarSidebar from "@/components/NavbarSidebar.vue";
import ManagePost from "@/components/ManagePost.vue";

export default {
  data() {
    return {
      post_id: this.$route.params.post_id,
    };
  },
  components: {
    Post,
    NavbarSidebar,
    ManagePost,
  },
  methods: {
    referPost(post) {
      this.$refs.managePost.referPost(post);
    },
    editPost(post) {
      this.$refs.managePost.editPost(post);
    },
    async getPost() {
      try {
        await this.$store.dispatch("getPost", { post_id: this.post_id });
      } catch (error) {
        console.log(error);
        this.$router.push("/");
        return null;
      }
    },
    hasHistory() {
      return window.history.length > 2;
    },
  },
  async mounted() {
    const loading = this.$vs.loading();
    this.$store.commit("setCurrentPage", this.$route.name);
    await this.getPost();
    await this.$store.dispatch("getAllTag");
    loading.close();
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      post: "getPostView",
      allTag: "getAllTag",
    }),
  },
  watch: {
    "$route.params.post_id": async function () {
      this.post_id = this.$route.params.post_id;
      await this.getPost();
    },
  },
};
</script>
