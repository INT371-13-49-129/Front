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
          <div class="text-lg font-semibold flex-grow">Edit Profile</div>
          <vs-button circle @click="submitFrom()">
            <div class="px-2">Save</div></vs-button
          >
        </div>
        <div
          class="h-28 flex items-center bg-blue-100"
          :style="
            editAccount.cover_image_url || upLoadFile2
              ? {
                  'background-image': upLoadFile2
                    ? `url(${img2})`
                    : `url(${getFile(editAccount.cover_image_url)})`,
                  'background-repeat': 'no-repeat',
                  'background-size': 'cover',
                  'background-position': 'center',
                }
              : ''
          "
        >
          <vs-avatar size="70" circle class="ml-6">
            <img
              v-if="editAccount.image_url || upLoadFile"
              :src="upLoadFile ? img : getFile(editAccount.image_url)"
              alt=""
            />
            <i v-else class="bx bx-user"></i>
          </vs-avatar>
        </div>
        <div class="rounded-lg p-3 border-2 mt-4 mb">
          <div class="text-lg font-semibold">ข้อมูลพื้นฐาน</div>
          <div>ผู้ใช้บริการรายอื่นๆ อาจเห็นข้อมูลบางอย่างของคุณ</div>
          <div class="flex xl:flex-row flex-col xl:items-center py-4">
            <div class="w-32 mb-1 xl:mb-0">รูปโปรไฟล์</div>
            <div class="flex flex-grow">
              <vs-avatar circle class="flex-shrink-0 mr-4">
                <img
                  v-if="editAccount.image_url || upLoadFile"
                  :src="upLoadFile ? img : getFile(editAccount.image_url)"
                  alt=""
                />
                <i v-else class="bx bx-user"></i>
              </vs-avatar>
              <div class="flex-grow"></div>
              <div class="">
                <label
                  for="url"
                  class="px-2 py-1 border-2 rounded-md text-sm cursor-pointer"
                >
                  เปลี่ยนรูป
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
          <div
            class="flex xl:flex-row flex-col xl:items-center py-4 border-t-2 border-b-2"
          >
            <div class="w-32 mb-1 xl:mb-0">รูปปก</div>
            <div class="flex flex-grow items-center">
              <div class="w-20 mr-2">
                <vue-load-image
                  v-if="editAccount.cover_image_url || upLoadFile2"
                >
                  <img
                    slot="image"
                    :src="
                      upLoadFile2 ? img2 : getFile(editAccount.cover_image_url)
                    "
                    alt=""
                  />
                  <img
                    slot="preloader"
                    src="@/assets/img/preload.svg"
                    class="animate-pulse object-contain w-full h-full"
                  />
                </vue-load-image>
                <div v-else class="bg-blue-100 w-full h-12"></div>
              </div>
              <div class="flex-grow"></div>
              <div class="">
                <label
                  for="url2"
                  class="px-2 py-1 border-2 rounded-md text-sm cursor-pointer"
                >
                  เปลี่ยนรูป
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
            <div class="w-32">Username</div>
            <vs-input
              v-model="editAccount.username"
              type="text"
              class="input-comment flex-grow w-full xl:w-auto"
            >
              <template #message-danger v-if="!validate.username">
                {{ validatetext.username }}
              </template></vs-input
            >
          </div>
          <div class="flex xl:flex-row flex-col xl:items-center">
            <div class="w-32 mr-4">เพศ</div>
            <select
              v-model="editAccount.gender"
              class="bg-white border-2 px-2 text-gray-600 border-gray-200 rounded-xl focus:outline-none w-full py-1.5"
            >
              <option label="Male" value="Male">Male</option>
              <option label="Female" value="Female">Female</option>
              <option label="Unspecified" value="Unspecified">
                Unspecified
              </option>
            </select>
          </div>
          <div class="flex xl:flex-row flex-col xl:items-center mt-4 mb-6">
            <div class="w-32">วัน/เดือน/ปี เกิด</div>
            <vs-input
              type="date"
              v-model="editAccount.date_of_birth"
              :max="currentDate()"
              class="input-comment flex-grow w-full xl:w-auto"
            ></vs-input>
          </div>
          <div
            class="flex xl:flex-row flex-col xl:items-center py-4 border-t-2"
          >
            <div class="xl:w-32 mr-4">คำอธิบายเกี่ยวกับคุณ</div>
            <textarea
              v-model="editAccount.bio"
              class="fbg-white border-2 px-2 h-28 text-gray-600 border-gray-200 rounded-xl focus:outline-none w-full py-1.5"
            ></textarea>
          </div>
        </div>
        <div class="rounded-lg p-3 border-2 mt-4">
          <div class="text-lg font-semibold">ข้อมูลติดต่อ</div>
          <div class="flex items-center mt-3">
            <div class="xl:w-32 pr-2 xl:pr-0">อีเมล</div>
            <div class="flex-grow">{{ account.email }}</div>
            <i class="bx bx-chevron-right text-base"></i>
          </div>
        </div>
        <div class="rounded-lg p-3 border-2 mt-4">
          <div class="text-lg font-semibold">หัวข้อที่คุยได้</div>
          <div class="flex text-sm mt-3 mb-1 items-center flex-wrap">
            <div class="text-sm mr-2">หัวข้อ : <span v-if="false">-</span></div>
            <div
              v-for="(account_topic, i) in editAccount.account_topics"
              :key="i"
              class="py-0.5 px-2 rounded-md border-2 border-blue-100 filter mr-2 my-0.5 shadow-xs flex items-center text-primary bg-blue-100"
            >
              {{ account_topic.name }}
              <i
                @click="selectTopic(account_topic)"
                class="bx bx-x cursor-pointer"
              ></i>
            </div>
            <div
              @click="modalTopicShow = true"
              class="py-0.5 px-2 rounded-md border-2 filter mr-2 my-0.5 shadow-xs bg-gray-200 cursor-pointer"
            >
              เพิ่มหัวข้อ +
            </div>
          </div>
          <div class="flex text-sm mt-3 items-center justify-between">
            <div>พร้อมที่จะเป็นผู้รับฟัง</div>
            <vs-switch v-model="editAccount.is_listener" />
          </div>
        </div>
        <div class="h-4"></div>
      </div>
    </div>
    <vs-dialog v-model="modalTopicShow">
      <template #header>
        <h4 class="mt-2 text-lg font-semibold">หัวข้อที่คุยได้</h4>
      </template>
      <div
        v-for="topic in allTopic"
        :key="topic.topic_id"
        class="my-1 py-2 px-2 hover:bg-primary hover:bg-opacity-5 cursor-pointer"
        :class="
          editAccount.account_topics.find((t) => t.topic_id == topic.topic_id)
            ? 'bg-primary bg-opacity-5 text-primary'
            : ''
        "
        @click="selectTopic(topic)"
      >
        {{ topic.name }}
      </div>
      <vs-button class="w-full button-login" @click="modalTopicShow = false"
        >ตกลง</vs-button
      >
    </vs-dialog>
  </div>
</template>
<script>
import mixin from "@/mixin/mixin.js";
import VueLoadImage from "vue-load-image";
import { mapGetters } from "vuex";
import { statusCode } from "../util/statusCode.js";
import NavbarSidebar from "@/components/NavbarSidebar.vue";

export default {
  mixins: [mixin],
  data() {
    return {
      editAccount: {
        username: "",
        gender: "",
        bio: "",
        date_of_birth: "",
        image_url: "",
        cover_image_url: "",
        is_listener: "",
        account_topics: [],
      },
      validatetext: {
        username: "",
      },
      validate: {
        username: false,
      },
      modalTopicShow: false,
      files: "",
      files2: "",
      img: "",
      img2: "",
      upLoadFile: false,
      upLoadFile2: false,
    };
  },
  components: {
    NavbarSidebar,
    VueLoadImage,
  },
  methods: {
    currentDate() {
      return new Date().toISOString().split("T")[0];
    },
    selectTopic(topic) {
      if (
        this.editAccount.account_topics.find(
          (t) => t.topic_id == topic.topic_id
        )
      ) {
        this.editAccount.account_topics =
          this.editAccount.account_topics.filter(
            (t) => t.topic_id != topic.topic_id
          );
      } else {
        this.editAccount.account_topics.push(topic);
      }
    },
    validateUsername() {
      if (this.editAccount.username === "") {
        this.validatetext.username = "Please enter Username";
        this.validate.username = false;
      } else if (!/^[a-zA-Z0-9]+$/.test(this.editAccount.username)) {
        this.validatetext.username = "Only A-Z,a-z and numbers can be entered.";
        this.validate.username = false;
      } else if (this.editAccount.username.length > 50) {
        this.validatetext.username =
          "Username must not be longer than 50 characters.";
        this.validate.username = false;
      } else {
        this.validate.username = true;
      }
    },
    async submitFrom() {
      const loading = this.$vs.loading();
      this.validateUsername();
      if (this.validate.username) {
        try {
          if (this.upLoadFile) {
            const res = await this.$store.dispatch("uploadFile", this.files);
            this.editAccount.image_url = res.data.file_id;
          }
          if (this.upLoadFile2) {
            const res = await this.$store.dispatch("uploadFile", this.files2);
            this.editAccount.cover_image_url = res.data.file_id;
          }
          await this.$store.dispatch("updateAccountProfile", this.editAccount);
          await this.$store.dispatch("getAccount");
          this.$vs.notification({
            progress: "auto",
            flat: true,
            color: "primary",
            position: "top-right",
            title: "แก้ไข Profile สำเสร็จ",
          });
        } catch (err) {
          console.log(err);
          const error = err.response?.data?.statusCode;
          let title;

          if (error == statusCode(2001)) {
            title = "Username Already exists";
          } else {
            title = "Edit failed, please try again.";
          }

          this.$vs.notification({
            progress: "auto",
            flat: true,
            color: "danger",
            position: "top-right",
            title,
          });
        }
      }
      loading.close();
    },
    previewFiles() {
      if (!this.$refs.myFiles.files[0]) return;
      this.files = this.$refs.myFiles.files[0];
      this.img = URL.createObjectURL(this.files);
      this.upLoadFile = true;
    },
    previewFiles2() {
      if (!this.$refs.myFiles2.files[0]) return;
      this.files2 = this.$refs.myFiles2.files[0];
      this.img2 = URL.createObjectURL(this.files2);
      this.upLoadFile2 = true;
    },
  },
  async mounted() {
    await this.$store.dispatch("getAllTopic");
    if (this.account) {
      this.editAccount = {
        ...this.account,
        account_topics: this.account.account_topics.map((at) => {
          return { ...at.topic, account_topic_id: at.account_topic_id };
        }),
      };
    }
  },
  computed: {
    ...mapGetters({
      account: "getAccount",
      allTopic: "getAllTopic",
    }),
  },
  watch: {
    "editAccount.username": function () {
      this.validateUsername();
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
</style>
