<template>
  <div class="mt-1 flex">
    <vs-avatar circle class="flex-shrink-0">
      <i class="bx bx-user"></i>
    </vs-avatar>
    <div class="ml-2 flex-grow">
      <div class="font-semibold">{{ comment.account.username }}</div>
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
          <i class="bx bx-user"></i>
        </vs-avatar>
        <div class="ml-2 flex-grow">
          <div class="font-semibold">{{ c.account.username }}</div>
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
          <i class="bx bx-user"></i>
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
  },
  data() {
    return {
      newComment: "",
      showComment: false,
    };
  },
  methods: {
    async updateEmotion(comment_id, is_emotion) {
      await this.$store.dispatch("updateEmotion", {
        post_id: null,
        comment_id,
        is_emotion,
      });
      await this.$store.dispatch("getPost", {
        post_id: this.comment.post_id,
      });
    },
    async createComment() {
      await this.$store.dispatch("createComment", {
        text: this.newComment,
        post_id: this.comment.post_id,
        reply_comment_id: this.comment.comment_id,
      });
      await this.$store.dispatch("getPost", {
        post_id: this.comment.post_id,
      });
      this.showComment = true;
      this.newComment = "";
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
