<template>
  <div class="w-full h-full overflow-y-auto">
    <NavbarSidebar></NavbarSidebar>
    <div class="pt-16 w-full h-full flex justify-center gap-8">
      <div
        class="xl:block hidden filter xl:drop-shadow-all w-1/4 mt-3 xl:h-95/100 bg-white rounded-2xl p-4 overflow-y-auto"
      >
        <MessageConnect></MessageConnect>
      </div>
      <div
        class="flex flex-col filter xl:drop-shadow-all xl:w-3/5 w-full xl:mt-3 xl:h-95/100 bg-white rounded-2xl p-4 overflow-y-auto"
      >
        <div class="flex items-center">
          <vs-avatar circle>
            <i class="bx bx-user"></i>
          </vs-avatar>
          <div class="text-xl font-semibold ml-4 flex-grow">Name</div>
          <div><i class="bx bx-info-circle text-3xl"></i></div>
        </div>
        <div class="flex-grow w-full flex flex-col-reverse overflow-y-auto">
          <div
            v-for="(message, i) in messageCon.messages"
            :key="message.message_id"
          >
            <div class="flex justify-center items-center">
              <div
                class="text-gray-400 text-sm mt-2"
                v-if="
                  !sameDay(
                    message.createdAt,
                    messageCon.messages[i + 1]
                      ? messageCon.messages[i + 1].createdAt
                      : messageCon.createdAt
                  )
                "
              >
                {{ getDate(message.createdAt) }}
              </div>
            </div>
            <div
              :class="
                message.account_id != account.account_id
                  ? 'flex flex-row'
                  : 'flex flex-row-reverse'
              "
            >
              <div
                class="p-2 bg-gray-100 rounded-2xl my-2 break-words"
                style="max-width: 80%"
                :class="
                  message.account_id != account.account_id
                    ? 'rounded-bl-none'
                    : 'rounded-br-none'
                "
              >
                {{ message.text }}
              </div>
              <div
                class="w-1/5 text-xs text-gray-400 my-2 flex items-end px-1"
                :class="
                  message.account_id != account.account_id ? '' : 'justify-end'
                "
              >
                {{ getTime(message.createdAt) }}
              </div>
            </div>
          </div>
          <div class="flex justify-center items-center gap-2">
            <div class="flex-grow border-b-2"></div>
            <div class="text-gray-400">
              {{ fullTime(messageCon.createdAt) }} เริ่มการสนทนา
            </div>
            <div class="flex-grow border-b-2"></div>
          </div>
        </div>
        <div class="flex items-center w-full">
          <i class="bx bx-image text-4xl text-primary"></i>
          <vs-input
            type="text"
            v-model.trim="text"
            @keyup.enter="text == '' ? '' : createMessage()"
            placeholder="Aa..."
            class="input-comment flex-grow mx-4"
          />
          <vs-button
            @click="text == '' ? '' : createMessage()"
            circle
            size="large"
            ><span class="xl:mx-2 mx-1 xl:text-base text-sm"
              >Send</span
            ></vs-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import mixin from "@/mixin/mixin.js";
import NavbarSidebar from "@/components/NavbarSidebar.vue";
import MessageConnect from "@/components/MessageConnect.vue";

export default {
  mixins: [mixin],
  data() {
    return {
      account_id: this.$route.params.account_id,
      text: "",
    };
  },
  components: {
    NavbarSidebar,
    MessageConnect,
  },
  methods: {
    async getData() {
      if (this.account.account_id == this.account_id) {
        return this.$router.push("/messages");
      }
      try {
        await this.$store.dispatch("getMessageConnect", this.account_id);
        const messages = this.messageCon.messages;
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          if (message.is_read) break;
          if (message.account_id == this.account_id) {
            await this.$store.dispatch("readMessage", {
              message_id: message.message_id,
            });
          }
        }
      } catch (error) {
        return this.$router.push("/messages");
      }
    },
    async createMessage() {
      await this.$store.dispatch("createMessage", {
        account_id_2: this.account_id,
        text: this.text,
        message_connect_id: this.messageCon.message_connect_id,
      });
      await this.getData();
      this.text = "";
    },
    sameDay(d1, d2) {
      const date1 = new Date(d1);
      const date2 = new Date(d2);
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    },
  },
  async mounted() {
    const loading = this.$vs.loading();
    this.account_id = this.$route.params.account_id;
    await this.getData();
    loading.close();

    let vm = this;
    this.$root.socket.on(
      "message_connect_id_" + this.messageCon.message_connect_id,
      function (message_connect_id) {
        if (message_connect_id == vm.messageCon.message_connect_id) {
          vm.getData();
        }
      }
    );
  },
  computed: {
    ...mapGetters({
      isLogin: "isLogin",
      account: "getAccount",
      messageCon: "getMessageConnect",
    }),
  },
  watch: {
    "$route.params.account_id": async function () {
      this.account_id = this.$route.params.account_id;
      await this.getData();
    },
  },
};
</script>
<style lang="css">
.input-comment .vs-input {
  width: 100% !important;
  border-radius: 9999px !important;
}
</style>
