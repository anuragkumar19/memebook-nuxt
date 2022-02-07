<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-subheader>
          <v-icon>mdi-bell</v-icon>
          <span>Subscriptions</span>
          <v-spacer></v-spacer>
          <v-btn :loading="loading" color="primary" @click="subscribe"
            >Subscribe</v-btn
          >
        </v-subheader>
        <v-list>
          <div class="text-center" v-if="$fetchState.pending">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <v-list-item
            v-for="subscription in subscriptions"
            :key="subscription._id"
          >
            <v-list-item-title>
              {{ subscription.identifier }}
            </v-list-item-title>
            <v-list-item-action>
              <v-btn icon @click="unsubscribe(subscription)" :loading="loading">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <h3 v-if="!$fetchState.pending && subscriptions.length == 0">
            No Subscriptions Yet
          </h3>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "PushPage",
  head: {
    title: "Push Notifications",
  },
  data() {
    return {
      subscriptions: [],
      loading: false,
    };
  },
  async fetch() {
    const res = await this.$axios.$get("/push");
    this.subscriptions = res.subscriptions;
  },
  methods: {
    async subscribe() {
      function urlBase64ToUint8Array(base64String) {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, "+")
          .replace(/_/g, "/");

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }

      function getIdentifier() {
        const indentifier = prompt(
          "Enter your indentifier for this subscription (i.e: SAMSUNG-GALAXY-S8, MACBOOK-PRO, etc)"
        );

        if (!indentifier) {
          alert("You must enter an indentifier");
        } else {
          return indentifier;
        }
      }

      const publicVapidKey =
        "BNybJb1w-12RDcPBKKMfPe3JQcL7vlgHBaUqpoOoi-w4G7-_bSyvv8KaGrAQeOpgr2tmfafZ_fRNe3WuVqbBxuM";

      if ("serviceWorker" in navigator) {
        const register = await navigator.serviceWorker.register("/push.js", {
          scope: "/",
        });
        const identifier = getIdentifier();

        if (!identifier) {
          return;
        }

        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        this.loading = true;
        await this.$axios.$post("/push/subscribe", {
          subscription,
          identifier,
        });

        const res = await this.$axios.$get("/push");
        this.subscriptions = res.subscriptions;
        this.loading = false;
      } else {
        alert("Service Worker is not supported");
      }
    },
    async unsubscribe(subscription) {
      this.loading = true;
      await this.$axios.$delete(`/push/unsubscribe/${subscription._id}`);
      const res = await this.$axios.$get("/push");
      this.subscriptions = res.subscriptions;
      this.loading = false;
    },
  },
};
</script>
