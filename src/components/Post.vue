<template>
  <div class="w-full px-3 py-4" :class="hideComent ? '' : 'border-b-2'">
    <div class="flex items-center">
      <vs-avatar class="flex-shrink-0" circle>
        <img
          v-if="post.account.image_url"
          :src="getFile(post.account.image_url)"
          alt=""
        />
        <i v-else class="bx bx-user"></i>
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
      <div v-if="!hideComent" class="h-full flex-grow flex justify-end">
        <i
          v-if="isLogin"
          class="bx bx-dots-horizontal-rounded text-xl cursor-pointer"
          @click="modalActive = true"
        ></i>
      </div>
    </div>
    <div
      v-html="post.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
      class="mt-2 break-words"
    ></div>
    <div v-if="post.refer_post" class="p-3 border-2 rounded-xl my-4">
      <Post :post="post.refer_post" :hideComent="true"></Post>
    </div>
    <div v-if="!hideComent">
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
          class="bx bx-message-rounded text-xl mr-1 cursor-pointer"
          @click="showComment = !showComment"
        ></i
        >{{ post.count_comments == 0 ? "" : post.count_comments }} comment
        <div class="flex-grow"></div>
        <i
          @click="$emit('referPost', post)"
          class="bx bx-paper-plane text-xl mr-1"
          :class="isLogin ? 'cursor-pointer' : ''"
        ></i
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
        <div class="mt-2 text-lg font-semibold">จัดการ Post</div>
      </template>
      <vs-button
        v-if="isLogin && post.account.account_id == account.account_id"
        @click="$emit('editPost', post)"
        shadow
        block
        border
        size="large"
      >
        <i class="bx bx-edit-alt mr-2"></i>แก้ไขโพสต์
      </vs-button>
      <vs-button
        v-if="post.log_edits.length > 0"
        @click="modalLogEdit = true"
        shadow
        block
        border
        size="large"
      >
        <i class="bx bx-time-five mr-2"></i>ประวัติการแก้ไข
      </vs-button>
      <vs-button
        v-if="isLogin && post.account.account_id != account.account_id"
        danger
        border
        block
        size="large"
      >
        <i class="bx bxs-report mr-2"></i>รายงานโพสต์
      </vs-button>
      <vs-button
        v-if="isLogin && post.account.account_id == account.account_id"
        @click="modalDelete = true"
        danger
        border
        block
        size="large"
      >
        <i class="bx bx-trash mr-2"></i>ลบโพสต์
      </vs-button>
    </vs-dialog>
    <vs-dialog v-model="modalLogEdit">
      <template #header>
        <div class="mt-2 text-lg font-semibold">ประวัติการแก้ไขโพสต์</div>
      </template>
      <div>
        <div class="font-medium">{{ fullTime(post.createdAt) }}</div>
        <div v-for="log in post.log_edits" :key="log.log_edit_id">
          <div class="p-3 border-2 rounded-xl mb-6">
            <div>
              <span class="font-medium">ความรู้สึก :</span>
              <span
                v-for="post_tag in log.log_data.post_tags.filter(
                  (t) => t.tag.tag_type === 'Feeling'
                )"
                :key="post_tag.post_tag_id"
                class="mr-0.5"
                >{{ post_tag.tag.name }}
              </span>
            </div>
            <div>
              <span class="font-medium">หมวดหมู่ :</span>
              <span
                v-for="post_tag in log.log_data.post_tags.filter(
                  (t) => t.tag.tag_type === 'Category'
                )"
                :key="post_tag.post_tag_id"
                class="mr-0.5"
                >{{ post_tag.tag.name }}
              </span>
            </div>
            <div
              v-html="log.log_data.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
              class="mt-2 break-words"
            ></div>
          </div>
          <div class="font-medium">{{ fullTime(log.createdAt) }}</div>
        </div>
        <div class="p-3 border-2 rounded-xl mb-6">
          <div>
            <span class="font-medium">ความรู้สึก :</span>
            <span
              v-for="post_tag in post.post_tags.filter(
                (t) => t.tag.tag_type === 'Feeling'
              )"
              :key="post_tag.post_tag_id"
              class="mr-0.5"
              >{{ post_tag.tag.name }}
            </span>
          </div>
          <div>
            <span class="font-medium">หมวดหมู่ :</span>
            <span
              v-for="post_tag in post.post_tags.filter(
                (t) => t.tag.tag_type === 'Category'
              )"
              :key="post_tag.post_tag_id"
              class="mr-0.5"
              >{{ post_tag.tag.name }}
            </span>
          </div>
          <div
            v-html="post.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
            class="mt-2 break-words"
          ></div>
        </div>
      </div>
    </vs-dialog>
    <vs-dialog v-model="modalDelete">
      <template #header>
        <div class="mt-2 text-lg font-semibold">ลบโพสต์</div>
      </template>
      <div class="text-base font-semibold">ต้องการลบโพสต์นี้ใช่ไหม ?</div>
      <div class="p-3 border-2 rounded-xl my-4 border-red-300">
        <Post :post="post" :hideComent="true"></Post>
      </div>
      <vs-button
        v-if="isLogin && post.account.account_id == account.account_id"
        @click="deletePost()"
        danger
        border
        block
        size="large"
      >
        <i class="bx bx-trash mr-2"></i>ลบโพสต์
      </vs-button>
      <vs-button @click="modalDelete = false" shadow block border size="large">
        ยกเลิก
      </vs-button>
    </vs-dialog>
  </div>
</template>
<script>
import Comment from "@/components/Comment.vue";
import { mapGetters } from "vuex";
import mixin from "@/mixin/mixin.js";

export default {
  name: "Post",
  mixins: [mixin],
  data() {
    return {
      newComment: "",
      showComment: false,
      modalActive: false,
      modalLogEdit: false,
      modalDelete: false,
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
    hideComent: {
      type: Boolean,
      default: false,
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
    async deletePost() {
      try {
        await this.$store.dispatch("deletePost", this.post.post_id);
        this.$vs.notification({
          progress: "auto",
          flat: true,
          color: "primary",
          position: "top-right",
          title: "ลบโพสต์สำเร็จ",
        });
        this.$emit("getAllPost");
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
