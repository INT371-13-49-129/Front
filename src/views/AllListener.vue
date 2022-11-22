<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div
      class="mt-16 xl:mb-0 mb-12 xl:w-4/5 w-full mx-auto xl:pt-4 pt-2 xl:px-0 px-2"
    >
      <div class="flex items-center py-4 border-b-2 mb-2">
        <div class="text-2xl font-semibold">ผู้รับฟัง</div>
      </div>
      <div class="flex pb-3 px-2 items-center justify-between flex-wrap">
        <div class="text-gray-600 text-sm">
          {{ count != 0 ? (page - 1) * limit + 1 : 0 }} -
          {{ page * limit > count ? count : page * limit }} จากทั้งหมด
          {{ count }} <span class="hidden xl:inline">บัญชี</span>
        </div>
        <div class="flex items-center text-sm text-gray-500">
          <div class="text-sm hidden xl:block">แสดง</div>
          <div class="mx-1">
            <select
              class="border border-gray-300 rounded-md px-1 py-0.5 focus:outline-none"
              v-model="limit"
              @change="changeLimit"
            >
              <option v-for="i in 10" :key="i" :value="i * 4">
                {{ i * 4 }}
              </option>
            </select>
          </div>
          <div class="text-sm">บัญชีต่อหน้า</div>
        </div>
      </div>
      <div class="flex items-center w-full flex-wrap">
        <div
          class="xl:w-1/4 px-2 pb-4 w-full"
          v-for="ac in allAccountIsListener.accounts"
          :key="ac.account_id"
        >
          <Listener :account="ac"></Listener>
        </div>
      </div>
      <div class="flex justify-center xl:mt-4 xl:pb-4 pb-6 w-full">
        <vs-pagination v-model="page" :length="length" class="w-full" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import NavbarSidebar from "@/components/NavbarSidebar.vue";
import Listener from "@/components/Listener.vue";
import mixin from "@/mixin/mixin.js";

export default {
  mixins: [mixin],
  data() {
    return { page: 1, limit: 24, length: 1, count: 0 };
  },
  components: {
    NavbarSidebar,
    Listener,
  },
  methods: {
    async changeLimit() {
      const loading = this.$vs.loading();
      this.page = 1;
      await this.getListener();
      loading.close();
    },
    async getListener() {
      await this.$store.dispatch("getAllAccountIsListenerPagination", {
        page: this.page,
        limit: this.limit,
      });
      this.count = this.allAccountIsListener.count;
      this.length = Math.ceil(this.count / this.limit);
    },
  },
  async mounted() {
    const loading = this.$vs.loading();
    await this.getListener();
    loading.close();
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      allAccountIsListener: "getAllAccountIsListener",
    }),
  },
  watch: {
    page: async function () {
      const loading = this.$vs.loading();
      await this.getListener();
      loading.close();
    },
  },
};
</script>
