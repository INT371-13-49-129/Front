<template>
  <div class="w-full h-full overflow-y-auto flex justify-center">
    <NavbarSidebar></NavbarSidebar>
    <div class="mt-16 xl:mb-0 mb-12 xl:w-176 w-full xl:pt-4 pt-2 xl:px-0 px-2">
      <CreatePost
        v-if="isLogin"
        class="-mb-2 xl:mb-0"
        @modalNewPost="modalNewPost"
      ></CreatePost>
      <div
        v-for="post in allPost"
        :key="post.post_id"
        v-show="post.post_type == 'Post'"
      >
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
    <div class="mt-20 xl:block pt-3 pb-4 hidden ml-4">
      <div class="text-lg font-medium mb-4 ml-3">บทความน่าสนใจ</div>
      <div
        v-for="(post, i) in allPost"
        :key="i"
        class="p-4 ml-2 overflow-hidden w-52 h-72 filter drop-shadow-all mb-6 bg-white rounded-2xl mx-2 flex flex-col cursor-pointer"
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
          <vs-avatar size="30" class="cursor-pointer flex-shrink-0 mr-1" circle>
            <img
              v-if="post.account.image_url"
              :src="getFile(post.account.image_url)"
              alt=""
            />
            <i v-else class="bx bx-user"></i> </vs-avatar
          >{{ getName(post.account) }}
        </div>
      </div>
      <div class="mt-4 ml-2">
        <div class="text-lg font-medium mt-6 ml-2">หัวข้อ</div>
        <div
          v-for="tag in allTag.filter((t) => t.tag_type === 'Category')"
          :key="tag.tag_id"
          class="my-1 py-2 px-2 flex"
          @click="selectTag(tag)"
        >
          <div
            class="px-3 py-0.5 rounded-full cursor-pointer"
            :class="
              tag_select.tag_id == tag.tag_id ? 'bg-blue-100' : 'bg-gray-200'
            "
          >
            # {{ tag.name }}
          </div>
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
import mixin from "@/mixin/mixin.js";

export default {
  mixins: [mixin],
  data() {
    return {
      page: 1,
      infiniteId: +new Date(),
      tag_select: {},
    };
  },
  components: {
    Post,
    NavbarSidebar,
    ManagePost,
    CreatePost,
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
    selectTag(tag) {
      this.tag_select = tag;
    },
    async getAllPost() {
      this.page = 1;
      await this.$store.dispatch("getAllPostPagination", { page: this.page });
      this.infiniteId += 1;
    },
    async LodeMore($state) {
      this.page += 1;
      const res = await this.$store.dispatch("getAllPostPagination", {
        page: this.page,
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
    await this.$store.dispatch("getAllPostPagination", { page: this.page });
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
