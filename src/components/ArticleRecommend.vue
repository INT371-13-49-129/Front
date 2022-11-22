<template>
  <div>
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
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ArticleShow from "@/components/ArticleShow.vue";

export default {
  data() {
    return {};
  },
  components: {
    ArticleShow,
  },
  methods: {},
  async mounted() {
    const loading = this.$vs.loading();
    await this.$store.dispatch("getAllPostArticleRecommendPagination", {});
    loading.close();
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      allPostArticleRecommend: "getAllPostArticleRecommend",
    }),
  },
  watch: {},
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
