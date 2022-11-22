<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div class="pt-16 xl:pb-0 pb-12 w-full h-auto flex justify-center">
      <div class="xl:w-4/6 w-full h-full px-3">
        <div class="flex items-center py-2">
          <i
            class="bx bx-chevron-left text-xl mr-2 cursor-pointer"
            @click="$router.push('/profile')"
          ></i>
          <div class="text-lg font-semibold flex-grow">
            ส่งคำขอเป็นผู้เชี่ยวชาญ
          </div>
          <vs-button
            circle
            :disabled="files.length == 0 || name == '' || description == ''"
            @click="submitFrom()"
          >
            <div class="px-2">ยืนยันส่งคำขอ</div></vs-button
          >
        </div>
        <div class="rounded-lg p-3 border-2 mt-4 mb">
          <div class="text-lg font-semibold">
            ข้อมูลยืนยันการเป็นผู้เชี่ยวชาญ
          </div>
          <div>
            เป็นการส่งคำขอให้แอดมินตรวจสอบเมื่อได้รับการยืยยัน
            บทบาทของคุณจะมีการเปลี่ยนแปลง
          </div>
          <div class="flex xl:flex-row flex-col xl:items-start pt-4 pb-1">
            <div class="w-32 mb-1 xl:mb-0 xl:mt-2">หลักฐาน</div>
            <div class="flex-grow my-2">
              <div>
                <div :class="{ 'mb-2': files.length > 0 }">
                  <div
                    v-for="(file, i) in files"
                    :key="i"
                    class="mb-1 flex items-center"
                  >
                    <i
                      @click="files = files.filter((_, index) => index != i)"
                      class="bx bx-x text-base cursor-pointer rounded-full hover:text-red-600"
                    ></i>
                    <a
                      :href="file.isNew ? file.url : getFile(file.url)"
                      target="_blank"
                      class="hover:underline text-gray-700 cursor-pointer ml-2"
                    >
                      {{ file.name }}
                    </a>
                  </div>
                </div>
                <label
                  for="url"
                  class="px-2 py-1 border-2 rounded-md text-sm cursor-pointer"
                >
                  อัพโหลดไฟล์เอกสาร
                </label>
                <input
                  multiple
                  class="hidden"
                  type="file"
                  id="url"
                  ref="myFiles"
                  accept=".jpg, .jpeg, .png, .doc, .docx, .pdf, .txt"
                  @change="previewFiles"
                />
              </div>
            </div>
          </div>
          <div class="text-sm text-gray-400 mb-3 mt-1">
            เอกสารยืนยันตัวตนที่สามารถพิสูจน์ได้ว่ามีความรู้ความเชี่ยวชาญจริง
          </div>
          <div class="flex xl:flex-row flex-col xl:items-center py-4 w-full">
            <div class="w-32">ชื่อ</div>
            <vs-input
              v-model="name"
              type="text"
              class="input-comment flex-grow w-full xl:w-auto"
            ></vs-input>
          </div>
          <div class="flex xl:flex-row flex-col xl:items-center">
            <div class="xl:w-32 mr-4">คำอธิบาย</div>
            <textarea
              v-model="description"
              class="fbg-white border-2 px-2 h-28 text-gray-600 border-gray-200 rounded-xl focus:outline-none w-full py-1.5"
            ></textarea>
          </div>
          <div class="text-sm text-gray-400 mb-3 mt-1">
            คำอธิบายเกี่ยวกับความเชี่ยวชาญ ซึ่งจะแสดงในหน้าโปรไฟล์ของคุณ
          </div>
        </div>
        <div class="h-4"></div>
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
      name: "",
      description: "",
      files: [],
    };
  },
  components: {
    NavbarSidebar,
  },
  methods: {
    async submitFrom() {
      const loading = this.$vs.loading();
      let files = await this.upLoadFile();
      files = files.map((f) => {
        return f.data ? { url: f.data.file_id, name: f.data.name } : f;
      });
      const res = await this.$store.dispatch("requestPsychologist", {
        name: this.name,
        description: this.description,
        file_approve: files,
      });
      if (res.status === 200) {
        await this.$store.dispatch("getAccount");
        this.name = this.account.name;
        this.description = this.account.description;
        this.files = this.account.file_approve ? this.account.file_approve : [];
        this.$vs.notification({
          progress: "auto",
          flat: true,
          color: "primary",
          position: "top-right",
          title: "ส่งคำขอสำเร็จ",
        });
      }
      loading.close();
    },
    async upLoadFile() {
      const arr_upload = [];
      for (let index = 0; index < this.files.length; index++) {
        const file = this.files[index];
        if (file.isNew) {
          arr_upload.push(this.$store.dispatch("uploadFile", file.file));
        } else {
          arr_upload.push({ url: file.url, name: file.name });
        }
      }
      return await Promise.all(arr_upload);
    },
    previewFiles() {
      for (let i = 0; i < this.$refs.myFiles.files.length; i++) {
        const file = this.$refs.myFiles.files[i];
        this.files.push({
          url: URL.createObjectURL(file),
          file,
          name: file.name,
          isNew: true,
        });
      }
    },
  },
  async mounted() {
    this.name = this.account.name;
    this.description = this.account.description;
    this.files = this.account.file_approve ? this.account.file_approve : [];
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
</style>
