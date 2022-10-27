<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div class="pt-16 xl:pb-0 pb-12 xl:w-2/3 w-full mx-auto h-full">
      <div
        class="filter xl:drop-shadow-all w-full mt-3 xl:h-95/100 bg-white rounded-2xl p-4 overflow-y-auto"
      >
        <MessageConnect></MessageConnect>
      </div>
    </div>
  </div>
</template>
<script>
import NavbarSidebar from "@/components/NavbarSidebar.vue";
import MessageConnect from "@/components/MessageConnect.vue";

export default {
  data() {
    return {};
  },
  components: {
    NavbarSidebar,
    MessageConnect,
  },
  methods: {},
  mounted() {},
};
</script>
