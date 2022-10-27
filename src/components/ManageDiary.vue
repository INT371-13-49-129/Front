<template>
  <div>
    <vs-dialog v-model="modalDelete">
      <template #header>
        <div class="mt-2 text-lg font-semibold">ลบ Diary</div>
      </template>
      <div class="text-base font-semibold">ต้องการลบ Diary นี้ใช่ไหม ?</div>
      <div v-if="diary" class="p-3 border-2 rounded-xl my-4 border-red-300">
        <div class="text-lg">{{ diary.title }}</div>
        <div
          v-html="diary.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
          class=""
        ></div>
      </div>
      <vs-button
        v-if="isLogin"
        @click="deleteDiary(diary.diary_id)"
        danger
        border
        block
        size="large"
      >
        <i class="bx bx-trash mr-2"></i>ลบ Diary
      </vs-button>
      <vs-button @click="modalDelete = false" shadow block border size="large">
        ยกเลิก
      </vs-button>
    </vs-dialog>
    <vs-dialog v-model="modalEdit">
      <template #header>
        <div class="mt-2 text-lg font-semibold">แก้ไข Diary</div>
      </template>
      <div class="-mt-2">
        <div class="flex xl:flex-row flex-col xl:pt-2 pt-0 items-center">
          <div class="text-lg">หัวข้อไดอารี่ :</div>
          <input
            v-model="title"
            class="focus:outline-none border-2 rounded-lg flex-grow ml-2 p-1"
          />
        </div>
        <div class="pt-2">
          <textarea
            v-model="text"
            placeholder="จดเรื่องราวที่ต้องการบันทึก"
            class="w-full focus:outline-none border-2 rounded-lg h-36 p-4"
          ></textarea>
        </div>
      </div>
      <vs-button
        :disabled="text == '' || title == ''"
        @click="text == '' || title == '' ? '' : updateDiary()"
        border
        block
        size="large"
      >
        บันทึก
      </vs-button>
      <vs-button
        @click="modalEdit = false"
        shadow
        block
        border
        danger
        size="large"
      >
        ยกเลิก
      </vs-button>
    </vs-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      modalDelete: false,
      modalEdit: false,
      title: "",
      text: "",
      diary: null,
    };
  },
  components: {},
  methods: {
    showDeleteDiary(diary) {
      this.diary = diary;
      this.modalDelete = true;
    },
    showEditDiary(diary) {
      this.diary = diary;
      this.title = diary.title;
      this.text = diary.text;
      this.modalEdit = true;
    },
    async deleteDiary(diary_id) {
      try {
        await this.$store.dispatch("deleteDiary", diary_id);
        this.$vs.notification({
          progress: "auto",
          flat: true,
          color: "primary",
          position: "top-right",
          title: "ลบ Diary สำเร็จ",
        });
        this.$emit("deleteDiaryFinish");
        this.modalDelete = false;
        this.diary = null;
      } catch (error) {
        console.log(error);
      }
    },
    async updateDiary() {
      try {
        await this.$store.dispatch("updateDiary", {
          diary_id: this.diary.diary_id,
          title: this.title,
          text: this.text,
        });
        this.$emit("updateDiaryFinish");
        this.modalEdit = false;
        this.diary = null;
        this.title = "";
        this.text = "";
      } catch (error) {
        console.log(error);
      }
    },
  },
  async mounted() {},
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
    }),
  },
};
</script>
