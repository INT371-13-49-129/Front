<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div class="pt-16 xl:pb-0 pb-12 w-full h-auto flex justify-center">
      <div class="w-full xl:w-10/12">
        <div class="py-4 font-medium text-lg">คำขอเป็นผู้เชี่ยวชาญ</div>
        <table class="h-auto w-full">
          <thead>
            <tr>
              <th class="text-left">Id</th>
              <th class="text-left">Username</th>
              <th class="text-left">Name</th>
              <th class="text-left">Email</th>
              <th class="text-left">Status</th>
              <th class="text-left">เอกสารยืนยัน</th>
              <th class="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(ac, index) in allAccountRequestPsychologist"
              :key="index"
            >
              <td>{{ ac.account_id }}</td>
              <td>{{ ac.username }}</td>
              <td>{{ ac.name }}</td>
              <td>{{ ac.email }}</td>
              <td>{{ ac.approve }}</td>
              <td>
                <div
                  v-for="(file, i) in ac.file_approve"
                  :key="i"
                  class="my-0.5 flex items-center"
                >
                  <a
                    :href="getFile(file.url)"
                    target="_blank"
                    class="hover:underline cursor-pointer ml-2"
                  >
                    {{ file.name }}
                  </a>
                </div>
              </td>
              <td>
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mr-1"
                  @click="approveRequestPsychologist(ac.account_id)"
                >
                  อนุมัติ
                </button>
                <button
                  class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md ml-1"
                  @click="rejectRequestPsychologist(ac.account_id)"
                >
                  ไม่อนุมัติ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import mixin from "@/mixin/mixin.js";
import { mapGetters } from "vuex";
import NavbarSidebar from "@/components/NavbarSidebar.vue";

export default {
  mixins: [mixin],
  data() {
    return {
      allAccountRequestPsychologist: [],
    };
  },
  components: {
    NavbarSidebar,
  },
  methods: {
    async getAllAccountRequestPsychologist() {
      this.allAccountRequestPsychologist = await this.$store.dispatch(
        "getAllAccountRequestPsychologist"
      );
    },
    async approveRequestPsychologist(account_id) {
      const res = await this.$store.dispatch(
        "approveRequestPsychologist",
        account_id
      );
      if (res.status === 200) {
        this.$vs.notification({
          progress: "auto",
          flat: true,
          color: "primary",
          position: "top-right",
          title: "อนุมัติคำขอเป็นผู้เชี่ยวชาญสำเร็จ",
        });
        await this.getAllAccountRequestPsychologist();
      }
    },
    async rejectRequestPsychologist(account_id) {
      const res = await this.$store.dispatch(
        "rejectRequestPsychologist",
        account_id
      );
      if (res.status === 200) {
        this.$vs.notification({
          progress: "auto",
          flat: true,
          color: "primary",
          position: "top-right",
          title: "ไม่อนุมัติคำขอเป็นผู้เชี่ยวชาญสำเร็จ",
        });
        await this.getAllAccountRequestPsychologist();
      }
    },
  },
  async mounted() {
    await this.getAllAccountRequestPsychologist();
  },
  computed: {
    ...mapGetters({
      account: "getAccount",
    }),
  },
  watch: {},
};
</script>
<style lang="css">
.input-comment .vs-input {
  width: 100% !important;
  border-radius: 0.75rem !important;
  background-color: white;
  border-color: rgba(229, 231, 235, 1);
}
td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem;
}
th {
  border: 1px solid #e5e7eb;
  padding: 1rem;
}
</style>
