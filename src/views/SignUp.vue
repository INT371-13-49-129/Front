<template>
  <div class="flex flex-col item-center w-full h-full overflow-y-auto py-6">
    <router-link to="/">
      <i class="bx bx-x bx-sm absolute right-5 top-5 text-gray-500"> </i>
    </router-link>
    <div class="my-auto mx-auto">
      <div class="text-3xl text-center font-medium">Create An Account</div>
      <div class="text-sm text-center mx-10 mt-3 text-gray-400">
        Create an account to enjoy all the services without any ads for free!
      </div>
      <div
        v-show="false"
        class="flex bg-blue-200 border-2 text-white border-blue-400 mt-6 mb-12 mx-auto rounded-md text-sm w-4/6"
      >
        <div
          class="w-1/2 text-center py-1 cursor-pointer"
          :class="{
            'border-r-2 border-blue-400 bg-white rounded-md text-blue-400 font-semibold': true,
          }"
        >
          User
        </div>
        <div
          class="w-1/2 text-center py-1 cursor-pointer"
          :class="{
            'border-l-2 border-blue-400 bg-white rounded-md text-blue-400 font-semibold': false,
          }"
        >
          Psychologist
        </div>
      </div>
      <div class="w-4/6 mx-auto center content-inputs">
        <vs-input
          type="email"
          label="Email"
          v-model="signup.email"
          shadow
          placeholder="Enter your email address"
          class="mt-8 input-signup"
        >
          <template v-if="!validate.email" #message-danger>{{
            validatetext.email
          }}</template>
        </vs-input>
        <vs-input
          type="text"
          label="Username"
          v-model="signup.username"
          shadow
          placeholder="Enter your username"
          class="mt-8 input-signup"
        >
          <template v-if="!validate.username" #message-danger>{{
            validatetext.username
          }}</template>
        </vs-input>
        <vs-input
          type="password"
          label="Password"
          v-model="signup.password"
          shadow
          placeholder="Enter your password"
          :visiblePassword="hasVisiblePassword"
          icon-after
          @click-icon="hasVisiblePassword = !hasVisiblePassword"
          class="mt-9 input-signup"
        >
          <template v-if="!validate.password" #message-danger>{{
            validatetext.password
          }}</template>
          <template #icon>
            <i v-if="!hasVisiblePassword" class="bx bx-show-alt"></i>
            <i v-else class="bx bx-hide"></i>
          </template>
        </vs-input>
        <vs-input
          type="password"
          label="Comfirm Password"
          v-model="comfirmPass"
          shadow
          placeholder="Enter your password again"
          :visiblePassword="hasVisibleComfirmPass"
          icon-after
          @click-icon="hasVisibleComfirmPass = !hasVisibleComfirmPass"
          class="mt-9 input-signup"
        >
          <template v-if="!validate.comfirmPass" #message-danger>{{
            validatetext.comfirmPass
          }}</template>
          <template #icon>
            <i v-if="!hasVisibleComfirmPass" class="bx bx-show-alt"></i>
            <i v-else class="bx bx-hide"></i>
          </template>
        </vs-input>
        <vs-select
          class="mt-9 input-signup"
          label="Gender"
          placeholder="Select your gender"
          v-model="signup.gender"
          shadow
        >
          <template v-if="!validate.gender" #message-danger>{{
            validatetext.gender
          }}</template>
          <vs-option label="Male" value="Male"> Male </vs-option>
          <vs-option label="Female" value="Female"> Female </vs-option>
          <vs-option label="Unspecified" value="Unspecified">
            Unspecified
          </vs-option>
        </vs-select>
        <vs-input
          type="date"
          label="Date of birth"
          v-model="signup.date_of_birth"
          :max="currentDate()"
          shadow
          class="mt-8 mb-6 input-signup"
        >
          <template v-if="!validate.date_of_birth" #message-danger>{{
            validatetext.date_of_birth
          }}</template>
        </vs-input>
        <vs-button
          :active="true"
          class="w-full button-signup"
          @click="submitFrom()"
          >Create Account</vs-button
        >
      </div>
      <div class="text-sm text-center mx-10 mt-5 text-gray-400">
        Already Have An Account?&nbsp;
        <router-link to="/login" class="text-gray-800 font-semibold">
          Sign In</router-link
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
import { statusCode } from "../util/statusCode.js";

export default {
  data() {
    return {
      signup: {
        email: "",
        password: "",
        username: "",
        date_of_birth: "",
        gender: "",
      },
      validate: {
        email: false,
        password: false,
        username: false,
        comfirmPass: false,
        date_of_birth: false,
        gender: false,
        from: false,
      },
      validatetext: {
        email: "",
        password: "",
        username: "",
        comfirmPass: "",
        date_of_birth: "",
        gender: "",
      },
      comfirmPass: "",
      hasVisiblePassword: false,
      hasVisibleComfirmPass: false,
    };
  },
  methods: {
    currentDate() {
      return new Date().toISOString().split("T")[0];
    },
    validateEmail() {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (this.signup.email === "") {
        this.validatetext.email = "Please enter your email";
        this.validate.email = false;
      } else if (!re.test(String(this.signup.email).toLowerCase())) {
        this.validatetext.email =
          "Please enter your email in the correct format.";
        this.validate.email = false;
      } else if (this.signup.email.length > 50) {
        this.validatetext.email =
          "Email must not be longer than 50 characters.";
        this.validate.email = false;
      } else {
        this.validate.email = true;
      }
    },
    validatePass() {
      if (this.signup.password === "") {
        this.validatetext.password = "Please enter your password";
        this.validate.password = false;
      } else if (this.signup.password.length < 6) {
        this.validatetext.password =
          "Password must be longer than 6 characters.";
        this.validate.password = false;
      } else {
        this.validate.password = true;
      }
    },
    validateUsername() {
      if (this.signup.username === "") {
        this.validatetext.username = "Please enter Username";
        this.validate.username = false;
      } else if (!/^[a-zA-Z0-9]+$/.test(this.signup.username)) {
        this.validatetext.username = "Only A-Z,a-z and numbers can be entered.";
        this.validate.username = false;
      } else if (this.signup.username.length > 50) {
        this.validatetext.username =
          "Username must not be longer than 50 characters.";
        this.validate.username = false;
      } else {
        this.validate.username = true;
      }
    },
    validateComfirmPass() {
      if (this.comfirmPass === "") {
        this.validatetext.comfirmPass = "Please confirm your password.";
        this.validate.comfirmPass = false;
      } else if (this.comfirmPass !== this.signup.password) {
        this.validatetext.comfirmPass = "Password does not match";
        this.validate.comfirmPass = false;
      } else {
        this.validate.comfirmPass = true;
      }
    },
    validateDateOfBirth() {
      if (this.signup.date_of_birth === "") {
        this.validatetext.date_of_birth = "Please enter your date of birth";
        this.validate.date_of_birth = false;
      } else if (
        +new Date(this.signup.date_of_birth) > +new Date(this.currentDate())
      ) {
        this.validatetext.date_of_birth =
          "The value must be less than the current date.";
        this.validate.date_of_birth = false;
      } else {
        this.validate.date_of_birth = true;
      }
    },
    validateGender() {
      if (this.signup.gender === "") {
        this.validatetext.gender = "Please select gender";
        this.validate.gender = false;
      } else {
        this.validate.gender = true;
      }
    },
    validateFrom() {
      this.validateEmail();
      this.validatePass();
      this.validateUsername();
      this.validateComfirmPass();
      this.validateDateOfBirth();
      this.validateGender();

      this.validate.from = true;
      Object.values(this.validate).forEach((v) => {
        this.validate.from = v && this.validate.from;
      });
    },
    async submitFrom() {
      const loading = this.$vs.loading();
      this.validateFrom();
      if (this.validate.from) {
        try {
          await this.$store.dispatch("signup", this.signup);
          this.$router.push("/sendmail");
        } catch (err) {
          console.log(err);
          const error = err.response?.data?.statusCode;
          let title;

          if (error == statusCode(2001)) {
            title = "Username Already exists";
          } else if (error == statusCode(2002)) {
            title = "Email Already exists.";
          } else {
            title = "Sign Up failed, please try again.";
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
      loading.close();
    },
  },
  watch: {
    "signup.email": function () {
      this.validateEmail();
    },
    "signup.password": function () {
      this.validatePass();
      if (this.comfirmPass !== "") {
        this.validateComfirmPass();
      }
    },
    "signup.username": function () {
      this.validateUsername();
    },
    comfirmPass: function () {
      this.validateComfirmPass();
    },
    "signup.date_of_birth": function () {
      this.validateDateOfBirth();
    },
    "signup.gender": function () {
      this.validateGender();
    },
  },
};
</script>
<style lang="css">
.input-signup .vs-input {
  width: 100% !important;
  border: 1px solid #eeeeee !important;
  border-radius: 8px !important;
}
.input-signup .vs-select__input {
  width: 100% !important;
  border: 1px solid #eeeeee !important;
  border-radius: 8px !important;
  background: white;
}
.input-signup.vs-select-content {
  max-width: 100%;
  filter: drop-shadow(0 1px 10px rgb(0 0 0 / 0.05));
}
.input-signup .vs-input__label--label {
  font-size: 1rem;
  font-weight: 600;
}
.input-signup .vs-select__label--label {
  margin-left: 8px;
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: 600;
}
.input-signup .vs-input__label {
  font-size: 1rem;
}
.input-signup .vs-select__label {
  font-size: 1rem;
}
.button-signup {
  margin: 0 !important;
  font-size: 1.125rem;
}
</style>
