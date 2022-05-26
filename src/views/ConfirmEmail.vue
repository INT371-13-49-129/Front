<template>
  <div class="flex flex-col item-center w-full h-full overflow-y-auto py-6">
    <div class="my-auto mx-auto">
      <div v-if="success">
        <img
          src="../assets/img/Check.png"
          width="80px"
          height="80px"
          class="mx-auto mb-6"
        />
        <div class="text-2xl text-center font-medium">EMAIL VERIFICATION</div>
        <div class="text-2xl text-center font-medium mb-6">SUCCESS</div>
        <div class="mx-auto w-44">
          <router-link to="/login">
            <vs-button :active="true" class="b-login w-full">LOGIN</vs-button>
          </router-link>
        </div>
      </div>
      <div v-else>
        <div class="mx-auto mb-6 flex justify-center">
          <i class="bx bx-error-circle text-8xl text-red-500"></i>
        </div>
        <div class="text-2xl text-center font-medium">AN ERROR OCCURRED</div>
        <div class="text-sm text-center mx-10 mt-3 text-gray-400">
          Link may have expired or been canceled, or Account is not pending
          verification.
        </div>
        <div class="mx-auto w-44 mt-8">
          <router-link to="/login">
            <vs-button :active="true" class="b-login w-full">LOGIN</vs-button>
          </router-link>
        </div>
      </div>
      <img
        src="../assets/logo.png"
        width="83.45px"
        height="28px"
        class="mx-auto mt-8"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      token: this.$route.query.token,
      success: false,
    };
  },
  async mounted() {
    if (!this.token) {
      this.$router.push("/");
    } else {
      const res = await this.$store.dispatch("confirmEmail", this.token);
      this.success = res?.data?.status == "success";
    }
  },
};
</script>
<style lang="css">
.b-login {
  margin: 0 !important;
  font-size: 1.125rem;
}
</style>
