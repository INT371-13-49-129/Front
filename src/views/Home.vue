<template>
  <div class="w-full h-full overflow-y-auto flex justify-center">
    <NavbarSidebar
      @modalTagShow="
        (modalTagShow = true),
          (tags_filter = [...tags_filter_selected]),
          (postFollowShow = postFollow)
      "
      @searchfilter="searchfilter"
    ></NavbarSidebar>
    <div class="mt-20 xl:block pt-3 pb-4 hidden mr-6 xl:mb-0 mb-12">
      <div class="border-2 rounded-2xl border-gray-100 p-2">
        <div class="flex justify-between items-center mt-2 mb-4">
          <div class="text-lg font-medium ml-3">บทความน่าสนใจ</div>
          <div
            @click="$router.push({ name: 'Blog' })"
            class="flex items-center text-sm text-gray-400 cursor-pointer"
          >
            ทั้งหมด
            <i class="bx bx-chevron-right mt-1"></i>
          </div>
        </div>
        <div
          class="w-60 pb-3 px-3"
          v-for="(post, i) in allPostArticleRecommend"
          :key="i"
        >
          <ArticleShow class="w-full h-72" :post="post"></ArticleShow>
        </div>
      </div>
    </div>
    <div class="mt-16 xl:mb-0 mb-12 xl:w-160 w-full xl:pt-4 pt-2 xl:px-0 px-2">
      <CreatePost
        v-if="isLogin"
        class="-mb-2 xl:mb-0"
        @modalNewPost="modalNewPost"
      ></CreatePost>
      <div class="flex overflow-x-auto">
        <div
          v-if="postFollow"
          class="px-3 py-1 bg-gray-200 text-gray-600 rounded-full flex items-center mr-1 flex-shrink-0"
        >
          การติดตาม
          <i
            @click="getPostFollow(false)"
            class="bx bx-x text-lg ml-1 cursor-pointer"
          ></i>
        </div>
        <div
          v-for="(tag, i) in tags_filter_selected"
          :key="tag.id"
          class="px-3 py-1 bg-gray-200 text-gray-600 rounded-full flex items-center mr-1 flex-shrink-0"
        >
          {{ tag.name }}
          <i
            @click="tagsfilter(i)"
            class="bx bx-x text-lg ml-1 cursor-pointer"
          ></i>
        </div>
      </div>
      <div v-for="post in allPost" :key="post.post_id">
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
    <div class="mt-20 xl:block pt-3 pb-4 hidden ml-6 xl:mb-0 mb-12 w-60">
      <div
        class="ml-2 border-2 rounded-2xl border-gray-100 p-2 mb-4"
        v-if="isLogin"
      >
        <div class="text-lg font-medium mt-2 ml-2">โพสต์จาก</div>
        <div class="my-1 py-2 px-2">
          <div class="flex">
            <div
              class="px-3 py-1 rounded-full cursor-pointer"
              :class="!postFollow ? 'bg-blue-200' : 'bg-gray-100'"
              @click="getPostFollow(false)"
            >
              ทั้งหมด
            </div>
          </div>
          <div class="flex mt-4">
            <div
              class="px-3 py-1 rounded-full cursor-pointer"
              :class="postFollow ? 'bg-blue-200' : 'bg-gray-100'"
              @click="getPostFollow(true)"
            >
              การติดตาม
            </div>
          </div>
        </div>
      </div>
      <div class="ml-2 border-2 rounded-2xl border-gray-100 p-2">
        <div class="text-lg font-medium mt-2 ml-2">หัวข้อ</div>
        <div
          v-for="(tag, i) in allTag.filter((t) => t.tag_type === 'Category')"
          :key="tag.tag_id"
          class="my-1 py-2 px-2 flex truncate"
          @click="
            (tags_filter = [...tags_filter_selected]), selectTag(tag, true)
          "
          v-show="i < tagShow"
        >
          <div
            class="px-3 py-1 rounded-full cursor-pointer"
            :class="
              tags_filter_selected.find((t) => t.tag_id == tag.tag_id)
                ? 'bg-blue-200'
                : 'bg-gray-100'
            "
          >
            # {{ tag.name }}
          </div>
        </div>
        <div
          class="text-blue-500 text-sm cursor-pointer pl-2"
          v-show="
            allTag.filter((t) => t.tag_type === 'Category').length > tagShow
          "
          @click="tagShow += 5"
        >
          แสดงเพิ่มเติม
        </div>
      </div>
    </div>
    <ManagePost ref="managePost" @getAllPost="getAllPost"></ManagePost>
    <vs-dialog v-model="modalTagShow">
      <template #header>
        <h4 class="mt-2 text-lg font-semibold">ตัวกรอง</h4>
      </template>
      <div v-if="isLogin">
        <div class="flex">
          <div class="py-1 border-b-2 border-primary text-primary">
            โพสต์จาก
          </div>
        </div>
        <div class="mb-2">
          <div
            class="my-1 py-2 px-2 hover:bg-primary hover:bg-opacity-5 cursor-pointer"
            :class="
              !postFollowShow ? 'bg-primary bg-opacity-5 text-primary' : ''
            "
            @click="postFollowShow = false"
          >
            ทั้งหมด
          </div>
          <div
            class="my-1 py-2 px-2 hover:bg-primary hover:bg-opacity-5 cursor-pointer"
            :class="
              postFollowShow ? 'bg-primary bg-opacity-5 text-primary' : ''
            "
            @click="postFollowShow = true"
          >
            การติดตาม
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="py-1 border-b-2 border-primary text-primary">หมวดหมู่</div>
      </div>
      <div class="max-h-96 overflow-auto">
        <div
          v-for="tag in allTag.filter((t) => t.tag_type === 'Category')"
          :key="tag.tag_id"
          class="my-1 py-2 px-2 hover:bg-primary hover:bg-opacity-5 cursor-pointer"
          :class="
            tags_filter.find((t) => t.tag_id == tag.tag_id)
              ? 'bg-primary bg-opacity-5 text-primary'
              : ''
          "
          @click="selectTag(tag)"
        >
          {{ tag.name }}
        </div>
      </div>
      <vs-button
        class="w-full button-login"
        @click="
          (modalTagShow = false), (postFollow = postFollowShow), tagsfilter()
        "
      >
        ตกลง</vs-button
      >
    </vs-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import Post from "@/components/Post.vue";
import NavbarSidebar from "@/components/NavbarSidebar.vue";
import ManagePost from "@/components/ManagePost.vue";
import CreatePost from "@/components/CreatePost.vue";
import ArticleShow from "@/components/ArticleShow.vue";
import mixin from "@/mixin/mixin.js";

export default {
  mixins: [mixin],
  data() {
    return {
      page: 1,
      infiniteId: +new Date(),
      tags_filter_selected: [],
      tags_filter: [],
      tagShow: 5,
      tag_id: "",
      search: "",
      modalTagShow: false,
      postFollow: false,
      postFollowShow: false,
    };
  },
  components: {
    Post,
    NavbarSidebar,
    ManagePost,
    CreatePost,
    InfiniteLoading,
    ArticleShow,
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
    selectTag(tag, load = false) {
      if (this.tags_filter.find((t) => t.tag_id == tag.tag_id)) {
        this.tags_filter = this.tags_filter.filter(
          (t) => t.tag_id != tag.tag_id
        );
      } else {
        this.tags_filter.push(tag);
      }
      if (load) {
        this.tagsfilter();
      }
    },
    async tagsfilter(i = -1) {
      const loading = this.$vs.loading();
      if (i == -1) {
        this.tags_filter_selected = [...this.tags_filter];
      } else {
        this.tags_filter_selected.splice(i, 1);
      }
      this.tag_id = this.tags_filter_selected.map((t) => t.tag_id).join(",");
      await this.getAllPost();
      loading.close();
    },
    async searchfilter(searchInput) {
      const loading = this.$vs.loading();
      this.search = encodeURIComponent(searchInput);
      await this.getAllPost();
      loading.close();
    },
    getPostFollow(follow) {
      const loading = this.$vs.loading();
      this.postFollow = follow;
      this.getAllPost();
      loading.close();
    },
    async getAllPost() {
      this.page = 1;
      await this.$store.dispatch("getAllPostSearchTagPagination", {
        page: this.page,
        tag_id: this.tag_id,
        search: this.search,
        follow: this.postFollow,
      });
      this.infiniteId += 1;
    },
    async LodeMore($state) {
      this.page += 1;
      const res = await this.$store.dispatch("getAllPostSearchTagPagination", {
        page: this.page,
        tag_id: this.tag_id,
        search: this.search,
        follow: this.postFollow,
      });
      if (res.data.posts.rows.length > 0) {
        $state.loaded();
      } else {
        $state.complete();
      }
    },
  },
  async mounted() {
    const loading = this.$vs.loading();
    this.$store.commit("setCurrentPage", this.$route.name);
    await this.$store.dispatch("getAllPostSearchTagPagination", {
      page: this.page,
    });
    await this.$store.dispatch("getAllPostArticleRecommendPagination", {
      page: 1,
      limit: 9,
    });
    await this.$store.dispatch("getAllTag");
    loading.close();
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      allPost: "getAllPost",
      allPostArticleRecommend: "getAllPostArticleRecommend",
      allTag: "getAllTag",
    }),
  },
};
</script>
