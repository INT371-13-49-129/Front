<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div
      class="pt-16 w-full xl:h-full h-screen flex xl:flex-row flex-col xl:justify-center gap-2"
    >
      <div class="xl:w-30/100 w-full xl:px-4 px-3 xl:overflow-y-auto">
        <DataProfile :account_id="account.account_id"></DataProfile>
        <div
          class="filter flex drop-shadow-all w-full my-3 bg-white rounded-2xl justify-between items-center px-4"
        >
          <div class="h-24"></div>
          <div>
            <div>เขียนไดอารี่</div>
            <vs-button circle @click="$router.push({ name: 'MoodDiary' })">
              <div class="px-2">เขียน</div></vs-button
            >
          </div>
        </div>
      </div>
      <div
        ref="post"
        class="xl:w-2/4 w-full xl:h-full px-3 xl:overflow-y-auto xl:pb-0 pb-12"
      >
        <div class="flex justify-between xl:pt-4" v-show="false">
          <div><b>Mood :</b> Today, 9 September 2022</div>
          <div class="flex items-center">
            All
            <i class="bx bx-chevron-right"></i>
          </div>
        </div>
        <div
          v-show="false"
          class="flex mt-3 pb-1 xl:gap-7 gap-4 overflow-x-auto w-full"
        >
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
          <div v-observe-visibility="visibilityChanged">
            <b>Post</b>
          </div>
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
          <infinite-loading
            :identifier="infiniteId"
            @infinite="LodeMore"
            spinner="spiral"
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </div>
      </div>
      <div
        v-if="!isVisible"
        class="fixed bottom-6 right-12 xl:block hidden z-10"
      >
        <div
          class="cursor-pointer rounded-full bg-primary text-white h-11 w-11 flex justify-center items-center"
          @click="toTop()"
        >
          <i class="bx bx-up-arrow-alt text-3xl"></i>
        </div>
      </div>
    </div>
    <ManagePost ref="managePost" @getAllPost="getAllPost"></ManagePost>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import Post from "@/components/Post.vue";
import NavbarSidebar from "@/components/NavbarSidebar.vue";
import ManagePost from "@/components/ManagePost.vue";
import CreatePost from "@/components/CreatePost.vue";
import DataProfile from "@/components/DataProfile.vue";

export default {
  data() {
    return {
      page: 1,
      infiniteId: +new Date(),
      isVisible: false,
    };
  },
  components: {
    Post,
    NavbarSidebar,
    ManagePost,
    CreatePost,
    DataProfile,
    InfiniteLoading,
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
      this.page = 1;
      await this.$store.dispatch("getAllMyPostPagination", { page: this.page });
      this.infiniteId += 1;
    },
    async LodeMore($state) {
      this.page += 1;
      const res = await this.$store.dispatch("getAllMyPostPagination", {
        page: this.page,
      });
      if (res.data.posts.rows.length > 0) {
        $state.loaded();
      } else {
        $state.complete();
      }
    },
    visibilityChanged(isVisible) {
      this.isVisible = isVisible;
    },
    toTop() {
      this.$refs.post.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
  async mounted() {
    const loading = this.$vs.loading();
    this.$store.commit("setCurrentPage", this.$route.name);
    await this.$store.dispatch("getAllMyPostPagination", {
      page: this.page,
    });
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
