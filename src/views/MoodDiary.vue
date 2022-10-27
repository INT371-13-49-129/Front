<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div
      class="mt-16 xl:mb-0 mb-12 xl:w-2/3 w-full mx-auto xl:pt-4 pt-2 xl:px-0 px-2"
    >
      <div
        class="flex justify-between relative items-center py-4 border-b-2 mb-2"
      >
        <div class="text-2xl font-semibold">Diary</div>
        <i class="bx bx-book-heart text-3xl"></i>
      </div>
      <div class="filter drop-shadow-all w-full mt-3 bg-white rounded-2xl">
        <div class="flex justify-between items-center pt-6 pb-3 px-10">
          <input
            id="yearmonth"
            v-model="year_month"
            type="month"
            class="focus:outline-none w-full text-2xl"
            onkeydown="return false"
          />
        </div>
        <table class="w-full font-medium">
          <tr>
            <th
              v-for="dw in daysOfWeek"
              :key="dw"
              class="w-1/7 text-center text-gray-400 h-12 pb-2"
            >
              {{ dw }}
            </th>
          </tr>
          <tr v-for="(wm, i) in sliceIntoChunks(dateInMonth, 7)" :key="i">
            <td
              v-for="d in wm"
              :key="d.date.getTime()"
              class="text-center"
              :class="
                d.date.getMonth() + 1 === parseInt(ym[1]) ? '' : 'text-gray-400'
              "
            >
              <div class="flex justify-center items-center">
                <div
                  class="xl:px-4 px-1 pb-1 pt-3 rounded-md h-14 xl:w-14 w-full"
                  :class="
                    d.date.getMonth() + 1 === parseInt(ym[1]) &&
                    (+d.date < +new Date() || sameDay(d.date, new Date()))
                      ? sameDay(d.date, date)
                        ? 'bg-blue-50 cursor-pointer'
                        : 'hover:bg-blue-50 cursor-pointer'
                      : ''
                  "
                  @click="
                    +d.date < +new Date() || sameDay(d.date, new Date())
                      ? getDate(d.date)
                      : ''
                  "
                >
                  <div>{{ d.date.getDate() }}</div>
                  <div class="flex justify-center">
                    <i
                      v-if="d.diary"
                      class="bx bx-book-heart text-sm text-primary"
                    ></i>
                    <i
                      v-if="d.mood_diary"
                      class="bx text-sm"
                      :class="d.mood_diary.mood.icon"
                      :style="{ color: d.mood_diary.mood.color }"
                    ></i>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </table>
        <div class="w-full h-6"></div>
      </div>
      <div class="filter drop-shadow-all w-full mt-3 bg-white rounded-2xl">
        <div
          class="flex xl:flex-row flex-col justify-between items-center pt-6 pb-3 px-10"
        >
          <div class="text-xl font-medium">
            {{
              date.toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          </div>
          <div class="flex justify-center items-center">
            <i
              v-if="mood"
              class="bx text-2xl mr-2"
              :class="mood.icon"
              :style="{ color: mood.color }"
            ></i>
            <div
              @click="modalMood = true"
              class="border-2 rounded-full px-3 xl:mt-0 mt-2 py-1.5 text-sm cursor-pointer"
              :style="
                mood ? { color: mood.color, borderColor: mood.color } : ''
              "
            >
              {{
                mood ? "อารมณ์ในวันนี้ : " + mood.name : "เลือกอารมณ์ในวันนี้"
              }}
            </div>
          </div>
        </div>
        <div class="flex xl:flex-row flex-col px-10 xl:pt-2 pt-0 items-center">
          <div class="text-lg">หัวข้อไดอารี่ :</div>
          <input
            v-model="title"
            class="focus:outline-none border-2 rounded-lg flex-grow ml-2 p-1"
          />
        </div>
        <div class="px-10 pt-2">
          <textarea
            v-model="text"
            placeholder="จดเรื่องราวที่ต้องการบันทึก"
            class="w-full focus:outline-none border-2 rounded-lg h-36 p-4"
          ></textarea>
        </div>
        <div class="flex xl:justify-end justify-center px-10 pb-4">
          <vs-button
            :disabled="text == '' || title == ''"
            danger
            border
            @click="(text = ''), (title = '')"
          >
            Cancel
          </vs-button>
          <vs-button
            :disabled="text == '' || title == ''"
            @click="text == '' || title == '' ? '' : createDiary()"
          >
            Save
          </vs-button>
        </div>
      </div>
      <div
        v-for="diary in diaryDate"
        :key="diary.diary_id"
        class="filter drop-shadow-all w-full mt-3 bg-white rounded-2xl"
      >
        <div class="flex justify-between items-center pt-6 pb-3 px-10">
          <div class="text-lg font-medium">
            {{
              sameDay(new Date(diary.createdAt), date)
                ? getTime(diary.createdAt) + " น."
                : ""
            }}
          </div>
          <div class="flex justify-center items-center">
            <i
              @click="showDeleteDiary(diary)"
              class="bx bx-trash text-2xl mr-2 cursor-pointer"
            ></i>
            <i
              @click="showEditDiary(diary)"
              class="bx bx-edit text-2xl cursor-pointer"
            ></i>
          </div>
        </div>
        <div class="text-lg px-10">{{ diary.title }}</div>
        <div
          v-html="diary.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"
          class="px-10 pt-2 pb-4"
        ></div>
      </div>
      <div
        class="filter drop-shadow-all w-full mt-3 bg-white rounded-2xl xl:mb-4 mb-16"
      >
        <div class="flex justify-between items-center pt-6 pb-3 px-10">
          <div class="text-2xl font-medium">Mood Tracker Year</div>
          <div></div>
        </div>
        <div class="px-8 pb-4">
          <div class="overflow-y-auto flex justify-center xl:h-auto h-96">
            <table class="xl:w-full w-72 font-medium">
              <tr
                v-for="(wy, i) in sliceIntoChunks(dateInYear, 7)"
                :key="i"
                class="year_tr"
              >
                <td
                  v-for="d in wy"
                  :key="d.date.getTime()"
                  class="year_td p-0.5"
                >
                  <vs-tooltip>
                    <div
                      class="xl:h-3.5 h-9 xl:w-3.5 w-9 rounded"
                      :class="
                        d.date.getFullYear() == parseInt(ym[0])
                          ? +d.date < +new Date() || sameDay(d.date, new Date())
                            ? d.mood_diary
                              ? ''
                              : 'bg-gray-200'
                            : 'bg-gray-50'
                          : 'bg-gray-50'
                      "
                      :style="
                        d.mood_diary
                          ? { backgroundColor: d.mood_diary.mood.color }
                          : ''
                      "
                      @click="
                        +d.date < +new Date() || sameDay(d.date, new Date())
                          ? getDate(d.date)
                          : ''
                      "
                    ></div>
                    <template #tooltip>
                      {{ d.date.toLocaleDateString() }}
                    </template>
                  </vs-tooltip>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <vs-dialog v-model="modalMood">
      <template #header>
        <h4 class="mt-2 text-lg font-semibold">อารมณ์ในวันนี้</h4>
      </template>
      <div class="-mt-2">
        <div
          class="my-1 py-2 px-2 hover:bg-primary hover:bg-opacity-5 cursor-pointer flex items-center justify-center"
          v-for="mood in allMood"
          :key="mood.mood_id"
          @click="updateMood(mood)"
        >
          <i
            class="bx text-2xl mr-2"
            :class="mood.icon"
            :style="{ color: mood.color }"
          ></i>
          {{ mood.name }}
        </div>
      </div>
    </vs-dialog>
    <ManageDiary
      ref="manageDiary"
      @deleteDiaryFinish="deleteDiaryFinish"
      @updateDiaryFinish="updateDiaryFinish"
    ></ManageDiary>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import NavbarSidebar from "@/components/NavbarSidebar.vue";
import ManageDiary from "@/components/ManageDiary.vue";

export default {
  data() {
    return {
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      year_month: "",
      year_month_date: "",
      ym: [],
      dateInMonth: [],
      dateInYear: [],
      date: new Date(),
      title: "",
      text: "",
      modalMood: false,
      mood: null,
      moodDiaryMonth: [],
      moodDiaryYear: [],
      moodDiaryDate: null,
      diaryMonth: [],
      diaryDate: [],
    };
  },
  components: { NavbarSidebar, ManageDiary },
  methods: {
    async datesMonth(year, month) {
      const res1 = await this.$store.dispatch(
        "getMoodDiaryMonth",
        year + "-" + month
      );
      const res2 = await this.$store.dispatch(
        "getDiaryMonth",
        year + "-" + month
      );
      this.moodDiaryMonth = res1.data.mood_diary;
      this.diaryMonth = res2.data.diary;
      const dates = [];
      const daysInMonth = new Date(year, month, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year + "-" + month + "-" + i);
        const mood_diary = this.moodDiaryMonth.find((md) =>
          this.sameDay(new Date(md.date), date)
        );
        const diary = this.diaryMonth.find((dm) =>
          this.sameDay(new Date(dm.date), date)
        );
        dates.push({ date, mood_diary, diary });
      }
      const dayF = dates[0].date.getDay();
      const dayL = dates[dates.length - 1].date.getDay();
      if (dayF !== 0) {
        for (let i = 0; i < dayF; i++) {
          const d = new Date(dates[0].date);
          d.setDate(d.getDate() - 1);
          dates.unshift({ date: d });
        }
      }
      if (dayL !== 6) {
        for (let i = 0; i < 6 - dayL; i++) {
          const d = new Date(dates[dates.length - 1].date);
          d.setDate(d.getDate() + 1);
          dates.push({ date: d });
        }
      }
      this.dateInMonth = dates;
    },
    async datesYear(year) {
      const res = await this.$store.dispatch("getMoodDiaryYear", year);
      this.moodDiaryYear = res.data.mood_diary;
      const dates = [];
      for (let j = 1; j <= 12; j++) {
        const daysInMonth = new Date(year, j, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          const date = new Date(year + "-" + j + "-" + i);
          const mood_diary = this.moodDiaryYear.find((md) =>
            this.sameDay(new Date(md.date), date)
          );
          dates.push({ date, mood_diary });
        }
      }

      const dayF = dates[0].date.getDay();
      const dayL = dates[dates.length - 1].date.getDay();
      if (dayF !== 0) {
        for (let i = 0; i < dayF; i++) {
          const d = new Date(dates[0].date);
          d.setDate(d.getDate() - 1);
          dates.unshift({ date: d });
        }
      }
      if (dayL !== 6) {
        for (let i = 0; i < 6 - dayL; i++) {
          const d = new Date(dates[dates.length - 1].date);
          d.setDate(d.getDate() + 1);
          dates.push({ date: d });
        }
      }
      this.dateInYear = dates;
    },
    sliceIntoChunks(arr, chunkSize) {
      const res = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
      }
      return res;
    },
    async getDate(date = "") {
      const dt = date == "" ? new Date() : new Date(date);
      const month = String(dt.getMonth() + 1).padStart(2, "0");
      const year = dt.getFullYear();
      this.date = dt;
      this.year_month = year + "-" + month;
      this.year_month_date =
        year + "-" + month + "-" + String(dt.getDate()).padStart(2, "0");
      const res1 = await this.$store.dispatch(
        "getMoodDiaryDate",
        this.year_month_date
      );
      const res2 = await this.$store.dispatch(
        "getDiaryDate",
        this.year_month_date
      );
      this.moodDiaryDate = res1.data.mood_diary;
      this.mood = this.moodDiaryDate ? this.moodDiaryDate.mood : null;
      this.diaryDate = res2.data.diary;
    },
    sameDay(date1, date2) {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    },
    async updateMood(mood) {
      const loading = this.$vs.loading();
      await this.$store.dispatch("updateMoodDiary", {
        mood_id: mood.mood_id,
        date: this.year_month_date,
      });
      this.ym = this.year_month.split("-");
      await this.datesMonth(this.ym[0], this.ym[1]);
      await this.datesYear(this.ym[0]);
      await this.getDate(this.year_month_date);
      this.modalMood = false;
      loading.close();
    },
    getTime(date) {
      const d = new Date(date);
      const hours = this.format_two_digits(d.getHours());
      const minutes = this.format_two_digits(d.getMinutes());
      return hours + ":" + minutes;
    },
    format_two_digits(n) {
      return n < 10 ? "0" + n : n;
    },
    async createDiary() {
      const loading = this.$vs.loading();
      await this.$store.dispatch("createDiary", {
        title: this.title,
        text: this.text,
        date: this.year_month_date,
      });
      this.ym = this.year_month.split("-");
      await this.datesMonth(this.ym[0], this.ym[1]);
      await this.getDate(this.year_month_date);
      this.text = "";
      this.title = "";
      loading.close();
    },
    showDeleteDiary(diary) {
      this.$refs.manageDiary.showDeleteDiary(diary);
    },
    showEditDiary(diary) {
      this.$refs.manageDiary.showEditDiary(diary);
    },
    async deleteDiaryFinish() {
      const loading = this.$vs.loading();
      this.ym = this.year_month.split("-");
      await this.datesMonth(this.ym[0], this.ym[1]);
      await this.getDate(this.year_month_date);
      loading.close();
    },
    async updateDiaryFinish() {
      const loading = this.$vs.loading();
      await this.getDate(this.year_month_date);
      loading.close();
    },
  },
  async mounted() {
    const loading = this.$vs.loading();
    this.getDate();
    await this.$store.dispatch("getAllMood");
    loading.close();
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      allMood: "getAllMood",
    }),
  },
  watch: {
    year_month: async function () {
      if (this.year_month == "") return this.getDate();
      const loading = this.$vs.loading();
      const y = this.ym[0];
      this.ym = this.year_month.split("-");
      await this.datesMonth(this.ym[0], this.ym[1]);
      if (y != this.ym[0]) await this.datesYear(this.ym[0]);
      loading.close();
    },
  },
};
</script>
<style>
@media (min-width: 1280px) {
  .year_tr {
    display: block;
    float: left;
  }
  .year_td {
    display: block;
  }
}
</style>
