<template>
  <div
    class="filter drop-shadow-all mt-3 bg-white rounded-2xl flex flex-col items-center mx-2 pb-5"
  >
    <div class="pt-2 pb-1 ml-2 w-full">
      <div
        class="flex items-center text-sm cursor-pointer"
        @click="getAccountReviewer()"
      >
        <i class="bx bx-star mr-1 text-yellow-300"></i>
        {{ parseFloat(account.avgRatings).toFixed(1) }} ({{
          account.account_reviewer.length
        }})
      </div>
    </div>
    <vs-avatar size="60" class="cursor-pointer flex-shrink-0" circle>
      <img v-if="account.image_url" :src="getFile(account.image_url)" alt="" />
      <i v-else class="bx bx-user"></i>
    </vs-avatar>
    <div
      class="truncate w-40 text-sm text-center font-semibold mt-3 hover:underline cursor-pointer"
      @click.stop="$router.push('/profile/' + account.account_id)"
    >
      {{ getName(account) }}
    </div>
    <div
      class="mt-2 text-xs break-words w-40 h-16 text-center mb-2 overflow-hidden"
    >
      {{ account.description }}
    </div>
    <vs-button circle @click="$router.push('/messages/' + account.account_id)"
      ><div class="flex items-center text-sm">
        สนทนา<i class="bx bx-message-rounded-dots ml-1"></i></div
    ></vs-button>
    <vs-dialog v-model="modalAccountReviewer">
      <template #header>
        <div class="mt-2 text-lg font-semibold">รีวิว</div>
      </template>
      <div class="border-t-2 -mt-2">
        <div
          v-for="reviewer in account_reviewer"
          :key="reviewer.rating_id"
          class="mt-3"
        >
          <div class="border-2 p-2 rounded-2xl">
            <div class="flex items-center">
              <vs-avatar circle class="flex-shrink-0 mr-3">
                <img
                  v-if="reviewer.account_reviewer.image_url"
                  :src="getFile(reviewer.account_reviewer.image_url)"
                  alt=""
                />
                <i v-else class="bx bx-user"></i>
              </vs-avatar>
              <div
                class="font-semibold flex-grow hover:underline cursor-pointer"
                @click.stop="
                  $router.push(
                    '/profile/' + reviewer.account_reviewer.account_id
                  )
                "
              >
                {{ getName(reviewer.account_reviewer) }}
              </div>
            </div>
            <div class="flex mt-2 items-center">
              <div class="flex items-center mt-0.5 mr-1">
                <div v-for="i in 5" :key="i">
                  <i
                    class="bx text-yellow-300"
                    :class="i <= reviewer.rating_score ? 'bxs-star' : 'bx-star'"
                  ></i>
                </div>
              </div>
              {{ getDate(reviewer.updated_at) }}
            </div>
            <div class="ml-0.5">
              {{ reviewer.review }}
            </div>
          </div>
        </div>
      </div>
    </vs-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import mixin from "@/mixin/mixin.js";

export default {
  mixins: [mixin],
  data() {
    return {
      modalAccountReviewer: false,
      account_reviewer: [],
    };
  },
  props: {
    account: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    async getAccountReviewer() {
      const loading = this.$vs.loading();
      const res = await this.$store.dispatch(
        "getRatingByAccountId",
        this.account.account_id
      );
      this.account_reviewer = res.data.rating;
      this.modalAccountReviewer = true;
      loading.close();
    },
  },
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
