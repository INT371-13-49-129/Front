import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { baseUrl } from "../util/backend.js";

Vue.use(Vuex);

export function authHeader() {
  const jwt = localStorage.jwt;
  if (jwt) {
    return { headers: { Authorization: "Bearer " + jwt } };
  } else {
    return {};
  }
}

export default new Vuex.Store({
  state: {
    account: null,
    jwt: "",
    sendMail: "",
    isLogin: "",
  },
  getters: {
    getSendMail: (state) => state.sendMail,
    isLogin: (state) => state.isLogin,
  },
  mutations: {
    setAccount(state, payload) {
      state.account = payload;
    },
    setJwt(state, payload) {
      state.jwt = payload;
    },
    setIsLogin(state, payload) {
      state.isLogin = payload;
    },
    setSendMail(state, payload) {
      state.sendMail = payload;
    },
  },
  actions: {
    async login({ commit }, payload) {
      let response = await axios.post(`${baseUrl()}/api/member/loginMember`, {
        email: payload.email,
        password: payload.password,
      });
      if (response.status == 200) {
        localStorage.setItem("jwt", response.data.jwt);
        localStorage.setItem("user_id", response.data.account.account_id);
        commit("setAccount", response.data.account);
        commit("setJwt", response.data.jwt);
        commit("setIsLogin", true);
      }
      return response;
    },
    async signup({ commit }, payload) {
      let response = await axios.post(`${baseUrl()}/api/member/createAccount`, {
        email: payload.email,
        username: payload.username,
        password: payload.password,
        gender: payload.gender,
        date_of_birth: payload.date_of_birth,
      });
      if (response.status == 200) {
        commit("setSendMail", payload.email);
      }
      return response;
    },
    async resendMail({ commit }, payload) {
      let response = await axios.post(`${baseUrl()}/api/member/resendMail`, {
        email: payload,
      });
      if (response.status == 200) {
        commit("setSendMail", payload);
      }
      return response;
    },
    async confirmEmail({ state }, payload) {
      console.log(state);
      let response = await axios.put(`${baseUrl()}/api/member/confirmEmail`, {
        confirm_email_token: payload,
      });
      return response;
    },
    async getAccount({ commit }) {
      try {
        let response = await axios.get(
          `${baseUrl()}/api/member/myAccount`,
          authHeader()
        );
        localStorage.setItem("user_id", response.data.account.account_id);
        commit("setAccount", response.data.account);
        commit("setJwt", localStorage.jwt);
        commit("setIsLogin", true);
        return response;
      } catch (error) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user_id");
        commit("setAccount", null);
        commit("setJwt", "");
        commit("setIsLogin", false);
      }
    },
    async logout({ commit }) {
      let response = await axios.delete(
        `${baseUrl()}/api/member/logoutMember`,
        authHeader()
      );
      localStorage.removeItem("jwt");
      localStorage.removeItem("user_id");
      commit("setAccount", null);
      commit("setJwt", "");
      commit("setIsLogin", false);
      return response;
    },
  },
  modules: {},
});
