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
        class="flex items-center pt-3 pb-4 border-b-2 flex-wrap justify-around"
      >
        <div
          v-for="(post, i) in allPost"
          :key="i"
          class="p-4 overflow-hidden w-52 h-72 filter drop-shadow-all mb-6 bg-white rounded-2xl mx-2 flex flex-col cursor-pointer"
          @click="$router.push('/post/' + post.post_id)"
          v-show="post.post_type == 'Article'"
        >
          <div
            :style="
              post.cover_image_url
                ? {
                    'background-image': `url(${getFile(post.cover_image_url)})`,
                    'background-repeat': 'no-repeat',
                    'background-size': 'cover',
                  }
                : ''
            "
            class="w-full h-20 bg-blue-100 rounded-2xl bg-opacity-50 flex flex-col-reverse"
          >
            <div
              class="w-5/12 h-7 bg-blue-400 mb-3 rounded-r-md text-white flex items-center"
            >
              {{ post.tag ? post.tag.name : "" }}
            </div>
          </div>
          <div class="text-lg font-medium mt-2">{{ post.title }}</div>
          <div
            class="break-words mt-1 text-gray-500 truncate flex-grow"
            v-html="post.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
          ></div>
          <div class="text-sm flex items-center truncate">
            <vs-avatar
              size="30"
              class="cursor-pointer flex-shrink-0 mr-1"
              circle
            >
              <img
                v-if="post.account.image_url"
                :src="getFile(post.account.image_url)"
                alt=""
              />
              <i v-else class="bx bx-user"></i> </vs-avatar
            >{{ getName(post.account) }}
          </div>
        </div>
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
</template>
<script>
import { mapGetters } from "vuex";
import NavbarSidebar from "@/components/NavbarSidebar.vue";
import InfiniteLoading from "vue-infinite-loading";
import mixin from "@/mixin/mixin.js";

export default {
  mixins: [mixin],
  data() {
    return { page: 1, infiniteId: +new Date() };
  },
  components: {
    NavbarSidebar,
    InfiniteLoading,
  },
  methods: {
    async LodeMore($state) {
      this.page = parseInt(this.page) + 1;
      const res = await this.$store.dispatch("getAllPostPagination", {
        page: this.page,
        limit: 4,
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
    await this.$store.dispatch("getAllAccount");
    await this.$store.dispatch("getAllPostPagination", {
      page: this.page,
      limit: 4,
    });
    loading.close();
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      allAccount: "getAllAccount",
      allPost: "getAllPost",
    }),
  },
};
</script>
