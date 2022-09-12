<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div
      class="pt-16 w-full xl:h-full h-screen flex xl:flex-row flex-col xl:justify-center gap-2"
    >
      <div class="xl:w-30/100 w-full xl:px-4 px-3 xl:overflow-y-auto">
        <DataProfile></DataProfile>
        <div
          class="filter flex drop-shadow-all w-full my-3 bg-white rounded-2xl justify-between items-center px-4"
        >
          <div class="h-24"></div>
          <div>
            <div>เขียนไดอารี่</div>
            <vs-button circle> <div class="px-2">เขียน</div></vs-button>
          </div>
        </div>
      </div>
      <div class="xl:w-2/4 w-full xl:h-full px-3 xl:overflow-y-auto">
        <div class="flex justify-between xl:pt-4">
          <div><b>Mood :</b> Today, 9 September 2022</div>
          <div class="flex items-center">
            All
            <i class="bx bx-chevron-right"></i>
          </div>
        </div>
        <div class="flex mt-3 pb-1 xl:gap-7 gap-4 overflow-x-auto w-full">
          <div
            class="px-1 w-20 flex-shrink-0 rounded-2xl border-primary border-2 border-opacity-70 filter drop-shadow-all bg-white"
            v-for="i in 7"
            :key="i"
          >
            <div class="font-medium mt-1">{{ i }}</div>
            <div>Sat</div>
            <div class="float-right">
              <i class="bx bx-smile text-xl text-green-400 mb-1"></i>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <div><b>Post</b></div>
          <CreatePost
            class="-mb-2 xl:mb-0"
            @modalNewPost="modalNewPost"
          ></CreatePost>
          <div class="mb-2" v-for="post in allMyPost" :key="post.post_id">
            <Post
              :post="post"
              @referPost="referPost"
              @editPost="editPost"
              @getAllPost="getAllPost"
            ></Post>
          </div>
        </div>
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
import DataProfile from "@/components/DataProfile.vue";

export default {
  data() {
    return {};
  },
  components: {
    Post,
    NavbarSidebar,
    ManagePost,
    CreatePost,
    DataProfile,
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
      await this.$store.dispatch("getAllMyPost");
    },
  },
  async mounted() {
    const loading = this.$vs.loading();
    this.$store.commit("setCurrentPage", this.$route.name);
    await this.$store.dispatch("getAllMyPost");
    await this.$store.dispatch("getAllTag");
    loading.close();
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      allMyPost: "getAllMyPost",
      allTag: "getAllTag",
    }),
  },
};
</script>
<style lang="css">
.input-comment .vs-input {
  width: 100% !important;
  border-radius: 9999px !important;
}
</style>
