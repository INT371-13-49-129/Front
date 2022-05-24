<template>
  <div class="w-full h-full flex">
    <router-link to="/">
      <i class="bx bx-x bx-sm absolute right-5 top-5 text-gray-500"> </i>
    </router-link>
    <div class="my-auto mx-auto">
      <div class="text-3xl text-center font-medium">Login</div>
      <div class="text-sm text-center mx-10 mt-3 text-gray-400">
        Create an account to enjoy all the services without any ads for free!
      </div>
      <div class="w-4/6 mx-auto center content-inputs">
        <vs-input
          type="email"
          label="Email"
          v-model="login.email"
          shadow
          placeholder="Enter your email address"
          class="mt-8 input-login"
        >
          <template v-if="!validate.email" #message-danger>{{
            validatetext.email
          }}</template>
        </vs-input>
        <vs-input
          type="password"
          label="Password"
          v-model="login.password"
          shadow
          placeholder="Enter your password"
          :visiblePassword="hasVisiblePassword"
          icon-after
          @click-icon="hasVisiblePassword = !hasVisiblePassword"
          @keyup.enter="submitFrom()"
          class="mt-9 input-login"
        >
          <template v-if="!validate.password" #message-danger>{{
            validatetext.password
          }}</template>
          <template #icon>
            <i v-if="!hasVisiblePassword" class="bx bx-show-alt"></i>
            <i v-else class="bx bx-hide"></i>
          </template>
        </vs-input>
        <div
          class="w-full flex flex-row-reverse mt-2 mb-4 text-xs text-gray-500 underline"
        >
          <router-link to="/">Forget password?</router-link>
        </div>
        <vs-button
          :active="true"
          class="w-full button-login"
          @click="submitFrom()"
          >SIGN IN</vs-button
        >
      </div>
      <div class="text-sm text-center mx-10 mt-5 text-gray-400">
        Don't have an account yet?&nbsp;
        <router-link to="/" class="text-gray-800 font-semibold">
          Sign up</router-link
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
export default {
  data() {
    return {
      login: {
        email: "",
        password: "",
      },
      validate: {
        email: false,
        password: false,
        from: false,
      },
      validatetext: {
        email: "",
        password: "",
      },
      hasVisiblePassword: false,
    };
  },
  methods: {
    validateEmail() {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (this.login.email === "") {
        this.validatetext.email = "Please enter your email";
        this.validate.email = false;
      } else if (!re.test(String(this.login.email).toLowerCase())) {
        this.validatetext.email =
          "Please enter your email in the correct format.";
        this.validate.email = false;
      } else if (this.login.email.length > 50) {
        this.validatetext.email =
          "Email must not be longer than 50 characters.";
        this.validate.email = false;
      } else {
        this.validate.email = true;
      }
    },
    validatePass() {
      if (this.login.password === "") {
        this.validatetext.password = "Please enter your password";
        this.validate.password = false;
      } else if (this.login.password.length < 6) {
        this.validatetext.password =
          "Password must be longer than 6 characters.";
        this.validate.password = false;
      } else {
        this.validate.password = true;
      }
    },
    validateFrom() {
      this.validateEmail();
      this.validatePass();

      this.validate.from = true;
      Object.values(this.validate).forEach((v) => {
        this.validate.from = v && this.validate.from;
      });
    },
    async submitFrom() {
      this.validateFrom();
      if (this.validate.from) {
        try {
          await this.$store.dispatch("login", this.login);
          this.$router.replace("/");
        } catch (err) {
          console.log(err);
          const error = err.response?.data?.error;
          let title;

          if (error == "Email or password is incorrect!") {
            title = "Email or password is incorrect!";
          } else if (error == "Waiting for email confirmation.") {
            title = "Waiting for email confirmation.";
          } else {
            title = "Login failed, please try again.";
          }

          this.$vs.notification({
            progress: "auto",
            flat: true,
            color: "danger",
            position: "top-right",
            title,
          });
        }
      }
    },
  },
  watch: {
    "login.email": function () {
      this.validateEmail();
    },
    "login.password": function () {
      this.validatePass();
    },
  },
};
</script>
<style lang="css">
.input-login .vs-input {
  width: 100% !important;
  border: 1px solid #eeeeee !important;
  border-radius: 8px !important;
}
.input-login .vs-input__label--label {
  font-size: 1.125rem;
  font-weight: 600;
}
.input-login .vs-input__label {
  font-size: 1rem;
}
.button-login {
  margin: 0 !important;
  font-size: 1.125rem;
}
</style>
