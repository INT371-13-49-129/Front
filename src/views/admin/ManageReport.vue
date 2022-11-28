<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div class="pt-16 xl:pb-0 pb-12 w-full h-auto flex justify-center">
      <div class="w-full xl:w-10/12">
        <div class="py-4 font-medium text-lg">รายงาน</div>
        <table v-if="allReport && allReport.length > 0" class="h-auto w-full">
          <thead>
            <tr>
              <th
                v-for="(key, index) in Object.keys(allReport[0])"
                :key="index"
                class="text-left"
                v-show="
                  key != 'is_delete' && key != 'createdAt' && key != 'updatedAt'
                "
              >
                {{ key ? key : "-" }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ar, index) in allReport" :key="index">
              <td
                v-show="
                  k != 'is_delete' && k != 'createdAt' && k != 'updatedAt'
                "
                v-for="(v, k) in ar"
                :key="k"
              >
                {{ v ? v : "-" }}
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
      allReport: [],
    };
  },
  components: {
    NavbarSidebar,
  },
  methods: {
    async getAllReport() {
      this.allReport = await this.$store.dispatch("getAllReport");
      console.log(this.allReport);
    },
  },
  async mounted() {
    await this.getAllReport();
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
