<template>
  <div>
    <vs-dialog v-if="isLogin" v-model="modalShow">
      <template #header>
        <h4 class="mt-2 text-xl font-semibold">
          {{ headerModal }}
        </h4>
      </template>
      <div class="">
        <div class="flex items-center mb-2">
          <vs-avatar size="40" circle>
            <img
              v-if="account.image_url"
              :src="getFile(account.image_url)"
              alt=""
            />
            <i v-else class="bx bx-user"></i>
          </vs-avatar>
          <div class="ml-3">
            <div class="font-semibold text-base">
              {{ getName(account) }}
              <span class="font-normal text-sm"
                ><span v-if="tags_feeling.length !== 0" class="mr-0.5"
                  >รู้สึก</span
                >
                <span
                  v-for="(post_tag, i) in tags_feeling"
                  :key="post_tag.post_tag_id"
                  >{{ post_tag.name
                  }}<span v-if="i < tags_feeling.length - 1" class="mr-0.5"
                    >,
                  </span></span
                >
              </span>
            </div>
            <div class="font-semibold text-xs">
              <span
                v-for="post_tag in tags_category"
                :key="post_tag.post_tag_id"
                class="mr-0.5"
                >#{{ post_tag.name }}
              </span>
            </div>
          </div>
        </div>
        <select
          class="focus:outline-none mb-2 border-2 rounded-md text-sm"
          v-model="publish_status"
        >
          <option value="Publish">สาธารณะ</option>
          <option value="Personal">ส่วนตัว</option>
        </select>
        <textarea
          class="focus:outline-none w-full bg-gray-100 px-6 py-4 rounded-xl mb-2 scroll border-2"
          :class="refer_post.post_id ? 'h-20' : 'h-40'"
          v-model.trim="text"
        ></textarea>
        <div
          v-if="imgs && imgs.length > 0"
          class="flex flex-wrap w-full mt-2"
          :class="imgs.length == 2 ? 'xl:h-72 h-60' : 'flex-col xl:h-80 h-72'"
        >
          <div
            v-for="(img, i) in imgs"
            :key="i"
            class="p-0.5 relative"
            :class="
              imgs.length == 1
                ? 'h-full w-full'
                : imgs.length == 2
                ? 'h-full w-1/2'
                : imgs.length == 3 && i == 0
                ? 'h-full w-1/2'
                : 'h-1/2 w-1/2'
            "
          >
            <div class="absolute top-1 right-1 z-10">
              <div
                class="rounded-full w-8 h-8 flex justify-center items-center bg-gray-500 bg-opacity-40 cursor-pointer hover:bg-red-400 hover:bg-opacity-80 hover:text-red-800"
                @click="(modalDeleteImg = !modalDeleteImg), (del_i = i)"
              >
                <i class="bx bx-x text-2xl"></i>
              </div>
            </div>
            <div v-if="img.isNew" class="h-full w-full">
              <img
                slot="image"
                :src="img.url"
                class="h-full w-full object-cover"
                alt=""
              />
            </div>
            <vue-load-image v-else class="h-full w-full">
              <img
                slot="image"
                :src="getFile(img.url)"
                class="h-full w-full object-cover"
                alt=""
              />
              <img
                slot="preloader"
                src="@/assets/img/preload.svg"
                class="animate-pulse object-cover w-full h-full"
              />
            </vue-load-image>
          </div>
        </div>
        <div v-if="refer_post.post_id" class="p-3 border-2 rounded-xl mb-6">
          <Post :post="refer_post" :hideComent="true"></Post>
        </div>
        <input
          class="hidden"
          type="file"
          id="url"
          ref="myFiles"
          accept=".jpg, .jpeg, .png"
          @change="previewFiles"
        />
        <vs-button
          v-if="!refer_post.post_id && !isEditRefer"
          class="w-full button-login"
          border
          :disabled="imgs.length == 4"
          @click="selectFile()"
          >{{ imgs.length > 0 ? "เพิ่มรูปภาพ" : "รูปภาพ" }}</vs-button
        >
        <vs-button
          class="w-full button-login"
          border
          @click="(modalTagShow = !modalTagShow), (tagSelect = 'Feeling')"
          >ความรู้สึก</vs-button
        >
        <vs-button
          class="w-full button-login"
          border
          @click="(modalTagShow = !modalTagShow), (tagSelect = 'Category')"
          >หมวดหมู่</vs-button
        >
        <div class="h-2"></div>
        <vs-button
          class="w-full button-login"
          :disabled="text == '' && !refer_post.post_id"
          @click="
            text == '' && !refer_post.post_id
              ? ''
              : isEdit
              ? sendEditPost()
              : createPost()
          "
          >โพสต์</vs-button
        >
      </div>
    </vs-dialog>
    <vs-dialog v-model="modalDeleteImg">
      <template #header>
        <div class="mt-2 text-lg font-semibold">ลบรูป</div>
      </template>
      <div class="text-base font-semibold -mt-2">ต้องการรูปนี้ใช่ไหม ?</div>
      <div v-if="del_i != null" class="my-2">
        <div v-if="imgs[del_i].isNew" class="xl:max-h-96 w-auto">
          <img
            slot="image"
            :src="imgs[del_i].url"
            class="xl:max-h-96 h-full w-full object-contain"
            alt=""
          />
        </div>
        <vue-load-image v-else class="xl:max-h-96 w-auto">
          <img
            slot="image"
            :src="getFile(imgs[del_i].url)"
            class="xl:max-h-96 h-full w-full object-contain"
            alt=""
          />
          <img
            slot="preloader"
            src="@/assets/img/preload.svg"
            class="animate-pulse object-cover w-full h-full"
          />
        </vue-load-image>
      </div>
      <vs-button @click="imgsSplice(del_i)" danger border block size="large">
        <i class="bx bx-trash mr-2"></i>ลบ
      </vs-button>
      <vs-button
        @click="modalDeleteImg = false"
        shadow
        block
        border
        size="large"
      >
        ยกเลิก
      </vs-button>
    </vs-dialog>
    <vs-dialog v-model="modalTagShow">
      <template #header>
        <h4 class="mt-2 text-lg font-semibold">คุณรู้สึกอย่างไร</h4>
      </template>
      <div class="flex gap-4">
        <div
          class="py-1 border-b-2 border-primary cursor-pointer"
          :class="tagSelect == 'Feeling' ? 'text-primary' : 'border-opacity-0'"
          @click="tagSelect = 'Feeling'"
        >
          ความรู้สึก
        </div>
        <div
          class="py-1 border-b-2 border-primary cursor-pointer"
          :class="tagSelect == 'Category' ? 'text-primary' : 'border-opacity-0'"
          @click="tagSelect = 'Category'"
        >
          หมวดหมู่
        </div>
      </div>
      <div class="max-h-96 overflow-auto">
        <div
          v-for="tag in allTag.filter((t) => t.tag_type === tagSelect)"
          :key="tag.tag_id"
          class="my-1 py-2 px-2 hover:bg-primary hover:bg-opacity-5 cursor-pointer"
          :class="
            tags_feeling.find((t) => t.tag_id == tag.tag_id) ||
            tags_category.find((t) => t.tag_id == tag.tag_id)
              ? 'bg-primary bg-opacity-5 text-primary'
              : ''
          "
          @click="selectTag(tag)"
        >
          {{ tag.name }}
        </div>
      </div>
      <vs-button class="w-full button-login" @click="modalTagShow = false"
        >ตกลง</vs-button
      >
    </vs-dialog>
  </div>
</template>
<script>
import mixin from "@/mixin/mixin.js";
import VueLoadImage from "vue-load-image";
import { mapGetters } from "vuex";
import Post from "@/components/Post.vue";

export default {
  mixins: [mixin],
  data() {
    return {
      tags_category: [],
      tags_feeling: [],
      modalShow: false,
      modalTagShow: false,
      tagSelect: "Feeling",
      isEdit: false,
      isEditRefer: false,
      refer_post: {
        post_id: null,
      },
      text: "",
      imgs: [],
      publish_status: "Publish",
      del_i: null,
      modalDeleteImg: false,
    };
  },
  components: {
    Post,
    VueLoadImage,
  },
  methods: {
    async createPost() {
      const loading = this.$vs.loading();
      let img = await this.upLoadFile();
      img = img.map((i) => {
        return i.data.file_id;
      });
      await this.$store.dispatch("createPost", {
        text: this.text,
        post_tags: this.tags_feeling.concat(this.tags_category),
        refer_post_id: this.refer_post.post_id,
        img: img.length > 0 ? img : null,
        publish_status: this.publish_status,
      });
      this.modalShow = false;
      this.isEdit = false;
      this.isEditRefer = false;
      this.refer_post = {
        post_id: null,
      };
      this.edit_post = null;
      this.text = "";
      this.tags_category = [];
      this.tags_feeling = [];
      this.$emit("getAllPost");
      loading.close();
    },
    referPost(post) {
      this.modalShow = true;
      this.isEdit = false;
      this.isEditRefer = false;
      this.refer_post = post;
      this.edit_post = null;
      this.text = "";
      this.tags_category = [];
      this.tags_feeling = [];
      this.imgs = [];
    },
    modalNewPost() {
      this.modalShow = true;
      this.isEdit = false;
      this.isEditRefer = false;
      this.refer_post = {
        post_id: null,
      };
      this.edit_post = null;
      this.text = "";
      this.tags_category = [];
      this.tags_feeling = [];
      this.imgs = [];
    },
    editPost(post) {
      this.modalShow = true;
      this.isEdit = true;
      this.isEditRefer = !!post.refer_post;
      this.refer_post = {
        post_id: null,
      };
      this.edit_post = post;
      this.text = post.text;
      this.tags_category = post.tags_category.map((pt) => {
        return { ...pt.tag, post_tag_id: pt.post_tag_id };
      });
      this.tags_feeling = post.tags_feeling.map((pt) => {
        return { ...pt.tag, post_tag_id: pt.post_tag_id };
      });
      if (post.img && post.img.length > 0) {
        this.imgs = post.img.map((url) => {
          return { url, isNew: false };
        });
      } else {
        this.imgs = [];
      }
    },
    selectTag(tag) {
      if (this.tagSelect == "Feeling") {
        if (this.tags_feeling.find((t) => t.tag_id == tag.tag_id)) {
          this.tags_feeling = this.tags_feeling.filter(
            (t) => t.tag_id != tag.tag_id
          );
        } else {
          this.tags_feeling.push(tag);
        }
      } else {
        if (this.tags_category.find((t) => t.tag_id == tag.tag_id)) {
          this.tags_category = this.tags_category.filter(
            (t) => t.tag_id != tag.tag_id
          );
        } else {
          this.tags_category.push(tag);
        }
      }
    },
    async sendEditPost() {
      const loading = this.$vs.loading();
      let img = await this.upLoadFile();
      img = img.map((i) => {
        return i.data ? i.data.file_id : i;
      });
      await this.$store.dispatch("updatePost", {
        text: this.text,
        post_tags: this.tags_feeling.concat(this.tags_category),
        post_id: this.edit_post.post_id,
        img: img.length > 0 ? img : null,
        publish_status: this.publish_status,
      });
      this.modalShow = false;
      this.isEdit = false;
      this.isEditRefer = false;
      this.refer_post = {
        post_id: null,
      };
      this.edit_post = null;
      this.text = "";
      this.tags_category = [];
      this.tags_feeling = [];
      this.$emit("getAllPost");
      loading.close();
    },
    selectFile() {
      let fileInputElement = this.$refs.myFiles;
      fileInputElement.click();
    },
    previewFiles() {
      if (!this.$refs.myFiles.files[0]) return;
      const file = this.$refs.myFiles.files[0];
      this.imgs.push({ url: URL.createObjectURL(file), isNew: true, file });
    },
    imgsSplice(i) {
      this.imgs = this.imgs.filter((_, index) => index != i);
      this.modalDeleteImg = false;
      this.del_i = null;
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
  },
  async mounted() {},
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      allPost: "getAllPost",
      allTag: "getAllTag",
    }),
    headerModal() {
      if (this.isEdit) {
        return "แก้ไขโพสต์";
      }
      if (this.refer_post.post_id) {
        return "รีโพสต์";
      }
      return "สร้างโพสต์";
    },
  },
};
</script>
<style lang="css">
.input-post .vs-select__input {
  width: 100% !important;
  border: 1px solid #eeeeee !important;
  border-radius: 8px !important;
  background: white;
}
.input-post.vs-select-content {
  max-width: 100%;
}
</style>
