<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div
      class="mt-16 xl:mb-0 mb-12 xl:w-4/5 w-full mx-auto xl:pt-4 pt-2 xl:px-0 px-2"
    >
      <div class="flex items-center py-4 border-b-2 mb-2">
        <div class="text-2xl font-semibold">Blog</div>
      </div>
      <div class="flex items-center mb-2 mt-4">
        <div class="text-lg font-semibold">แนะนำ</div>
      </div>
      <div
        class="xl:flex items-center pt-3 pb-4 border-b-2 justify-center hidden"
      >
        <div class="xl:w-1/3 w-full xl:px-3 h-80 py-1">
          <ArticleShow
            class="w-full h-full"
            :post="allPostArticleRecommend[0]"
          ></ArticleShow>
        </div>
        <div class="xl:w-2/3 flex flex-wrap h-80">
          <div
            class="xl:w-1/2 xl:h-1/2 xl:px-3 w-full py-2"
            v-for="(post, i) in allPostArticleRecommend.slice(1)"
            :key="i"
            v-show="i < 4"
          >
            <ArticleShow
              class="w-full h-full"
              :post="post"
              :horizontal="true"
            ></ArticleShow>
          </div>
        </div>
      </div>
      <div class="xl:hidden">
        <carousel
          :per-page="1"
          class="flex items-center pt-3 pb-2 border-b-2 justify-center"
        >
          <slide
            class="w-full h-80 px-2 py-0.5"
            v-for="(post, i) in allPostArticleRecommend"
            :key="i"
            v-show="i < 5"
          >
            <ArticleShow class="w-full h-full" :post="post"></ArticleShow>
          </slide>
        </carousel>
      </div>
      <div class="flex py-3 items-center xl:justify-end">
        <div
          class="filter drop-shadow-all rounded-full bg-white flex items-center xl:w-auto xl:flex-grow-0 flex-grow"
        >
          <input
            type="text"
            placeholder="ค้นหา"
            class="ml-3 mr-2 my-1 xl:w-96 flex-grow"
            v-model.trim="searchInput"
            @keyup.enter="searchfilter"
          />
          <div
            @click="searchfilter"
            class="flex justify-center items-center mr-1 h-7 w-7 my-1 rounded-full bg-primary cursor-pointer"
          >
            <i class="bx bx-search text-white text-lg"></i>
          </div>
        </div>
        <i
          @click="
            (modalTagShow = true),
              (tags_filter = [...tags_filter_selected]),
              (postFollowShow = postFollow)
          "
          class="bx bx-filter-alt text-2xl ml-1 cursor-pointer"
        ></i>
      </div>
      <div class="flex pb-3 overflow-x-auto">
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
      <div class="flex pb-1 px-2 items-center justify-between flex-wrap">
        <div class="text-gray-600 text-sm">
          {{ count != 0 ? (page - 1) * limit + 1 : 0 }} -
          {{ page * limit > count ? count : page * limit }} จากทั้งหมด
          {{ count }} <span class="hidden xl:inline">บทความ</span>
        </div>
        <div class="flex items-center text-sm text-gray-500">
          <div class="text-sm hidden xl:block">แสดง</div>
          <div class="mx-1">
            <select
              class="border border-gray-300 rounded-md px-1 py-0.5 focus:outline-none"
              v-model="limit"
              @change="changeLimit"
            >
              <option v-for="i in 8" :key="i" :value="i * 6">
                {{ i * 6 }}
              </option>
            </select>
          </div>
          <div class="text-sm">บทความต่อหน้า</div>
        </div>
      </div>
      <div
        class="flex items-center pt-3 pb-4 border-b-2 flex-wrap justify-center"
      >
        <div
          class="xl:w-1/2 xl:px-3 w-full pb-4"
          v-for="(post, i) in allPostArticle"
          :key="i"
        >
          <ArticleShow
            class="w-full h-32"
            :post="post"
            :horizontal="true"
          ></ArticleShow>
        </div>
        <div class="flex justify-center my-6 w-full">
          <vs-pagination v-model="page" :length="length" class="w-full" />
        </div>
      </div>
    </div>
    <vs-dialog v-model="modalTagShow">
      <template #header>
        <h4 class="mt-2 text-lg font-semibold">ตัวกรอง</h4>
      </template>
      <div v-if="isLogin">
        <div class="flex">
          <div class="py-1 border-b-2 border-primary text-primary">
            บทความจาก
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
          v-for="tag in allTag.filter((t) => t.tag_type === 'Article')"
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
import NavbarSidebar from "@/components/NavbarSidebar.vue";
import ArticleShow from "@/components/ArticleShow.vue";
import mixin from "@/mixin/mixin.js";

export default {
  mixins: [mixin],
  data() {
    return {
      page: 1,
      limit: 12,
      length: 1,
      count: 0,
      tag_id: "",
      search: "",
      searchInput: "",
      modalTagShow: false,
      tags_filter: [],
      tags_filter_selected: [],
      postFollow: false,
      postFollowShow: false,
    };
  },
  components: {
    NavbarSidebar,
    ArticleShow,
  },
  methods: {
    async changeLimit() {
      const loading = this.$vs.loading();
      this.page = 1;
      await this.getPost();
      loading.close();
    },
    selectTag(tag) {
      if (this.tags_filter.find((t) => t.tag_id == tag.tag_id)) {
        this.tags_filter = this.tags_filter.filter(
          (t) => t.tag_id != tag.tag_id
        );
      } else {
        this.tags_filter.push(tag);
      }
    },
    async searchfilter() {
      const loading = this.$vs.loading();
      this.search = encodeURIComponent(this.searchInput);
      this.page = 1;
      await this.getPost();
      loading.close();
    },
    async tagsfilter(i = -1) {
      const loading = this.$vs.loading();
      if (i == -1) {
        this.tags_filter_selected = [...this.tags_filter];
      } else {
        this.tags_filter_selected.splice(i, 1);
      }
      this.tag_id = this.tags_filter_selected.map((t) => t.tag_id).join(",");
      this.page = 1;
      await this.getPost();
      loading.close();
    },
    async getPostFollow(follow) {
      const loading = this.$vs.loading();
      this.postFollow = follow;
      this.page = 1;
      await this.getPost();
      loading.close();
    },
    async getPost() {
      const res = await this.$store.dispatch(
        "getAllPostArticleSearchTagPagination",
        {
          page: this.page,
          limit: this.limit,
          tag_id: this.tag_id,
          search: this.search,
          replace: true,
          follow: this.postFollow,
        }
      );
      if (res.status == 200) {
        this.count = res.data.posts.count;
        this.length = Math.ceil(this.count / this.limit);
      }
    },
    //
  },
  async mounted() {
    const loading = this.$vs.loading();
    await this.$store.dispatch("getAllPostArticleRecommendPagination", {});
    await this.getPost();
    await this.$store.dispatch("getAllTag");
    loading.close();
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      allTag: "getAllTag",
      allPostArticle: "getAllPostArticle",
      allPostArticleRecommend: "getAllPostArticleRecommend",
    }),
  },
  watch: {
    page: async function () {
      const loading = this.$vs.loading();
      await this.getPost();
      loading.close();
    },
  },
};
</script>
<style>
.VueCarousel-dot-container {
  margin-top: 0 !important;
}
.VueCarousel-dot {
  margin-top: 0.5rem !important;
}
</style>
