<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div
      class="mt-16 xl:mb-0 mb-12 xl:w-2/3 w-full mx-auto xl:pt-4 pt-2 xl:px-0 px-2"
    >
      <div class="flex items-center mb-2">
        <div class="text-lg font-semibold">ผู้เชี่ยวชาญ</div>
      </div>
      <div class="flex items-center pb-4 border-b-2 overflow-auto">
        <div
          v-for="ac in allAccount"
          :key="ac.account_id"
          v-show="
            ac.account_id != account.account_id && ac.role == 'Psychologist'
          "
          class="filter drop-shadow-all mt-3 bg-white rounded-2xl flex flex-col items-center mx-2 py-5"
        >
          <vs-avatar size="60" class="cursor-pointer flex-shrink-0" circle>
            <img v-if="ac.image_url" :src="getFile(ac.image_url)" alt="" />
            <i v-else class="bx bx-user"></i>
          </vs-avatar>
          <div class="truncate w-32 text-sm text-center cursor-pointer mt-3">
            {{ getName(ac) }}
          </div>
          <div class="mt-2 text-xs break-words w-32 text-center mb-2">
            ผู้เชี่ยวชาญด้านครอบครัว
          </div>
          <vs-button circle @click="$router.push('/messages/' + ac.account_id)"
            ><div class="flex items-center text-sm">
              สนทนา<i class="bx bx-message-rounded-dots ml-1"></i></div
          ></vs-button>
        </div>
      </div>
      <div class="flex items-center mb-2 mt-4">
        <div class="text-lg font-semibold">ผู้รับฟัง</div>
      </div>
      <div class="flex items-center pb-4 border-b-2 overflow-auto">
        <div
          v-for="ac in allAccount"
          :key="ac.account_id"
          v-show="ac.account_id != account.account_id && ac.role == 'Member'"
          class="filter drop-shadow-all mt-3 bg-white rounded-2xl flex items-center mx-2 py-2 px-3"
        >
          <vs-avatar size="40" class="cursor-pointer flex-shrink-0 mr-1" circle>
            <img v-if="ac.image_url" :src="getFile(ac.image_url)" alt="" />
            <i v-else class="bx bx-user"></i>
          </vs-avatar>
          <div>
            <div class="truncate w-32 text-sm cursor-pointer mt-1">
              {{ getName(ac) }}
            </div>
            <div class="truncate text-xs w-32 mb-1">
              <span
                v-for="act in ac.account_topics"
                :key="act.account_topic_id"
              >
                #{{ act.topic.name }} ,
              </span>
              <div v-if="ac.account_topics.length == 0">พูดคุย ระบาย</div>
            </div>
          </div>
          <i
            @click="$router.push('/messages/' + ac.account_id)"
            class="bx bx-message-rounded-dots ml-1 text-2xl cursor-pointer"
          ></i>
        </div>
      </div>
      <div class="flex items-center mb-2 mt-4">
        <div class="text-lg font-semibold">บทความ</div>
      </div>
      <div
        class="flex items-center pt-3 pb-4 border-b-2 flex-wrap justify-center"
      >
        <div
          class="xl:w-1/3 xl:px-3 w-full pb-6"
          v-for="(post, i) in allPostArticle"
          :key="i"
        >
          <ArticleShow class="w-full h-96" :post="post"></ArticleShow>
        </div>
        <div class="flex justify-center my-6 w-full">
          <vs-pagination v-model="page" :length="length" class="w-full" />
        </div>
      </div>
    </div>
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
    return { page: 1, limit: 12, length: 1 };
  },
  components: {
    NavbarSidebar,
    ArticleShow,
  },
  methods: {
    async getPost() {
      const res = await this.$store.dispatch("getAllPostArticlePagination", {
        page: this.page,
        limit: this.limit,
        replace: true,
      });
      if (res.status == 200) {
        this.length = res.data.posts.count / this.limit;
      }
    },
  },
  async mounted() {
    const loading = this.$vs.loading();
    await this.$store.dispatch("getAllAccount");
    await this.getPost();
    loading.close();
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      allAccount: "getAllAccount",
      allPostArticle: "getAllPostArticle",
    }),
  },
  watch: {
    page: async function () {
      await this.getPost();
    },
  },
};
</script>
