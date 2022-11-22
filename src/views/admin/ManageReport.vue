<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div class="pt-16 xl:pb-0 pb-12 w-full h-auto flex justify-center"></div>
  </div>
</template>
<script>
import mixin from "@/mixin/mixin.js";
import { mapGetters } from "vuex";
import NavbarSidebar from "@/components/NavbarSidebar.vue";

export default {
  mixins: [mixin],
  data() {
    return {};
  },
  components: {
    NavbarSidebar,
  },
  methods: {},
  mounted() {},
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
</style>
