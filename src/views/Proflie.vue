<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div class="pt-16 w-full h-full flex justify-center">
      <div
        class="filter xl:drop-shadow-all w-1/4 mt-3 xl:h-3/4 bg-white rounded-2xl overflow-y-auto"
      >
        <div class="h-1/6 w-full bg-blue-200 flex items-center">
          <vs-avatar size="60" circle class="ml-4">
            <i class="bx bx-user"></i>
          </vs-avatar>
        </div>
        <div class="px-4">
          <div class="flex justify-between items-center mt-1">
            <div class="text-lg font-semibold">Priyanut Buadum</div>
            <vs-button circle border size="small">
              <i class="bx bxs-edit"></i> Edit
            </vs-button>
          </div>
          <div class="text-sm">ข้อมูล</div>
          <div class="text-sm flex items-center my-2">
            <i class="bx bx-time-five text-base mr-1"></i>เกิด 11 กุมภาพันธ์
            2544
          </div>
          <div class="text-sm flex items-center my-2">
            <i class="bx bx-calendar text-base mr-1"></i>joined 04/08/2018
          </div>
          <div class="text-sm mt-3">Intro</div>
          <div class="text-sm flex items-center my-2">
            🍁If today sucks, tomorrow will be better🍁 <br />
            🍁If tomorrow still sucks, you just have to try harder.🍁
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NavbarSidebar from "@/components/NavbarSidebar.vue";

export default {
  data() {
    return {};
  },
  components: {
    NavbarSidebar,
  },
  methods: {},
  mounted() {},
};
</script>
