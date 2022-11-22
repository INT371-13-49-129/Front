<template>
  <div
    class="filter drop-shadow-all w-full mt-3 bg-white rounded-2xl pb-6 overflow-y-auto"
    v-if="account"
  >
    <div
      class="h-1/6 w-full py-4 bg-blue-200 flex items-center"
      :style="
        account.cover_image_url
          ? {
              'background-image': `url(${getFile(account.cover_image_url)})`,
              'background-repeat': 'no-repeat',
              'background-size': 'cover',
              'background-position': 'center',
            }
          : ''
      "
    >
      <vs-avatar size="60" circle class="ml-4">
        <img
          v-if="account.image_url"
          :src="getFile(account.image_url)"
          alt=""
        />
        <i v-else class="bx bx-user"></i>
      </vs-avatar>
    </div>
    <div class="px-4">
      <div class="flex justify-between items-center mt-1">
        <div
          class="text-lg font-semibold hover:underline cursor-pointer"
          @click.stop="$router.push('/profile/' + account.account_id)"
        >
          {{ getName(account) }}
        </div>
        <div class="flex justify-center items-center">
          <vs-button
            @click="$router.push('/profile/edit')"
            circle
            border
            size="small"
            v-if="isLogin && account_id == myAccount.account_id"
          >
            <i class="bx bxs-edit"></i> Edit
          </vs-button>
          <vs-button
            @click="modalDeleteFollow = true"
            circle
            border
            size="small"
            v-else-if="
              isLogin &&
              myAccount.follows.map((f) => f.account_id).includes(account_id)
            "
          >
            ติดตามแล้ว
          </vs-button>
          <vs-button
            @click="createFollow()"
            circle
            border
            size="small"
            v-else-if="isLogin"
          >
            ติดตาม
          </vs-button>
          <i
            v-if="isLogin && account_id != myAccount.account_id"
            @click="$router.push('/messages/' + account.account_id)"
            class="bx bx-message-rounded-dots ml-1 text-2xl cursor-pointer text-primary"
          ></i>
        </div>
      </div>
      <div class="flex justify-around my-2">
        <div
          v-if="account.role == 'Psychologist'"
          class="flex flex-col items-center"
        >
          <div class="font-semibold">{{ account.countPostArticle }}</div>
          <div class="text-sm xl:text-base">บทความ</div>
        </div>
        <div class="flex flex-col items-center">
          <div class="font-semibold">{{ account.countPost }}</div>
          <div class="text-sm xl:text-base">โพสต์</div>
        </div>
        <div
          class="flex flex-col items-center"
          :class="account.follows.length > 0 ? 'cursor-pointer' : ''"
          @click="account.follows.length > 0 ? (modalFollows = true) : ''"
        >
          <div class="font-semibold">{{ account.follows.length }}</div>
          <div class="text-sm xl:text-base">กำลังติดตาม</div>
        </div>
        <div
          class="flex flex-col items-center"
          :class="account.account_follower.length > 0 ? 'cursor-pointer' : ''"
          @click="
            account.account_follower.length > 0
              ? (modalAccountFollower = true)
              : ''
          "
        >
          <div class="font-semibold">{{ account.account_follower.length }}</div>
          <div class="text-sm xl:text-base">ผู้ติดตาม</div>
        </div>
      </div>
      <div v-if="account.bio && account.bio != ''">
        <div class="text-base">Bio</div>
        <div
          v-html="account.bio.replace(/(?:\r\n|\r|\n)/g, '<br />')"
          class="text-sm flex items-center mb-3 mt-1 pb-2"
        ></div>
      </div>
      <div class="text-base py-2 border-t-2 border-b-2">ข้อมูลเพิ่มเติม</div>
      <div
        v-show="isLogin && account_id == myAccount.account_id"
        class="text-sm flex items-center my-2"
      >
        <i class="bx bx-time-five text-base mr-1"></i>เกิด
        {{ getDate(account.date_of_birth) }}
      </div>
      <div
        v-if="account.role == 'Psychologist'"
        class="text-sm flex items-center my-2 justify-between"
      >
        <div
          class="flex items-center cursor-pointer"
          @click="modalAccountReviewer = true"
        >
          <i class="bx bx-star text-base mr-1"></i>
          {{ parseFloat(account.avgRatings).toFixed(1) }} เรตติ้ง ({{
            account.account_reviewer.length
          }})
        </div>
        <div
          class="text-gray-500 cursor-pointer"
          v-if="
            isLogin &&
            account.account_reviewer
              .map((r) => r.account_id_reviewer)
              .includes(myAccount.account_id)
          "
          @click="showModalReview()"
        >
          แก้ไขรีวิว
        </div>
      </div>
      <div class="text-sm flex items-center my-2">
        <i class="bx bx-calendar text-base mr-1"></i>joined
        {{ getDate(account.createdAt) }}
      </div>
      <div
        v-show="isLogin && account_id == myAccount.account_id"
        class="text-sm flex items-center my-2"
      >
        <i class="bx bx-envelope text-base mr-1"></i>{{ account.email }}
      </div>
      <div
        v-show="isLogin && account_id == myAccount.account_id"
        class="text-sm flex items-center my-2 pl-3"
      >
        * อีเมลไม่แสดงให้ผู้อื่นเห็น
      </div>
      <div
        v-if="
          account.role != 'Psychologist' &&
          (account.is_listener || account_id == myAccount.account_id)
        "
        class="text-base py-2 border-t-2 border-b-2"
      >
        โหมดผู้รับฟัง
      </div>
      <div
        v-if="account.role == 'Psychologist'"
        class="text-base py-2 border-t-2 border-b-2"
      >
        โหมดผู้เชี่ยวชาญ
      </div>
      <div
        v-if="
          account.is_listener ||
          account_id == myAccount.account_id ||
          account.role == 'Psychologist'
        "
        class="flex text-sm mt-3 items-center flex-wrap"
      >
        <div class="text-sm mr-2">
          หัวข้อ : <span v-if="account.account_topics.length == 0">-</span>
        </div>
        <div
          v-for="account_topic in account.account_topics"
          :key="account_topic.account_topic_id"
          class="py-0.5 px-2 rounded-md border-2 filter mr-2 my-0.5 shadow-xs bg-white"
        >
          {{ account_topic.topic.name }}
        </div>
      </div>
      <div
        v-if="
          account.role == 'Psychologist' &&
          account.description &&
          account.description != ''
        "
      >
        <div class="text-base">คำอธิบาย</div>
        <div
          v-html="account.description.replace(/(?:\r\n|\r|\n)/g, '<br />')"
          class="text-sm flex items-center mb-3 mt-1 pb-2"
        ></div>
      </div>
      <div
        v-if="
          isLogin &&
          account_id == myAccount.account_id &&
          account.role != 'Psychologist'
        "
        class="flex text-sm mt-3 items-center justify-between"
      >
        <div>พร้อมที่จะเป็นผู้รับฟัง</div>
        <vs-switch v-model="is_listener" />
      </div>
    </div>
    <vs-dialog v-model="modalDeleteFollow">
      <template #header>
        <div class="mt-2 text-lg font-semibold">การติดตาม</div>
      </template>
      <vs-button @click="deleteFollow()" danger border block size="large">
        ยกเลิกการติดตาม
      </vs-button>
    </vs-dialog>
    <vs-dialog v-model="modalFollows">
      <template #header>
        <div class="mt-2 text-lg font-semibold">กำลังติดตาม</div>
      </template>
      <div class="border-t-2 -mt-2">
        <div
          v-for="follow in follows"
          :key="follow.follow_id"
          class="mt-3 flex items-center"
        >
          <vs-avatar circle class="flex-shrink-0 mr-3">
            <img
              v-if="follow.account.image_url"
              :src="getFile(follow.account.image_url)"
              alt=""
            />
            <i v-else class="bx bx-user"></i>
          </vs-avatar>
          <div
            class="font-semibold flex-grow hover:underline cursor-pointer"
            @click.stop="$router.push('/profile/' + follow.account.account_id)"
          >
            {{ getName(follow.account) }}
          </div>
        </div>
      </div>
    </vs-dialog>
    <vs-dialog v-model="modalAccountFollower">
      <template #header>
        <div class="mt-2 text-lg font-semibold">ผู้ติดตาม</div>
      </template>
      <div class="border-t-2 -mt-2">
        <div
          v-for="follower in account_follower"
          :key="follower.follow_id"
          class="mt-3 flex items-center"
        >
          <vs-avatar circle class="flex-shrink-0 mr-3">
            <img
              v-if="follower.account_follower.image_url"
              :src="getFile(follower.account_follower.image_url)"
              alt=""
            />
            <i v-else class="bx bx-user"></i>
          </vs-avatar>
          <div
            class="font-semibold flex-grow hover:underline cursor-pointer"
            @click.stop="
              $router.push('/profile/' + follower.account_follower.account_id)
            "
          >
            {{ getName(follower.account_follower) }}
          </div>
        </div>
      </div>
    </vs-dialog>
    <vs-dialog v-model="modalAccountReviewer">
      <template #header>
        <div class="mt-2 text-lg font-semibold">รีวิว</div>
      </template>
      <div class="border-t-2 -mt-2">
        <div
          v-for="reviewer in account_reviewer"
          :key="reviewer.rating_id"
          class="mt-3"
        >
          <div class="border-2 p-2 rounded-2xl">
            <div class="flex items-center">
              <vs-avatar circle class="flex-shrink-0 mr-3">
                <img
                  v-if="reviewer.account_reviewer.image_url"
                  :src="getFile(reviewer.account_reviewer.image_url)"
                  alt=""
                />
                <i v-else class="bx bx-user"></i>
              </vs-avatar>
              <div
                class="font-semibold flex-grow hover:underline cursor-pointer"
                @click.stop="
                  $router.push(
                    '/profile/' + reviewer.account_reviewer.account_id
                  )
                "
              >
                {{ getName(reviewer.account_reviewer) }}
              </div>
            </div>
            <div class="flex mt-2 items-center">
              <div class="flex items-center mt-0.5 mr-1">
                <div v-for="i in 5" :key="i">
                  <i
                    class="bx text-yellow-300"
                    :class="i <= reviewer.rating_score ? 'bxs-star' : 'bx-star'"
                  ></i>
                </div>
              </div>
              {{ getDate(reviewer.updated_at) }}
            </div>
            <div class="ml-0.5">
              {{ reviewer.review }}
            </div>
          </div>
        </div>
      </div>
    </vs-dialog>
    <vs-dialog v-model="modalReview">
      <template #header>
        <div class="mt-2 text-lg font-semibold">ให้คะแนนและรีวิว</div>
      </template>
      <div class="border-t-2 pt-3 -mt-2">
        <div class="flex justify-center gap-4">
          <div v-for="i in 5" :key="i">
            <i
              class="bx text-yellow-300 text-3xl cursor-pointer"
              :class="i <= rating_score ? 'bxs-star' : 'bx-star'"
              @click="rating_score = i"
            ></i>
          </div>
        </div>
      </div>
      <div class="mt-2">
        <div>รีวิว/ข้อเสนอแนะ</div>
        <textarea
          class="focus:outline-none w-full px-6 py-4 rounded-xl mt-1 scroll border-2 h-40"
          v-model.trim="review"
        ></textarea>
      </div>
      <div class="flex justify-center">
        <vs-button
          :disabled="rating_score == 0"
          @click="rating_score == 0 ? '' : createRating()"
        >
          <span class="mx-3">save</span>
        </vs-button>
      </div>
    </vs-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import mixin from "@/mixin/mixin.js";

export default {
  mixins: [mixin],
  data() {
    return {
      is_listener: false,
      account: null,
      modalDeleteFollow: false,
      follows: [],
      account_follower: [],
      modalFollows: false,
      modalAccountFollower: false,
      account_reviewer: [],
      modalAccountReviewer: false,
      modalReview: false,
      rating_score: 0,
      review: "",
    };
  },
  props: {
    account_id: {
      type: Number,
    },
  },
  methods: {
    async getAccount() {
      if (this.isLogin && this.account_id == this.myAccount.account_id) {
        this.account = this.myAccount;
        this.is_listener = this.myAccount.is_listener;
      } else {
        try {
          const res = await this.$store.dispatch(
            "getAccountById",
            this.account_id
          );
          this.account = res.data.account;
        } catch (error) {
          console.log(error);
        }
      }
      const res = await this.$store.dispatch(
        "getFollowByAccountId",
        this.account_id
      );
      if (this.account.role == "Psychologist") {
        const res2 = await this.$store.dispatch(
          "getRatingByAccountId",
          this.account_id
        );
        this.account_reviewer = res2.data.rating;
      }

      this.follows = res.data.follows;
      this.account_follower = res.data.account_follower;
    },
    async createFollow() {
      await this.$store.dispatch("createFollow", this.account_id);
      await this.$store.dispatch("getAccount");
      this.getAccount();
    },
    async deleteFollow() {
      await this.$store.dispatch("deleteFollow", this.account_id);
      await this.$store.dispatch("getAccount");
      this.getAccount();
      this.modalDeleteFollow = false;
    },
    async createRating() {
      await this.$store.dispatch("createRating", {
        rating_account_id: this.account_id,
        rating_score: this.rating_score,
        review: this.review,
      });
      await this.$store.dispatch("getAccount");
      this.getAccount();
      this.modalReview = false;
    },
    showModalReview() {
      if (
        this.isLogin &&
        this.account.account_reviewer
          .map((r) => r.account_id_reviewer)
          .includes(this.myAccount.account_id)
      ) {
        const rating = this.account.account_reviewer.find(
          (r) => r.account_id_reviewer == this.myAccount.account_id
        );
        this.rating_score = rating.rating_score;
        this.review = rating.review;
      } else {
        this.rating_score = 0;
        this.review = "";
      }
      this.modalReview = true;
    },
  },
  async mounted() {
    this.getAccount();
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      myAccount: "getAccount",
    }),
  },
  watch: {
    account_id() {
      this.getAccount();
    },
    is_listener: async function () {
      await this.$store.dispatch("updateAccountListener", {
        is_listener: this.is_listener,
      });
      await this.$store.dispatch("getAccount");
      this.getAccount();
    },
  },
};
</script>
