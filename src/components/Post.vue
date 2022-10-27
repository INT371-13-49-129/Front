<template>
  <div
    class="w-full px-3 py-4"
    :class="hideComent || hideReferPost ? '' : 'border-b-2'"
  >
    <div class="flex items-center">
      <vs-avatar class="flex-shrink-0" circle>
        <img
          v-if="post.account.image_url"
          :src="getFile(post.account.image_url)"
          alt=""
        />
        <i v-else class="bx bx-user"></i>
      </vs-avatar>
      <div
        class="ml-3 flex-grow cursor-pointer"
        @click="$router.push('/post/' + post.post_id)"
      >
        <div class="font-semibold text-lg">
          <span
            class="hover:underline"
            @click.stop="$router.push('/profile/' + post.account.account_id)"
            >{{ getName(post.account) }}</span
          >
          <span class="font-normal text-sm ml-1"
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
          {{ timeSince(post.createdAt) }} ·
          {{ post.publish_status == "Publish" ? "สาธารณะ" : "ส่วนตัว" }}
        </div>
      </div>
      <div v-if="!hideComent && !hideReferPost" class="h-full flex justify-end">
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
    <div
      class="p-3 border-2 rounded-xl my-4"
      v-if="!post.refer_post && !hideReferPost && post.refer_post_id"
    >
      ไม่สามารถแสดงโพสต์ได้ โพสต์นี้อาจถูกลบไปแล้วหรือถูกจำกัดการเข้าถึง
    </div>
    <div
      v-if="post.refer_post && !hideReferPost"
      class="p-3 border-2 rounded-xl my-4"
    >
      <Post :post="post.refer_post" :hideComent="true"></Post>
    </div>
    <div
      v-if="post.img && post.img.length > 0"
      class="flex flex-wrap w-full mt-2"
      :class="post.img.length == 2 ? 'xl:h-80 h-60' : 'flex-col xl:h-128 h-80'"
    >
      <div
        v-for="(img, i) in post.img"
        :key="i"
        class="p-0.5"
        :class="
          post.img.length == 1
            ? 'h-full w-full'
            : post.img.length == 2
            ? 'h-full w-1/2'
            : post.img.length == 3 && i == 0
            ? 'h-full w-1/2'
            : 'h-1/2 w-1/2'
        "
      >
        <vue-load-image class="h-full w-full">
          <img
            slot="image"
            :src="getFile(img)"
            class="h-full w-full object-cover cursor-pointer"
            alt=""
            @click="imgShow(post.img, i)"
          />
          <img
            slot="preloader"
            src="@/assets/img/preload.svg"
            class="animate-pulse object-cover w-full h-full"
          />
        </vue-load-image>
      </div>
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
        {{ post.count_emotions == 0 ? "" : post.count_emotions }}
        <span
          :class="post.count_emotions == 0 ? '' : 'cursor-pointer ml-1'"
          @click="post.count_emotions == 0 ? '' : (modalEmotions = true)"
          >กำลังใจ</span
        >
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
          :class="isLogin && !hideReferPost ? 'cursor-pointer' : ''"
        ></i
        >{{ post.count_posts == 0 ? "" : post.count_posts }}
        <span
          :class="post.count_posts == 0 ? '' : 'cursor-pointer ml-1'"
          @click="post.count_posts == 0 ? '' : getAllRepost()"
        >
          repost</span
        >
      </div>
      <div
        v-show="showComment"
        v-for="comment in post.comments"
        :key="comment.comment_id"
      >
        <Comment
          :comment="comment"
          :hideReferPost="hideReferPost"
          @getAllRepost="$emit('getAllRepost')"
        ></Comment>
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
    <vs-dialog v-model="modalRepost">
      <template #header>
        <div class="mt-2 text-lg font-semibold">รีโพสต์</div>
      </template>
      <div class="-mt-2">
        <div
          class="border-2 rounded-xl mb-3"
          v-for="repost in allRepost"
          :key="repost.post_id"
        >
          <Post
            :post="repost"
            :hideReferPost="true"
            @getAllRepost="getAllRepost"
          ></Post>
        </div>
      </div>
    </vs-dialog>
    <vs-dialog v-model="modalEmotions">
      <template #header>
        <div class="mt-2 text-lg font-semibold">ส่งกำลังใจ</div>
      </template>
      <div class="border-t-2 -mt-2">
        <div
          v-for="emo in post.emotions"
          :key="emo.emotion_id"
          class="mt-3 flex items-center"
        >
          <vs-avatar circle class="flex-shrink-0 mr-3">
            <img
              v-if="emo.account.image_url"
              :src="getFile(emo.account.image_url)"
              alt=""
            />
            <i v-else class="bx bx-user"></i>
          </vs-avatar>
          <div class="font-semibold flex-grow">{{ getName(emo.account) }}</div>
          <i class="bx bxs-heart text-xl mr-1 text-red-500"></i>
        </div>
      </div>
    </vs-dialog>
    <vs-dialog v-model="modalImg">
      <div
        v-for="(img, i) in img_show"
        :key="i"
        v-show="i == img_show_index"
        class="flex items-center"
      >
        <i
          v-if="img_show.length > 1"
          class="bx bx-chevron-left text-3xl -ml-3 cursor-pointer"
          @click="
            img_show_index == 0
              ? (img_show_index = img_show.length - 1)
              : (img_show_index -= 1)
          "
        ></i>
        <vue-load-image class="xl:max-h-144 w-screen xl:w-auto px-1 pt-3">
          <img
            slot="image"
            :src="getFile(img)"
            class="xl:max-h-144 h-full w-full object-contain"
            alt=""
          />
          <img
            slot="preloader"
            src="@/assets/img/preload.svg"
            class="animate-pulse object-contain w-full xl:h-128"
          />
        </vue-load-image>
        <i
          v-if="img_show.length > 1"
          class="bx bx-chevron-right text-3xl -mr-3 cursor-pointer"
          @click="
            img_show_index == img_show.length - 1
              ? (img_show_index = 0)
              : (img_show_index += 1)
          "
        ></i>
      </div>
    </vs-dialog>
  </div>
</template>
<script>
import Comment from "@/components/Comment.vue";
import VueLoadImage from "vue-load-image";
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
      modalImg: false,
      modalEmotions: false,
      modalRepost: false,
      img_show: [],
      img_show_index: 0,
      allRepost: [],
    };
  },
  components: {
    Comment,
    VueLoadImage,
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
    hideReferPost: {
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
      if (this.hideReferPost) {
        this.$emit("getAllRepost");
      } else {
        await this.$store.dispatch("getPost", {
          post_id: this.post.post_id,
        });
      }
    },
    async createComment() {
      await this.$store.dispatch("createComment", {
        text: this.newComment,
        post_id: this.post.post_id,
        reply_comment_id: null,
      });
      if (this.hideReferPost) {
        this.$emit("getAllRepost");
      } else {
        await this.$store.dispatch("getPost", {
          post_id: this.post.post_id,
        });
      }
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
    imgShow(img, i) {
      this.modalImg = true;
      this.img_show = img;
      this.img_show_index = i;
    },
    async getAllRepost() {
      this.allRepost = await this.$store.dispatch(
        "getAllRepost",
        this.post.post_id
      );
      this.modalRepost = true;
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
