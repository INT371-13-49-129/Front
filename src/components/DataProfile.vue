<template>
  <div
    class="filter drop-shadow-all w-full mt-3 bg-white rounded-2xl pb-6 overflow-y-auto"
  >
    <div class="h-1/6 w-full py-4 bg-blue-200 flex items-center">
      <vs-avatar size="60" circle class="ml-4">
        <img
          v-if="account.image_url"
          :src="getFile(account.image_url)"
          alt=""
        />
        <i v-else class="bx bx-user"></i>
      </vs-avatar>
    </div>
    <div class="px-4">
      <div class="flex justify-between items-center mt-1">
        <div class="text-lg font-semibold">{{ account.username }}</div>
        <vs-button
          @click="$router.push('/profile/edit')"
          circle
          border
          size="small"
        >
          <i class="bx bxs-edit"></i> Edit
        </vs-button>
      </div>
      <div class="flex justify-around my-2">
        <div class="flex flex-col items-center">
          <div class="font-semibold">{{ account.countPost }}</div>
          <div>โพสต์</div>
        </div>
        <div class="flex flex-col items-center">
          <div class="font-semibold">0</div>
          <div>กำลังติดตาม</div>
        </div>
        <div class="flex flex-col items-center">
          <div class="font-semibold">0</div>
          <div>ผู้ติดตาม</div>
        </div>
      </div>
      <div v-if="account.bio && account.bio != ''">
        <div class="text-base">Bio</div>
        <div
          v-html="account.bio.replace(/(?:\r\n|\r|\n)/g, '<br />')"
          class="text-sm flex items-center mb-3 mt-1 pb-2"
        ></div>
      </div>
      <div class="text-base py-2 border-t-2 border-b-2">ข้อมูลเพิ่มเติม</div>
      <div class="text-sm flex items-center my-2">
        <i class="bx bx-time-five text-base mr-1"></i>เกิด
        {{ getDate(account.date_of_birth) }}
      </div>
      <div class="text-sm flex items-center my-2">
        <i class="bx bx-calendar text-base mr-1"></i>joined
        {{ getDate(account.createdAt) }}
      </div>
      <div class="text-sm flex items-center my-2">
        <i class="bx bx-envelope text-base mr-1"></i>{{ account.email }}
      </div>
      <div class="text-sm flex items-center my-2 pl-3">
        * อีเมลไม่แสดงให้ผู้อื่นเห็น
      </div>
      <div class="text-base py-2 border-t-2 border-b-2">โหมดผู้รับฟัง</div>
      <div class="flex text-sm mt-3 items-center flex-wrap">
        <div class="text-sm mr-2">
          หัวข้อ : <span v-if="account.account_topics.length == 0">-</span>
        </div>
        <div
          v-for="account_topic in account.account_topics"
          :key="account_topic.account_topic_id"
          class="py-0.5 px-2 rounded-md border-2 filter mr-2 my-0.5 shadow-xs bg-white"
        >
          {{ account_topic.topic.name }}
        </div>
      </div>
      <div class="flex text-sm mt-3 items-center justify-between">
        <div>พร้อมที่จะเป็นผู้รับฟัง</div>
        <vs-switch v-model="is_listener" />
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
    return {
      is_listener: false,
    };
  },
  props: {
    account_id: {
      type: Number,
    },
  },
  async mounted() {
    if (this.account) {
      this.is_listener = this.account.is_listener;
    }
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
    }),
  },
};
</script>
