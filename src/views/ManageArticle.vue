<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div
      class="mt-16 xl:mb-0 mb-12 xl:w-2/3 w-full mx-auto xl:pt-4 pt-2 xl:px-0 px-2"
    >
      <div class="flex justify-center items-center py-4 border-b-2 mb-2">
        <i
          @click="hasHistory() ? $router.go(-1) : $router.go('/')"
          class="bx bx-chevron-left text-2xl cursor-pointer"
        ></i>
        <div class="text-lg font-semibold flex-grow">สร้างบทความ</div>
        <vs-button circle border @click="clear()">
          <div class="px-2">Cancel</div></vs-button
        >
        <vs-button
          circle
          :disabled="text == '' || title == ''"
          @click="text == '' || title == '' ? '' : submitFrom()"
        >
          <div class="px-2">Save</div></vs-button
        >
      </div>
      <div class="flex xl:flex-row flex-col xl:items-center py-4">
        <div class="w-32 mb-1 xl:mb-0">รูปปก</div>
        <div class="flex flex-grow items-center">
          <div class="w-20 mr-2">
            <vue-load-image v-if="img">
              <img slot="image" :src="img" alt="" />
              <img
                slot="preloader"
                src="@/assets/img/preload.svg"
                class="animate-pulse object-contain w-full h-full"
              />
            </vue-load-image>
            <i v-else class="bx bx-image-alt text-3xl"></i>
          </div>
          <div class="flex-grow"></div>
          <div class="">
            <label
              for="url"
              class="px-2 py-1 border-2 rounded-md text-sm cursor-pointer"
            >
              เพิ่มรูป
            </label>
            <input
              class="hidden"
              type="file"
              id="url"
              ref="myFiles"
              accept=".jpg, .jpeg, .png"
              @change="previewFiles"
            />
          </div>
        </div>
      </div>
      <div v-if="false" class="flex xl:flex-row flex-col xl:items-center py-4">
        <div class="w-32 mb-1 xl:mb-0">รูปบทความ</div>
        <div class="flex flex-grow items-center">
          <div class="mr-2">
            <div v-if="imgs.length > 0" class="flex items-center gap-2">
              <div
                v-for="(im, i) in imgs"
                :key="i"
                class="w-20 flex flex-col items-center"
              >
                <vue-load-image>
                  <img slot="image" :src="im.url" alt="" />
                  <img
                    slot="preloader"
                    src="@/assets/img/preload.svg"
                    class="animate-pulse object-contain w-full h-full"
                  />
                </vue-load-image>
                <i
                  @click="imgs = imgs.filter((_, index) => index != i)"
                  class="bx bx-x text-2xl"
                ></i>
              </div>
            </div>
            <i v-else class="bx bx-image-alt text-3xl"></i>
          </div>
          <div class="flex-grow"></div>
          <div class="">
            <label
              for="url2"
              class="px-2 py-1 border-2 rounded-md text-sm cursor-pointer"
            >
              เพิ่มรูป
            </label>
            <input
              class="hidden"
              type="file"
              id="url2"
              ref="myFiles2"
              accept=".jpg, .jpeg, .png"
              @change="previewFiles2"
            />
          </div>
        </div>
      </div>
      <div class="flex xl:flex-row flex-col xl:items-center py-4 w-full">
        <div class="w-32">ชื่อบทความ</div>
        <vs-input
          v-model="title"
          type="text"
          class="input-comment flex-grow w-full xl:w-auto"
        >
        </vs-input>
      </div>
      <div class="flex xl:flex-row flex-col xl:items-center">
        <div class="w-32 mr-4">หมวดหมู่บทความ</div>
        <select
          class="bg-white border-2 px-2 text-gray-600 border-gray-200 rounded-xl focus:outline-none w-full py-1.5"
          v-model="tag_id"
        >
          <option
            v-for="(tag, i) in allTag.filter((t) => t.tag_type === 'Article')"
            :key="i"
            :value="tag.tag_id"
          >
            {{ tag.name }}
          </option>
        </select>
      </div>
      <div class="flex xl:flex-row flex-col xl:items-center py-4 w-full">
        <div class="w-32">ชื่อเจ้าของบทความ</div>
        <vs-input
          v-model="owner"
          type="text"
          class="input-comment flex-grow w-full xl:w-auto"
        >
        </vs-input>
      </div>
      <div class="pt-2">
        <div class="text-base font-semibold">สร้างบทความ</div>
        <textarea
          v-model="text"
          placeholder=""
          class="w-full focus:outline-none border-2 rounded-lg h-36 p-4"
        ></textarea>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import NavbarSidebar from "@/components/NavbarSidebar.vue";
import VueLoadImage from "vue-load-image";

export default {
  data() {
    return {
      files: "",
      img: null,
      imgs: [],
      tag_id: null,
      title: "",
      text: "",
      owner: "",
    };
  },
  components: {
    NavbarSidebar,
    VueLoadImage,
  },
  methods: {
    hasHistory() {
      return window.history.length > 2;
    },
    previewFiles() {
      this.files = this.$refs.myFiles.files[0];
      this.img = URL.createObjectURL(this.files);
      this.upLoadFile = true;
    },
    previewFiles2() {
      const file = this.$refs.myFiles2.files[0];
      this.imgs.push({ url: URL.createObjectURL(file), file });
    },
    clear() {
      this.files = "";
      this.img = null;
      this.imgs = [];
      this.tag_id = null;
      this.title = "";
      this.text = "";
      this.owner = "";
      this.cover_image_url = "";
    },
    async submitFrom() {
      if (this.img) {
        const res = await this.$store.dispatch("uploadFile", this.files);
        this.cover_image_url = res.data.file_id;
      }
      await this.$store.dispatch("createPostArticle", {
        text: this.text,
        tag_id: this.tag_id,
        cover_image_url: this.cover_image_url,
        owner: this.owner,
        title: this.title,
      });
      this.$vs.notification({
        progress: "auto",
        flat: true,
        color: "primary",
        position: "top-right",
        title: "สร้างบทความสำเสร็จ",
      });
      this.clear();
    },
  },
  async mounted() {
    const loading = this.$vs.loading();
    await this.$store.dispatch("getAllTag");
    loading.close();
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      allTag: "getAllTag",
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
