<template>
  <div
    class="filter drop-shadow-all bg-white rounded-2xl flex items-center py-2 px-3 w-full"
  >
    <vs-avatar size="40" class="cursor-pointer flex-shrink-0 mr-1" circle>
      <img v-if="account.image_url" :src="getFile(account.image_url)" alt="" />
      <i v-else class="bx bx-user"></i>
    </vs-avatar>
    <div class="flex-grow ml-1">
      <div
        class="truncate text-sm font-semibold mt-1 mb-2 hover:underline cursor-pointer"
        @click.stop="$router.push('/profile/' + account.account_id)"
      >
        {{ getName(account) }}
      </div>
      <div class="truncate text-xs mb-1">
        <span v-for="act in account.account_topics" :key="act.account_topic_id">
          #{{ act.topic.name }} ,
        </span>
        <div v-if="account.account_topics.length == 0">พูดคุย ระบาย</div>
      </div>
    </div>
    <i
      @click="$router.push('/messages/' + account.account_id)"
      class="bx bx-message-rounded-dots ml-1 text-2xl cursor-pointer"
    ></i>
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
    account: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {},
  async mounted() {},
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      myAccount: "getAccount",
    }),
  },
  watch: {},
};
</script>
