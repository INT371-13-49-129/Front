<template>
  <div>
    <div
      @click="$emit('modalNewPost')"
      class="filter block pt-6 pb-2 mb-6 cursor-pointer drop-shadow-all w-full mt-3 bg-white rounded-2xl justify-between items-center px-4"
    >
      <div class="mb-4 flex w-full">
        <vs-avatar circle class="flex-shrink-0 mr-4">
          <img
            v-if="account.image_url"
            :src="getFile(account.image_url)"
            alt=""
          />
          <i v-else class="bx bx-user"></i>
        </vs-avatar>
        <vs-input
          disabled
          type="text"
          class="input-comment flex-grow bg-gray-200 rounded-full"
          placeholder="คุณกำลังคิดอะไรอยู่..."
        />
      </div>
      <div class="py-2 border-t-2 flex w-full justify-around text-gray-400">
        <div class="flex items-center">
          <i class="bx bx-image mr-2"></i>
          รูปภาพ
        </div>
        <div class="flex items-center">
          <i class="bx bx-category-alt mr-2"></i>
          หมวดหมู่
        </div>
        <div class="flex items-center">
          <i class="bx bx-smile mr-2"></i>
          ความรู้สึก
        </div>
      </div>
    </div>
    <div class="fixed bottom-16 right-4 xl:hidden block z-10">
      <vs-avatar
        circle
        primary
        class="cursor-pointer"
        @click="$emit('modalNewPost')"
      >
        <i class="bx bx-plus"></i>
      </vs-avatar>
    </div>
  </div>
</template>
<script>
import mixin from "@/mixin/mixin.js";
import { mapGetters } from "vuex";

export default {
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {},
  computed: {
    ...mapGetters({
      account: "getAccount",
    }),
  },
};
</script>
