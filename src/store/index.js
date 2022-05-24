import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { baseUrl } from "../util/backend.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    account: null,
    jwt: "",
  },
  mutations: {
    setAccount(state, payload) {
      state.account = payload.account;
      state.jwt = payload.jwt;
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
        commit("setAccount", response.data);
      }
      return response;
    },
  },
  modules: {},
});
