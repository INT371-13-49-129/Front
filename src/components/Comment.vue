<template>
  <div class="mt-1 flex">
    <vs-avatar circle class="flex-shrink-0">
      <img
        v-if="comment.account.image_url"
        :src="getFile(comment.account.image_url)"
        alt=""
      />
      <i v-else class="bx bx-user"></i>
    </vs-avatar>
    <div class="ml-2 flex-grow">
      <div class="flex">
        <div class="font-semibold">{{ getName(comment.account) }}</div>
        <div v-if="isLogin" class="h-full flex-grow flex justify-end">
          <i
            @click="(selectComment = comment), (modalActive = true)"
            class="bx bx-dots-horizontal-rounded text-lg cursor-pointer"
          ></i>
        </div>
      </div>
      <div
        v-html="comment.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
        class="bg-gray-100 w-full rounded-lg px-3 py-2 break-all"
      ></div>
      <div>
        <div class="flex items-center mt-1 text-sm">
          <span class="font-light text-sm from-gray-700">{{
            timeSince(comment.createdAt)
          }}</span>
          <i
            v-if="isLogin"
            @click="
              updateEmotion(
                comment.comment_id,
                !comment.emotions
                  .map((e) => e.account.account_id)
                  .includes(account.account_id)
              )
            "
            :class="
              comment.emotions
                .map((e) => e.account.account_id)
                .includes(account.account_id)
                ? 'bx bxs-heart text-lg ml-2.5 mr-1 text-red-500 cursor-pointer'
                : 'bx bx-heart text-lg ml-2.5 mr-1 cursor-pointer'
            "
          ></i>
          <i v-else class="bx bx-heart text-lg ml-2.5 mr-1"></i>
          {{ comment.emotions.length == 0 ? "" : comment.emotions.length }}
          <i
            class="bx bx-message-rounded text-lg ml-2.5 mr-1 cursor-pointer"
            @click="showComment = !showComment"
          ></i
          >{{ comment.comments.length == 0 ? "" : comment.comments.length }}
          ตอบกลับ
        </div>
      </div>
      <div
        v-show="showComment"
        v-for="c in comment.comments"
        :key="c.comment_id"
        class="mt-1 flex"
      >
        <vs-avatar circle class="flex-shrink-0">
          <img
            v-if="c.account.image_url"
            :src="getFile(c.account.image_url)"
            alt=""
          />
          <i v-else class="bx bx-user"></i>
        </vs-avatar>
        <div class="ml-2 flex-grow">
          <div class="flex">
            <div class="font-semibold">{{ getName(c.account) }}</div>
            <div v-if="isLogin" class="h-full flex-grow flex justify-end">
              <i
                @click="(selectComment = c), (modalActive = true)"
                class="bx bx-dots-horizontal-rounded text-lg cursor-pointer"
              ></i>
            </div>
          </div>
          <div
            v-html="c.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            class="bg-gray-100 w-full rounded-lg px-3 py-2 break-all"
          ></div>
          <div>
            <div class="flex items-center mt-1 text-sm">
              <span class="font-light text-sm from-gray-700">{{
                timeSince(c.createdAt)
              }}</span>
              <i
                v-if="isLogin"
                @click="
                  updateEmotion(
                    c.comment_id,
                    !c.emotions
                      .map((e) => e.account.account_id)
                      .includes(account.account_id)
                  )
                "
                :class="
                  c.emotions
                    .map((e) => e.account.account_id)
                    .includes(account.account_id)
                    ? 'bx bxs-heart text-lg ml-2.5 mr-1 text-red-500 cursor-pointer'
                    : 'bx bx-heart text-lg ml-2.5 mr-1 cursor-pointer'
                "
              ></i>
              <i v-else class="bx bx-heart text-lg ml-2.5 mr-1"></i>
              {{ c.emotions.length == 0 ? "" : c.emotions.length }}
              <i
                class="bx bx-message-rounded text-lg ml-2.5 mr-1 cursor-pointer"
              ></i
              >ตอบกลับ
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2 flex" v-if="isLogin">
        <vs-avatar circle class="flex-shrink-0 mr-2">
          <img
            v-if="account.image_url"
            :src="getFile(account.image_url)"
            alt=""
          />
          <i v-else class="bx bx-user"></i>
        </vs-avatar>
        <vs-input
          type="text"
          v-model.trim="newComment"
          @keyup.enter="newComment == '' ? '' : createComment()"
          class="input-comment flex-grow"
          placeholder="เขียนความเห็น..."
        />
      </div>
    </div>
    <vs-dialog v-model="modalActive">
      <template #header>
        <div class="mt-2 text-lg font-semibold">จัดการ Comment</div>
      </template>
      <vs-button
        v-if="
          isLogin &&
          selectComment.comment_id &&
          selectComment.account.account_id == account.account_id
        "
        @click="(modalEdit = true), (editComment = selectComment.text)"
        shadow
        block
        border
        size="large"
      >
        <i class="bx bx-edit-alt mr-2"></i>แก้ไข Comment
      </vs-button>
      <vs-button
        v-if="selectComment.comment_id && selectComment.log_edits.length > 0"
        @click="modalLogEdit = true"
        shadow
        block
        border
        size="large"
      >
        <i class="bx bx-time-five mr-2"></i>ประวัติการแก้ไข
      </vs-button>
      <vs-button
        v-if="
          isLogin &&
          selectComment.comment_id &&
          selectComment.account.account_id != account.account_id
        "
        danger
        border
        block
        size="large"
      >
        <i class="bx bxs-report mr-2"></i>รายงาน Comment
      </vs-button>
      <vs-button
        v-if="
          isLogin &&
          selectComment.comment_id &&
          selectComment.account.account_id == account.account_id
        "
        @click="modalDelete = true"
        danger
        border
        block
        size="large"
      >
        <i class="bx bx-trash mr-2"></i>ลบ Comment
      </vs-button>
    </vs-dialog>
    <vs-dialog v-model="modalEdit">
      <template #header>
        <div class="mt-2 text-lg font-semibold">แก้ไข Comment</div>
      </template>
      <textarea
        class="focus:outline-none w-full bg-gray-100 px-6 py-4 rounded-xl h-40 scroll"
        v-model.trim="editComment"
      ></textarea>
      <vs-button
        @click="editComment == '' ? '' : saveEditComment()"
        block
        size="large"
      >
        <i class="bx bx-edit-alt mr-2"></i>บันทึก
      </vs-button>
    </vs-dialog>
    <vs-dialog v-model="modalLogEdit">
      <template #header>
        <div class="mt-2 text-lg font-semibold">ประวัติการแก้ไข Comment</div>
      </template>
      <div>
        <div class="font-medium">{{ fullTime(selectComment.createdAt) }}</div>
        <div v-for="log in selectComment.log_edits" :key="log.log_edit_id">
          <div class="p-3 border-2 rounded-xl mb-6">
            <div
              v-html="log.log_data.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
              class="break-words"
            ></div>
          </div>
          <div class="font-medium">{{ fullTime(log.createdAt) }}</div>
        </div>
        <div class="p-3 border-2 rounded-xl mb-6">
          <div
            v-if="selectComment.comment_id"
            v-html="selectComment.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            class="break-words"
          ></div>
        </div>
      </div>
    </vs-dialog>
    <vs-dialog v-model="modalDelete">
      <template #header>
        <div class="mt-2 text-lg font-semibold">ลบ Comment</div>
      </template>
      <div class="text-base font-semibold">ต้องการลบ Comment นี้ใช่ไหม ?</div>
      <div class="p-3 border-2 rounded-xl my-4 border-red-300">
        <div
          v-if="selectComment.comment_id"
          v-html="selectComment.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
          class="break-words"
        ></div>
      </div>
      <vs-button
        v-if="
          isLogin &&
          selectComment.comment_id &&
          selectComment.account.account_id == account.account_id
        "
        @click="deleteComment()"
        danger
        border
        block
        size="large"
      >
        <i class="bx bx-trash mr-2"></i>ลบ
      </vs-button>
      <vs-button @click="modalDelete = false" shadow block border size="large">
        ยกเลิก
      </vs-button>
    </vs-dialog>
  </div>
</template>
<script>
import mixin from "@/mixin/mixin.js";
import { mapGetters } from "vuex";

export default {
  mixins: [mixin],
  props: {
    comment: {
      type: Object,
      default() {
        return {
          post_id: "",
          comment_id: "",
          account: {
            username: "",
          },
          text: "",
          emotions: [],
          comments: [],
          createdAt: "",
        };
      },
    },
    hideReferPost: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newComment: "",
      showComment: false,
      modalActive: false,
      selectComment: {
        comment_id: null,
      },
      modalEdit: false,
      editComment: "",
      modalLogEdit: false,
      modalDelete: false,
    };
  },
  methods: {
    async updateEmotion(comment_id, is_emotion) {
      await this.$store.dispatch("updateEmotion", {
        post_id: null,
        comment_id,
        is_emotion,
      });
      if (this.hideReferPost) {
        this.$emit("getAllRepost");
      } else {
        await this.$store.dispatch("getPost", {
          post_id: this.comment.post_id,
        });
      }
    },
    async createComment() {
      await this.$store.dispatch("createComment", {
        text: this.newComment,
        post_id: this.comment.post_id,
        reply_comment_id: this.comment.comment_id,
      });
      if (this.hideReferPost) {
        this.$emit("getAllRepost");
      } else {
        await this.$store.dispatch("getPost", {
          post_id: this.comment.post_id,
        });
      }
      this.showComment = true;
      this.newComment = "";
    },
    async saveEditComment() {
      await this.$store.dispatch("updateComment", {
        text: this.editComment,
        comment_id: this.selectComment.comment_id,
      });
      if (this.hideReferPost) {
        this.$emit("getAllRepost");
      } else {
        await this.$store.dispatch("getPost", {
          post_id: this.comment.post_id,
        });
      }
      this.modalActive = false;
      this.selectComment = {
        comment_id: null,
      };
      this.modalEdit = false;
      this.editComment = "";
    },
    async deleteComment() {
      try {
        await this.$store.dispatch(
          "deleteComment",
          this.selectComment.comment_id
        );
        this.$vs.notification({
          progress: "auto",
          flat: true,
          color: "primary",
          position: "top-right",
          title: "ลบ Comment สำเร็จ",
        });
        if (this.hideReferPost) {
          this.$emit("getAllRepost");
        } else {
          await this.$store.dispatch("getPost", {
            post_id: this.comment.post_id,
          });
        }
        this.modalActive = false;
        this.selectComment = {
          comment_id: null,
        };
        this.modalDelete = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
    }),
  },
};
</script>
