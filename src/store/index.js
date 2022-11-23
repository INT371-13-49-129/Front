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
    allPostArticle: [],
    allPostArticleRecommend: [],
    allMyPost: [],
    allTag: [],
    allTopic: [],
    allMessageConnect: [],
    allAccount: [],
    allAccountPsychologist: [],
    allAccountIsListener: [],
    messageConnect: {},
    currentPage: "",
    postView: null,
    allMood: [],
  },
  getters: {
    getSendMail: (state) => state.sendMail,
    isLogin: (state) => state.isLogin,
    getAccount: (state) => state.account,
    getAllPost: (state) => state.allPost,
    getAllPostArticle: (state) => state.allPostArticle,
    getAllPostArticleRecommend: (state) => state.allPostArticleRecommend,
    getAllMyPost: (state) => state.allMyPost,
    getAllTag: (state) => state.allTag,
    getAllTopic: (state) => state.allTopic,
    getAllMessageConnect: (state) => state.allMessageConnect,
    getAllAccount: (state) => state.allAccount,
    getAllAccountPsychologist: (state) => state.allAccountPsychologist,
    getAllAccountIsListener: (state) => state.allAccountIsListener,
    getMessageConnect: (state) => state.messageConnect,
    getCurrentPage: (state) => state.currentPage,
    getPostView: (state) => state.postView,
    getAllMood: (state) => state.allMood,
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
    setAllPostArticle(state, payload) {
      state.allPostArticle = payload;
    },
    setAllPostArticleRecommend(state, payload) {
      state.allPostArticleRecommend = payload;
    },
    setAllMyPost(state, payload) {
      state.allMyPost = payload;
    },
    setAllTag(state, payload) {
      state.allTag = payload;
    },
    setAllTopic(state, payload) {
      state.allTopic = payload;
    },
    setAllMessageConnect(state, payload) {
      state.allMessageConnect = payload;
    },
    setAllAccount(state, payload) {
      state.allAccount = payload;
    },
    setAllAccountPsychologist(state, payload) {
      state.allAccountPsychologist = payload;
    },
    setAllAccountIsListener(state, payload) {
      state.allAccountIsListener = payload;
    },
    setMessageConnect(state, payload) {
      state.messageConnect = payload;
    },
    setCurrentPage(state, payload) {
      state.currentPage = payload;
    },
    setPostView(state, payload) {
      state.postView = payload;
    },
    setAllMood(state, payload) {
      state.allMood = payload;
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
    async confirmEmail(_, payload) {
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
    async getAccountById(_, payload) {
      let response = await axios.get(
        `${baseUrl()}/api/member/account/${payload}`,
        authHeader()
      );
      return response;
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
        `${baseUrl()}/api/member/getPost/${payload.post_id}${
          payload.count_read ? "?count_read=true" : ""
        }`,
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
          refer_post: response.data.post.refer_post
            ? {
                tags_feeling: response.data.post.refer_post.post_tags.filter(
                  (t) => t.tag.tag_type === "Feeling"
                ),
                tags_category: response.data.post.refer_post.post_tags.filter(
                  (t) => t.tag.tag_type === "Category"
                ),
                ...response.data.post.refer_post,
              }
            : null,
        };
        if (
          state.currentPage == "PostView" ||
          state.currentPage == "EditArticle"
        ) {
          commit("setPostView", post);
        } else {
          let set = "setAllPost";
          let all = "allPost";
          if (
            state.currentPage == "Home" ||
            state.currentPage == "ProfileView"
          ) {
            set = "setAllPost";
            all = "allPost";
          } else if (state.currentPage == "MyProfile") {
            set = "setAllMyPost";
            all = "allMyPost";
          }
          commit(
            set,
            state[all].map((p) => (p.post_id == post.post_id ? post : p))
          );
        }
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
              refer_post: post.refer_post
                ? {
                    tags_feeling: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Feeling"
                    ),
                    tags_category: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Category"
                    ),
                    ...post.refer_post,
                  }
                : null,
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
    async getAllPostPagination({ commit, state }, payload) {
      let { limit = 5, page = 1 } = payload;
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllPostPage?page=${page}&limit=${limit}`,
        authHeader()
      );
      if (response.status == 200) {
        const allPost = response.data.posts.rows
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
              refer_post: post.refer_post
                ? {
                    tags_feeling: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Feeling"
                    ),
                    tags_category: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Category"
                    ),
                    ...post.refer_post,
                  }
                : null,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        commit(
          "setAllPost",
          page == 1 ? allPost : state.allPost.concat(allPost)
        );
      }
      return response;
    },
    async getAllPostSearchTagPagination({ commit, state }, payload) {
      let {
        limit = 5,
        page = 1,
        tag_id = "",
        search = "",
        follow = false,
      } = payload;
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllPostSearchTagPage?page=${page}&limit=${limit}&tag_id=${tag_id}&search=${search}&follow=${follow}`,
        authHeader()
      );
      if (response.status == 200) {
        const allPost = response.data.posts.rows
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
              refer_post: post.refer_post
                ? {
                    tags_feeling: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Feeling"
                    ),
                    tags_category: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Category"
                    ),
                    ...post.refer_post,
                  }
                : null,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        commit(
          "setAllPost",
          page == 1 ? allPost : state.allPost.concat(allPost)
        );
      }
      return response;
    },
    async getAllPostArticlePagination({ commit, state }, payload) {
      let { limit = 5, page = 1, replace = false } = payload;
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllPostPage?page=${page}&limit=${limit}&post_type=Article`,
        authHeader()
      );
      if (response.status == 200) {
        const allPostArticle = response.data.posts.rows
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
              refer_post: post.refer_post
                ? {
                    tags_feeling: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Feeling"
                    ),
                    tags_category: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Category"
                    ),
                    ...post.refer_post,
                  }
                : null,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        if (replace) {
          commit("setAllPostArticle", allPostArticle);
        } else {
          commit(
            "setAllPostArticle",
            page == 1
              ? allPostArticle
              : state.allPostArticle.concat(allPostArticle)
          );
        }
      }
      return response;
    },
    async getAllPostArticleSearchTagPagination({ commit, state }, payload) {
      let {
        limit = 5,
        page = 1,
        replace = false,
        tag_id = "",
        search = "",
        follow = false,
      } = payload;
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllPostSearchTagPage?page=${page}&limit=${limit}&post_type=Article&tag_id=${tag_id}&search=${search}&follow=${follow}`,
        authHeader()
      );
      if (response.status == 200) {
        const allPostArticle = response.data.posts.rows
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
              refer_post: post.refer_post
                ? {
                    tags_feeling: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Feeling"
                    ),
                    tags_category: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Category"
                    ),
                    ...post.refer_post,
                  }
                : null,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        if (replace) {
          commit("setAllPostArticle", allPostArticle);
        } else {
          commit(
            "setAllPostArticle",
            page == 1
              ? allPostArticle
              : state.allPostArticle.concat(allPostArticle)
          );
        }
      }
      return response;
    },
    async getAllPostArticleRecommendPagination({ commit }, payload) {
      let { limit = 5, page = 1 } = payload;
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllPostPage?page=${page}&limit=${limit}&post_type=Article&order_count_read=true`,
        authHeader()
      );
      if (response.status == 200) {
        const allPostArticleRecommend = response.data.posts.rows.map((post) => {
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
            refer_post: post.refer_post
              ? {
                  tags_feeling: post.refer_post.post_tags.filter(
                    (t) => t.tag.tag_type === "Feeling"
                  ),
                  tags_category: post.refer_post.post_tags.filter(
                    (t) => t.tag.tag_type === "Category"
                  ),
                  ...post.refer_post,
                }
              : null,
          };
        });
        commit("setAllPostArticleRecommend", allPostArticleRecommend);
      }
      return response;
    },
    async getAllPostAccountPagination({ commit, state }, payload) {
      let { limit = 5, page = 1, account_id, post_type = "Post" } = payload;
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllPostAccountPage/${account_id}?page=${page}&limit=${limit}&post_type=${post_type}`,
        authHeader()
      );
      if (response.status == 200) {
        const allPost = response.data.posts.rows
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
              refer_post: post.refer_post
                ? {
                    tags_feeling: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Feeling"
                    ),
                    tags_category: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Category"
                    ),
                    ...post.refer_post,
                  }
                : null,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        commit(
          "setAllPost",
          page == 1 ? allPost : state.allPost.concat(allPost)
        );
      }
      return response;
    },
    async getAllMyPost({ commit, dispatch }) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllMyPost`,
        authHeader()
      );
      if (response.status == 200) {
        const allMyPost = response.data.posts
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
              refer_post: post.refer_post
                ? {
                    tags_feeling: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Feeling"
                    ),
                    tags_category: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Category"
                    ),
                    ...post.refer_post,
                  }
                : null,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        dispatch("getAccount");
        commit("setAllMyPost", allMyPost);
      }
      return response;
    },
    async getAllMyPostPagination({ commit, dispatch, state }, payload) {
      let { limit = 5, page = 1, post_type = "Post" } = payload;
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllMyPostPage?page=${page}&limit=${limit}&post_type=${post_type}`,
        authHeader()
      );
      if (response.status == 200) {
        const allMyPost = response.data.posts.rows
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
              refer_post: post.refer_post
                ? {
                    tags_feeling: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Feeling"
                    ),
                    tags_category: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Category"
                    ),
                    ...post.refer_post,
                  }
                : null,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        dispatch("getAccount");
        commit(
          "setAllMyPost",
          page == 1 ? allMyPost : state.allMyPost.concat(allMyPost)
        );
      }
      return response;
    },
    async getAllRepost(_, payload) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllRepost/${payload}`,
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
              refer_post: post.refer_post
                ? {
                    tags_feeling: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Feeling"
                    ),
                    tags_category: post.refer_post.post_tags.filter(
                      (t) => t.tag.tag_type === "Category"
                    ),
                    ...post.refer_post,
                  }
                : null,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        return allPost;
      }
      return response;
    },
    async updateEmotion(_, payload) {
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
    async createComment(_, payload) {
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
    async getAllTopic({ commit }) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllTopic`,
        authHeader()
      );
      commit("setAllTopic", response.data.topics);
      return response;
    },
    async createPost(_, payload) {
      let response = await axios.post(
        `${baseUrl()}/api/member/createPost`,
        {
          text: payload.text,
          post_tags: payload.post_tags,
          refer_post_id: payload.refer_post_id,
          img: payload.img,
          publish_status: payload.publish_status,
        },
        authHeader()
      );
      return response;
    },

    async createPostArticle(_, payload) {
      let response = await axios.post(
        `${baseUrl()}/api/member/createPostArticle`,
        {
          text: payload.text,
          tag_id: payload.tag_id,
          cover_image_url: payload.cover_image_url,
          img: payload.img,
          owner: payload.owner,
          title: payload.title,
        },
        authHeader()
      );
      return response;
    },
    async updatePost(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/member/updatePost`,
        {
          text: payload.text,
          post_tags: payload.post_tags,
          post_id: payload.post_id,
          img: payload.img,
          publish_status: payload.publish_status,
        },
        authHeader()
      );
      return response;
    },
    async updatePostArticle(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/member/updatePostArticle`,
        {
          post_id: payload.post_id,
          text: payload.text,
          tag_id: payload.tag_id,
          cover_image_url: payload.cover_image_url,
          img: payload.img,
          owner: payload.owner,
          title: payload.title,
        },
        authHeader()
      );
      return response;
    },
    async deletePost(_, post_id) {
      let response = await axios.delete(
        `${baseUrl()}/api/member/deletePost/${post_id}`,
        authHeader()
      );
      return response;
    },
    async updateComment(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/member/updateComment`,
        {
          text: payload.text,
          comment_id: payload.comment_id,
        },
        authHeader()
      );
      return response;
    },
    async deleteComment(_, comment_id) {
      let response = await axios.delete(
        `${baseUrl()}/api/member/deleteComment/${comment_id}`,
        authHeader()
      );
      return response;
    },
    async getAllMessageConnect({ commit }) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllMessageConnect`,
        authHeader()
      );
      const messageConnects = response.data.messageConnects.sort(
        (a, b) =>
          new Date(b.last_messages).getTime() -
          new Date(a.last_messages).getTime()
      );
      commit("setAllMessageConnect", messageConnects);
      return response;
    },
    async getAllAccount({ commit }) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllAccount`,
        authHeader()
      );
      commit("setAllAccount", response.data.accounts);
      return response;
    },
    async getAllAccountPsychologistPagination({ commit }, payload) {
      let { limit = 10, page = 1 } = payload;
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllAccountPsychologistPagination?page=${page}&limit=${limit}`,
        authHeader()
      );
      commit("setAllAccountPsychologist", response.data);
      return response;
    },
    async getAllAccountIsListenerPagination({ commit }, payload) {
      let { limit = 10, page = 1 } = payload;
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllAccountIsListenerPagination?page=${page}&limit=${limit}`,
        authHeader()
      );
      commit("setAllAccountIsListener", response.data);
      return response;
    },
    async getMessageConnect({ commit }, payload) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getMessageConnect/${payload}`,
        authHeader()
      );
      const messageConnect = response.data.messageConnect.messages.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      response.data.messageConnect.messages = messageConnect;
      commit("setMessageConnect", response.data.messageConnect);
      return response;
    },
    async getMessageConnectPagination({ commit, state }, payload) {
      let { account_id, limit = 20, page = 1 } = payload;
      let response = await axios.get(
        `${baseUrl()}/api/member/getMessageConnectPage/${account_id}?page=${page}&limit=${limit}`,
        authHeader()
      );
      const messageConnect = response.data.messageConnect.messages;
      response.data.messageConnect.messages =
        page == 1
          ? messageConnect
          : state.messageConnect.messages.concat(messageConnect);
      commit("setMessageConnect", response.data.messageConnect);
      return messageConnect;
    },
    async readMessage(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/member/readMessage`,
        {
          message_id: payload.message_id,
        },
        authHeader()
      );
      return response;
    },
    async createMessage(_, payload) {
      let response = await axios.post(
        `${baseUrl()}/api/member/createMessage`,
        {
          account_id_2: payload.account_id_2,
          text: payload.text,
          message_connect_id: payload.message_connect_id,
          image_url: payload.image_url,
        },
        authHeader()
      );
      return response;
    },
    async updateAccountProfile(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/member/updateAccountProfile`,
        {
          username: payload.username,
          name: payload.name,
          description: payload.description,
          gender: payload.gender,
          bio: payload.bio,
          date_of_birth: payload.date_of_birth,
          image_url: payload.image_url,
          cover_image_url: payload.cover_image_url,
          is_listener: payload.is_listener,
          account_topics: payload.account_topics,
        },
        authHeader()
      );
      return response;
    },
    async updateAccountListener(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/member/updateAccountListener`,
        {
          is_listener: payload.is_listener,
        },
        authHeader()
      );
      return response;
    },
    async getAllMood({ commit }) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getAllMood`,
        authHeader()
      );
      commit("setAllMood", response.data.moods);
      return response;
    },
    async getMoodDiaryDate(_, payload) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getMoodDiaryDate/${payload}`,
        authHeader()
      );
      return response;
    },
    async getMoodDiaryMonth(_, payload) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getMoodDiaryMonth/${payload}`,
        authHeader()
      );
      return response;
    },
    async getMoodDiaryYear(_, payload) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getMoodDiaryYear/${payload}`,
        authHeader()
      );
      return response;
    },
    async getDiaryMonth(_, payload) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getDiaryMonth/${payload}`,
        authHeader()
      );
      return response;
    },
    async getDiaryDate(_, payload) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getDiaryDate/${payload}`,
        authHeader()
      );
      return response;
    },
    async updateMoodDiary(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/member/updateMoodDiary`,
        {
          date: payload.date,
          mood_id: payload.mood_id,
        },
        authHeader()
      );
      return response;
    },
    async createDiary(_, payload) {
      let response = await axios.post(
        `${baseUrl()}/api/member/createDiary`,
        {
          title: payload.title,
          text: payload.text,
          date: payload.date,
        },
        authHeader()
      );
      return response;
    },
    async deleteDiary(_, diary_id) {
      let response = await axios.delete(
        `${baseUrl()}/api/member/deleteDiary/${diary_id}`,
        authHeader()
      );
      return response;
    },
    async updateDiary(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/member/updateDiary`,
        {
          diary_id: payload.diary_id,
          title: payload.title,
          text: payload.text,
        },
        authHeader()
      );
      return response;
    },
    async createFollow(_, payload) {
      let response = await axios.post(
        `${baseUrl()}/api/member/createFollow`,
        {
          follow_account_id: payload,
        },
        authHeader()
      );
      return response;
    },
    async deleteFollow(_, payload) {
      let response = await axios.delete(
        `${baseUrl()}/api/member/deleteFollow/${payload}`,
        authHeader()
      );
      return response;
    },
    async getFollowByAccountId(_, payload) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getFollowByAccountId/${payload}`,
        authHeader()
      );
      return response;
    },
    async createRating(_, payload) {
      let response = await axios.post(
        `${baseUrl()}/api/member/createRating`,
        {
          review: payload.review,
          rating_account_id: payload.rating_account_id,
          rating_score: payload.rating_score,
        },
        authHeader()
      );
      return response;
    },
    async getRatingByAccountId(_, payload) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getRatingByAccountId/${payload}`,
        authHeader()
      );
      return response;
    },
    async requestPsychologist(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/member/requestPsychologist`,
        {
          name: payload.name,
          description: payload.description,
          file_approve: payload.file_approve,
        },
        authHeader()
      );
      return response;
    },
    async createRequest(_, payload) {
      let response = await axios.post(
        `${baseUrl()}/api/member/createRequest`,
        {
          text: payload.text,
          message_connect_id: payload.message_connect_id,
        },
        authHeader()
      );
      return response;
    },
    async getRequest(_, payload) {
      let response = await axios.get(
        `${baseUrl()}/api/member/getRequest/${payload}`,
        authHeader()
      );
      return response;
    },
    async acceptRequest(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/member/acceptRequest`,
        {
          message_connect_id: payload.message_connect_id,
        },
        authHeader()
      );
      return response;
    },
    async rejectRequest(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/member/rejectRequest`,
        {
          message_connect_id: payload.message_connect_id,
        },
        authHeader()
      );
      return response;
    },
    async activateMessageConnect(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/member/activateMessageConnect`,
        {
          message_connect_id: payload.message_connect_id,
        },
        authHeader()
      );
      return response;
    },
    async deactivateMessageConnect(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/member/deactivateMessageConnect`,
        {
          message_connect_id: payload.message_connect_id,
        },
        authHeader()
      );
      return response;
    },
    createReport(_, payload) {
      const {
        message,
        account_id = null,
        post_id = null,
        comment_id = null,
      } = payload;
      let response = axios.post(
        `${baseUrl()}/api/member/createReport`,
        {
          message,
          account_id,
          post_id,
          comment_id,
        },
        authHeader()
      );
      return response;
    },
    async uploadFile(_, payload) {
      let data = new FormData();
      data.append("img", payload);
      const response = await axios.post(
        `${baseUrl()}/api/member/uploadFile`,
        data,
        authHeader()
      );
      return response;
    },
    async getAllAccountRequestPsychologist() {
      let response = await axios.get(
        `${baseUrl()}/api/admin/getAllAccountRequestPsychologist`,
        authHeader()
      );
      return response.data.data;
    },
    async approveRequestPsychologist(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/admin/approveRequestPsychologist`,
        {
          account_id: payload,
        },
        authHeader()
      );
      return response;
    },
    async rejectRequestPsychologist(_, payload) {
      let response = await axios.put(
        `${baseUrl()}/api/admin/rejectRequestPsychologist`,
        {
          account_id: payload,
        },
        authHeader()
      );
      return response;
    },
  },
  modules: {},
});
