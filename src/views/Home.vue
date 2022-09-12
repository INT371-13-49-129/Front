<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div class="mt-16 xl:w-160 w-full mx-auto xl:pt-4 pt-2 xl:px-0 px-2">
      <CreatePost
        v-if="isLogin"
        class="-mb-2 xl:mb-0"
        @modalNewPost="modalNewPost"
      ></CreatePost>
      <div v-for="post in allPost" :key="post.post_id">
        <Post
          :post="post"
          @referPost="referPost"
          @editPost="editPost"
          @getAllPost="getAllPost"
        ></Post>
      </div>
    </div>
    <ManagePost ref="managePost" @getAllPost="getAllPost"></ManagePost>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Post from "@/components/Post.vue";
import NavbarSidebar from "@/components/NavbarSidebar.vue";
import ManagePost from "@/components/ManagePost.vue";
import CreatePost from "@/components/CreatePost.vue";

export default {
  data() {
    return {};
  },
  components: {
    Post,
    NavbarSidebar,
    ManagePost,
    CreatePost,
  },
  methods: {
    referPost(post) {
      this.$refs.managePost.referPost(post);
    },
    modalNewPost() {
      this.$refs.managePost.modalNewPost();
    },
    editPost(post) {
      this.$refs.managePost.editPost(post);
    },
    async getAllPost() {
      await this.$store.dispatch("getAllPost");
    },
  },
  async mounted() {
    const loading = this.$vs.loading();
    this.$store.commit("setCurrentPage", this.$route.name);
    await this.$store.dispatch("getAllPost");
    await this.$store.dispatch("getAllTag");
    loading.close();
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
