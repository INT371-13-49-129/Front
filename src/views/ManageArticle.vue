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
        <div class="text-lg font-semibold flex-grow">
          {{ $route.name == "EditArticle" ? "แก้ไขบทความ" : "สร้างบทความ" }}
        </div>
        <vs-button
          circle
          border
          @click="$route.name === 'EditArticle' ? getPost() : clear()"
        >
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
            <vue-load-image v-else-if="cover_image_url">
              <img slot="image" :src="getFile(cover_image_url)" alt="" />
              <img
                slot="preloader"
                src="@/assets/img/preload.svg"
                class="animate-pulse object-contain w-full h-full"
              />
            </vue-load-image>
            <i v-else class="bx bx-image-alt text-3xl"></i>
          </div>
          <div class="flex-grow"></div>
          <div class="flex-shrink-0">
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
      <div class="flex xl:flex-row flex-col xl:items-center py-4">
        <div class="w-32 mb-1 xl:mb-0">รูปบทความ</div>
        <div class="flex flex-grow items-center">
          <div class="mr-2">
            <div
              v-if="imgs.length > 0"
              class="flex items-center gap-2 flex-wrap"
            >
              <div
                v-for="(im, i) in imgs"
                :key="i"
                class="w-20 flex flex-col items-center"
              >
                <vue-load-image
                  class="h-20 flex items-center mb-0.5 overflow-hidden"
                >
                  <img
                    slot="image"
                    :src="im.isNew ? im.url : getFile(im.url)"
                    alt=""
                  />
                  <img
                    slot="preloader"
                    src="@/assets/img/preload.svg"
                    class="animate-pulse object-contain w-full h-full"
                  />
                </vue-load-image>
                <div class="text-gray-400">
                  <i
                    @click="i != 0 ? swapArrayElements(i, i - 1) : ''"
                    class="bx bx-chevron-left text-xl cursor-pointer rounded-full"
                    :class="
                      i != 0 ? 'hover:bg-gray-200 p-0.5 hover:text-black' : ''
                    "
                  ></i>
                  <i
                    @click="
                      i != imgs.length - 1 ? swapArrayElements(i, i + 1) : ''
                    "
                    class="bx bx-chevron-right text-xl cursor-pointer rounded-full"
                    :class="
                      i != imgs.length - 1
                        ? 'hover:bg-gray-200 p-0.5 hover:text-black'
                        : ''
                    "
                  ></i>
                  <i
                    @click="imgs = imgs.filter((_, index) => index != i)"
                    class="bx bx-x text-xl cursor-pointer rounded-full hover:bg-red-300 p-0.5 hover:text-black"
                  ></i>
                </div>
              </div>
            </div>
            <i v-else class="bx bx-image-alt text-3xl"></i>
          </div>
          <div class="flex-grow"></div>
          <div class="flex-shrink-0">
            <label
              for="url2"
              class="px-2 py-1 border-2 rounded-md text-sm cursor-pointer"
            >
              เพิ่มรูป
            </label>
            <input
              multiple
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
      <div class="flex xl:flex-row flex-col xl:items-center pt-4 w-full">
        <div class="w-32">ชื่อเจ้าของบทความ</div>
        <vs-input
          v-model="owner"
          type="text"
          class="input-comment flex-grow w-full xl:w-auto"
          :disabled="nameOwner"
        >
        </vs-input>
      </div>
      <vs-checkbox v-model="nameOwner" class="pb-4">
        ชื่อเดียวกับ Account นี้
      </vs-checkbox>
      <div class="py-2">
        <div class="text-base font-semibold pb-2">เนื้อหาบทความ</div>
        <ckeditor
          :editor="editor"
          v-model="text"
          :config="editorConfig"
        ></ckeditor>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import NavbarSidebar from "@/components/NavbarSidebar.vue";
import VueLoadImage from "vue-load-image";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import mixin from "@/mixin/mixin.js";

export default {
  mixins: [mixin],
  data() {
    return {
      post_id: this.$route.params.post_id,
      files: "",
      img: null,
      cover_image_url: null,
      imgs: [],
      tag_id: null,
      title: "",
      text: "",
      owner: "",
      nameOwner: false,
      editor: ClassicEditor,
      editorConfig: {
        toolbar: [
          "bold",
          "italic",
          "numberedList",
          "bulletedList",
          "|",
          "undo",
          "redo",
        ],
      },
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
      if (!this.$refs.myFiles.files[0]) return;
      this.files = this.$refs.myFiles.files[0];
      this.img = URL.createObjectURL(this.files);
    },
    previewFiles2() {
      for (let i = 0; i < this.$refs.myFiles2.files.length; i++) {
        const file = this.$refs.myFiles2.files[i];
        this.imgs.push({ url: URL.createObjectURL(file), file, isNew: true });
      }
    },
    clear() {
      this.files = "";
      this.img = null;
      this.imgs = [];
      this.tag_id = null;
      this.title = "";
      this.text = "";
      this.owner = "";
      this.cover_image_url = null;
    },
    async submitFrom() {
      const loading = this.$vs.loading();
      if (this.img) {
        const res = await this.$store.dispatch("uploadFile", this.files);
        this.cover_image_url = res.data.file_id;
      }
      let image = await this.upLoadFile();
      image = image.map((i) => {
        return i.data ? i.data.file_id : i;
      });
      if (this.$route.name === "EditArticle") {
        const res = await this.$store.dispatch("updatePostArticle", {
          post_id: this.post_id,
          text: this.text,
          tag_id: this.tag_id,
          cover_image_url: this.cover_image_url,
          img: image.length > 0 ? image : null,
          owner: this.owner,
          title: this.title,
        });
        if (res.status === 200) {
          this.$vs.notification({
            progress: "auto",
            flat: true,
            color: "primary",
            position: "top-right",
            title: "แก้ไขบทความสำเร็จ",
          });
          this.$router.push("/post/" + this.post_id);
        }
      } else {
        await this.$store.dispatch("createPostArticle", {
          text: this.text,
          tag_id: this.tag_id,
          cover_image_url: this.cover_image_url,
          img: image.length > 0 ? image : null,
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
      }
      this.clear();
      loading.close();
    },
    swapArrayElements(indexA, indexB) {
      this.imgs[indexA] = this.imgs.splice(indexB, 1, this.imgs[indexA])[0];
    },
    async upLoadFile() {
      const arr_upload = [];
      for (let index = 0; index < this.imgs.length; index++) {
        const img = this.imgs[index];
        if (img.isNew) {
          arr_upload.push(this.$store.dispatch("uploadFile", img.file));
        } else {
          arr_upload.push(img.url);
        }
      }
      return await Promise.all(arr_upload);
    },
    async getPost() {
      try {
        await this.$store.dispatch("getPost", {
          post_id: this.post_id,
          count_read: false,
        });
        this.title = this.post.title;
        this.text = this.post.text;
        this.owner = this.post.owner;
        this.tag_id = this.post.tag.tag_id;
        this.cover_image_url = this.post.cover_image_url;
        this.imgs = this.post.img.map((i) => {
          return { url: i, isNew: false };
        });
        this.nameOwner = this.post.owner === this.account.name;
      } catch (error) {
        console.log(error);
        this.$router.push("/");
        return null;
      }
    },
  },
  async mounted() {
    const loading = this.$vs.loading();
    this.$store.commit("setCurrentPage", this.$route.name);
    if (this.post_id) {
      await this.getPost();
    }
    await this.$store.dispatch("getAllTag");
    loading.close();
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      allTag: "getAllTag",
      post: "getPostView",
    }),
  },
  watch: {
    nameOwner() {
      if (this.nameOwner) {
        this.owner = this.account.name;
      }
    },
    "$route.params.post_id": async function () {
      if (this.$route.params.post_id) {
        const loading = this.$vs.loading();
        this.post_id = this.$route.params.post_id;
        await this.getPost();
        loading.close();
      }
    },
  },
};
</script>
<style lang="css">
.input-comment .vs-input {
  width: 100% !important;
  border-radius: 0.75rem !important;
  background-color: white;
  border-color: rgba(229, 231, 235, 1);
}

.ck-editor__editable_inline {
  min-height: 9rem;
}
</style>
