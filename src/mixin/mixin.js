import { baseUrl } from "../util/backend.js";

export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    timeSince(date) {
      let seconds = Math.floor((new Date() - new Date(date)) / 1000);

      let interval = seconds / 31536000;

      if (interval > 1) {
        return Math.floor(interval) + " years";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " months";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " days";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " hours";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes";
      }
      return Math.floor(seconds) + " seconds";
    },
    fullTime(date) {
      const d = new Date(date);
      return d.toLocaleString();
    },
    getTime(date) {
      const d = new Date(date);
      const hours = this.format_two_digits(d.getHours());
      const minutes = this.format_two_digits(d.getMinutes());
      return hours + ":" + minutes;
    },
    format_two_digits(n) {
      return n < 10 ? "0" + n : n;
    },
    getDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString();
    },
    getFile(file_id) {
      return `${baseUrl()}/api/member/getFile/${file_id}`;
    },
    getName(account) {
      return account.role == "Psychologist"
        ? account.name + " 💙"
        : account.username;
    },
  },
};
