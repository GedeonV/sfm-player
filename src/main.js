import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import AudioVisual from "vue-audio-visual";

Vue.use(AudioVisual);

Vue.config.productionTip = false;

window.axios = axios.create({
  baseURL: "https://sfm-project.herokuapp.com/",
  params: {
    token: false,
  },
  headers: {
    //Authorization: ""
  },
});

new Vue({
  router,
  store,
  render: function(h) {
    return h(App);
  },
  beforeCreate() {
    window.axios.interceptors.request.use(
      (config) => {
        if (this.$store.state.user_token) {
          config.headers["Authorization"] =
            "Bearer " + this.$store.state.user_token;
        }
        return config;
      },
      (error) => {
        return console.log(error);
      }
    );
  },
}).$mount("#app");
