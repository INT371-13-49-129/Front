<template>
  <div
    class="overflow-hidden filter drop-shadow-all bg-white rounded-2xl flex cursor-pointer"
    :class="horizontal ? 'flex-row' : 'flex-col p-3'"
    @click="$router.push('/post/' + post.post_id)"
  >
    <div
      :style="{
        'background-image': post.cover_image_url
          ? `url(${getFile(post.cover_image_url)})`
          : `url( ${require('@/assets/img/bg.png')})`,
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': 'center',
      }"
      class="bg-blue-100 bg-opacity-50 flex flex-col-reverse flex-shrink-0"
      :class="horizontal ? 'w-32 mr-2' : 'w-full h-1/3 rounded-2xl'"
    >
      <div
        v-show="post.tag"
        class="w-1/2 h-7 bg-blue-400 mb-3 rounded-r-lg text-white flex items-center overflow-hidden text-xs px-1"
        :class="horizontal ? 'w-5/6' : 'w-1/2'"
      >
        <div class="truncate">{{ post.tag ? post.tag.name : "" }}</div>
      </div>
    </div>
    <div
      class="flex flex-col"
      :class="
        horizontal ? 'h-full pb-2 flex-shrink overflow-hidden mr-2' : 'h-2/3'
      "
    >
      <div class="font-medium mt-2 truncate flex-shrink-0 text-base">
        {{ post.title }}
      </div>
      <div
        class="break-words mt-1 text-gray-500 truncate flex-grow text-sm"
        v-html="post.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
      ></div>
      <div class="flex items-center truncate pt-2 flex-shrink-0 text-sm">
        <vs-avatar size="28" class="cursor-pointer flex-shrink-0 mr-1" circle>
          <img
            v-if="post.account.image_url"
            :src="getFile(post.account.image_url)"
            alt=""
          />
          <i v-else class="bx bx-user text-xs"></i> </vs-avatar
        >{{ getName(post.account) }}
      </div>
      <div
        class="flex items-center truncate pt-1.5 flex-shrink-0 text-xs text-gray-400"
      >
        <i class="bx bx-calendar text-base ml-1.5 mr-1 mb-0.5"></i
        >{{ fullTime(post.createdAt) }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import mixin from "@/mixin/mixin.js";

export default {
  mixins: [mixin],
  data() {
    return {};
  },
  props: {
    post: {
      type: Object,
      default() {
        return {
          post_id: "",
          account: {
            username: "",
          },
          text: "",
          createdAt: "",
        };
      },
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
  },
  methods: {},
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
    }),
  },
};
</script>
