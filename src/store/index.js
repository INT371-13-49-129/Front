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
    allPost: [],
    allTag: [],
  },
  getters: {
    getSendMail: (state) => state.sendMail,
    isLogin: (state) => state.isLogin,
    getAccount: (state) => state.account,
    getAllPost: (state) => state.allPost,
    getAllTag: (state) => state.allTag,
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
    setAllPost(state, payload) {
      state.allPost = payload;
    },
    setAllTag(state, payload) {
      state.allTag = payload;
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
    async getPost({ commit, state }, payload) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getPost/${payload.post_id}`,
        authHeader()
      );
      if (response.status == 200) {
        const post = {
          count_posts: response.data.post.posts.length,
          count_emotions: response.data.post.emotions.length,
          count_comments: response.data.post.comments.reduce(
            (p, v) => p + v.comments.length + 1,
            0
          ),
          tags_feeling: response.data.post.post_tags.filter(
            (t) => t.tag.tag_type === "Feeling"
          ),
          tags_category: response.data.post.post_tags.filter(
            (t) => t.tag.tag_type === "Category"
          ),
          ...response.data.post,
        };
        commit(
          "setAllPost",
          state.allPost.map((p) => (p.post_id == post.post_id ? post : p))
        );
      }
      return response;
    },
    async getAllPost({ commit }) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllPost`,
        authHeader()
      );
      if (response.status == 200) {
        const allPost = response.data.posts
          .map((post) => {
            return {
              count_posts: post.posts.length,
              count_emotions: post.emotions.length,
              count_comments: post.comments.reduce(
                (p, v) => p + v.comments.length + 1,
                0
              ),
              tags_feeling: post.post_tags.filter(
                (t) => t.tag.tag_type === "Feeling"
              ),
              tags_category: post.post_tags.filter(
                (t) => t.tag.tag_type === "Category"
              ),
              ...post,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        commit("setAllPost", allPost);
      }
      return response;
    },
    async updateEmotion({ state }, payload) {
      console.log(state);
      let response = await axios.put(
        `${baseUrl()}/api/member/updateEmotion`,
        {
          post_id: payload.post_id,
          comment_id: payload.comment_id,
          is_emotion: payload.is_emotion,
        },
        authHeader()
      );
      return response;
    },
    async createComment({ state }, payload) {
      console.log(state);
      let response = await axios.post(
        `${baseUrl()}/api/member/createComment`,
        {
          post_id: payload.post_id,
          text: payload.text,
          reply_comment_id: payload.reply_comment_id,
        },
        authHeader()
      );
      return response;
    },
    async getAllTag({ commit }) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllTag`,
        authHeader()
      );
      commit("setAllTag", response.data.tags);
      return response;
    },
    async createPost({ state }, payload) {
      console.log(state);
      let response = await axios.post(
        `${baseUrl()}/api/member/createPost`,
        {
          text: payload.text,
          post_tags: payload.post_tags,
          refer_post_id: payload.refer_post_id,
        },
        authHeader()
      );
      return response;
    },
  },
  modules: {},
});
