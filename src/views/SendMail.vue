<template>
  <div class="flex flex-col item-center w-full h-full overflow-y-auto py-6">
    <router-link to="/">
      <i class="bx bx-x bx-sm absolute right-5 top-5 text-gray-500"></i>
    </router-link>
    <div class="my-auto mx-auto">
      <img
        src="../assets/img/Mail.svg"
        width="103px"
        height="103px"
        class="mx-auto mb-6"
      />
      <div class="text-2xl text-center font-medium">EMAIL VERIFICATION</div>
      <div class="text-sm text-center mx-10 mt-3 text-gray-400">
        เราได้ส่งอีเมลไปที่ {{ sendMail }}
        คลิกลิงก์ในอีเมลเพื่อยืนยันที่อยู่อีเมลของคุณ
        <br /><br />
        ไม่พบอีเมลของคุณ? โปรดตรวจสอบโปรโมชั่นหรือโฟลเดอร์สแปม / ขยะของคุณ
        ดูของมูลเพิ่มเติมได้ที่ FAQs
      </div>
      <div class="text-sm text-center mx-10 mt-5 text-gray-400">
        ไม่ได้รับอีเมลยืนยัน?&nbsp;
        <span
          @click="sendMailAgain()"
          class="text-gray-800 font-semibold cursor-pointer"
        >
          ส่งอีเมลอีกครั้ง</span
        >
      </div>
      <img
        src="../assets/logo.png"
        width="83.45px"
        height="28px"
        class="mx-auto mt-6"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  methods: {
    async sendMailAgain() {
      const loading = this.$vs.loading();
      try {
        await this.$store.dispatch("resendMail", this.sendMail);
      } catch (err) {
        console.log(err);
        const error = err.response?.data?.error;
        let title;

        if (error == "Account Status is incorrect!") {
          title = "Account Status is incorrect!";
        } else {
          title = "An error occurred, please try again.";
        }

        this.$vs.notification({
          progress: "auto",
          flat: true,
          color: "danger",
          position: "top-right",
          title,
        });
      }
      loading.close();
    },
  },
  mounted() {
    if (!this.sendMail) {
      this.$router.replace("/");
    }
  },
  computed: {
    ...mapGetters({
      sendMail: "getSendMail",
    }),
  },
};
</script>
