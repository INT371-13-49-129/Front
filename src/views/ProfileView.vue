<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div
      class="pt-16 w-full xl:h-full h-screen flex xl:flex-row flex-col xl:justify-center gap-2"
    >
      <div class="xl:w-30/100 w-full xl:px-4 px-3 xl:overflow-y-auto">
        <DataProfile :account_id="parseInt(account_id)"></DataProfile>
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
      <div
        ref="post"
        class="xl:w-2/4 w-full xl:h-full px-3 xl:overflow-y-auto xl:pb-0 pb-12"
      >
        <div class="mt-4">
          <div v-observe-visibility="visibilityChanged">
            <b>Post</b>
          </div>
          <div class="mb-2" v-for="post in allPost" :key="post.post_id">
            <Post
              :post="post"
              @referPost="referPost"
              @getAllPost="getAllPost"
            ></Post>
          </div>
          <infinite-loading
            :identifier="infiniteId"
            @infinite="LodeMore"
            spinner="spiral"
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div
          ></infinite-loading>
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
import DataProfile from "@/components/DataProfile.vue";

export default {
  data() {
    return {
      account_id: this.$route.params.account_id,
      page: 1,
      infiniteId: +new Date(),
      isVisible: false,
    };
  },
  components: {
    Post,
    NavbarSidebar,
    ManagePost,
    DataProfile,
    InfiniteLoading,
  },
  methods: {
    referPost(post) {
      this.$refs.managePost.referPost(post);
    },
    async getAllPost() {
      if (this.isLogin && this.account.account_id == this.account_id) {
        this.$router.push("/profile");
        return null;
      }
      try {
        this.page = 1;
        await this.$store.dispatch("getAllPostAccountPagination", {
          account_id: this.account_id,
          page: this.page,
        });
        this.infiniteId += 1;
      } catch (error) {
        console.log(error);
        this.$router.push("/");
        return null;
      }
    },
    async LodeMore($state) {
      this.page += 1;
      const res = await this.$store.dispatch("getAllPostAccountPagination", {
        account_id: this.account_id,
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
    await this.getAllPost();
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
<style lang="css">
.input-comment .vs-input {
  width: 100% !important;
  border-radius: 9999px !important;
}
</style>
