import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";
import Vuesax from "vuesax";
import "boxicons/css/boxicons.min.css";
import "vuesax/dist/vuesax.css";
import { io } from "socket.io-client";
// import { baseUrl } from "./util/backend.js";

Vue.config.productionTip = false;
Vue.use(Vuesax, {
  colors: {
    primary: "#5CB5E8",
  },
});

new Vue({
  router,
  store,
  render: (h) => h(App),
  data() {
    return {
      socket: io("https://jaid.onthewifi.com/"),
    };
  },
}).$mount("#app");
