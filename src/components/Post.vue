<template>
  <div class="w-full px-3 py-4 border-b-2">
    <div class="flex items-center">
      <vs-avatar circle>
        <i class="bx bx-user"></i>
      </vs-avatar>
      <div class="ml-3">
        <div class="font-semibold text-lg">
          {{ post.account.username }}
          <span class="font-normal text-sm"
            ><span v-if="post.tags_feeling.length !== 0" class="mr-0.5"
              >รู้สึก</span
            >
            <span
              v-for="(post_tag, i) in post.tags_feeling"
              :key="post_tag.post_tag_id"
              >{{ post_tag.tag.name
              }}<span v-if="i < post.tags_feeling.length - 1" class="mr-0.5"
                >,
              </span></span
            >
          </span>
        </div>
        <div class="font-semibold text-xs">
          <span
            v-for="post_tag in post.tags_category"
            :key="post_tag.post_tag_id"
            class="mr-0.5"
            >#{{ post_tag.tag.name }}
          </span>
        </div>
        <div class="font-light text-sm from-gray-700">
          {{ timeSince(post.createdAt) }}
        </div>
      </div>
    </div>
    <div class="mt-2 break-words">
      {{ post.text }}
    </div>
    <div
      class="border-gray-100 border-t-2 border-b-2 flex items-center py-2 mt-3 px-1"
    >
      <i
        v-if="isLogin"
        @click="updateEmotion(!is_emotion)"
        :class="
          is_emotion
            ? 'bx bxs-heart text-xl mr-1 text-red-500 cursor-pointer'
            : 'bx bx-heart text-xl mr-1 cursor-pointer'
        "
      ></i>
      <i v-else class="bx bx-heart text-xl mr-1"></i>
      {{ post.count_emotions == 0 ? "" : post.count_emotions }} กำลังใจ
      <div class="flex-grow"></div>
      <i
        class="bx bx-message-rounded text-xl mr-1"
        @click="showComment = !showComment"
      ></i
      >{{ post.count_comments == 0 ? "" : post.count_comments }} comment
      <div class="flex-grow"></div>
      <i class="bx bx-paper-plane text-xl mr-1"></i
      >{{ post.count_posts == 0 ? "" : post.count_posts }} repost
    </div>
    <div
      v-show="showComment"
      v-for="comment in post.comments"
      :key="comment.comment_id"
    >
      <Comment :comment="comment"></Comment>
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
</template>
<script>
import Comment from "@/components/Comment.vue";
import { mapGetters } from "vuex";
import mixin from "@/mixin/mixin.js";

export default {
  mixins: [mixin],
  data() {
    return {
      newComment: "",
      showComment: false,
    };
  },
  components: {
    Comment,
  },
  props: {
    post: {
      type: Object,
      default() {
        return {
          post_id: "",
          account: {
            username: "",
          },
          text: "",
          tags_feeling: [],
          tags_category: [],
          count_emotions: 0,
          count_comments: 0,
          count_posts: 0,
          createdAt: "",
        };
      },
    },
  },
  methods: {
    async updateEmotion(is_emotion) {
      await this.$store.dispatch("updateEmotion", {
        post_id: this.post.post_id,
        comment_id: null,
        is_emotion,
      });
      await this.$store.dispatch("getPost", {
        post_id: this.post.post_id,
      });
    },
    async createComment() {
      await this.$store.dispatch("createComment", {
        text: this.newComment,
        post_id: this.post.post_id,
        reply_comment_id: null,
      });
      await this.$store.dispatch("getPost", {
        post_id: this.post.post_id,
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
    is_emotion() {
      return this.post.emotions
        .map((e) => e.account.account_id)
        .includes(this.account.account_id);
    },
  },
};
</script>
<style lang="css">
.input-comment .vs-input {
  width: 100% !important;
  border-radius: 9999px !important;
}
</style>
