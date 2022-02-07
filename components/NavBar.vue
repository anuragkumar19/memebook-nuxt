<template>
  <div>
    <v-app-bar color="secondary" dense dark flat>
      <v-toolbar-title class="logo-text">Memebook</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search modal -->
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-text>
              <v-container>
                <v-text-field
                  v-model="q"
                  solo
                  label="Search Users..."
                  @input="search"
                  clearable
                ></v-text-field>
                <v-list>
                  <template v-for="(user, index) in users">
                    <v-list-item
                      nuxt
                      :to="`/user/${user.username}`"
                      :key="index"
                      @click="dialog = false"
                    >
                      <v-list-item-avatar>
                        <v-img :src="user.avatar"></v-img>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title>{{
                          user.username
                        }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          user.name
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list>
                <div class="text-center" v-if="loading">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </div>
                <div class="text-center">
                  <v-btn
                    text
                    color="primary"
                    :loading="loading"
                    v-if="!enough"
                    @click="loadMore"
                    class="mt-3"
                  >
                    Load More
                  </v-btn>
                </div>
                <h1
                  v-if="!loading && users.length == 0"
                  class="text-center py-4"
                >
                  {{ q ? "No Users Found" : "Search for Users" }}
                </h1>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- /Search modal -->

      <v-btn icon nuxt to="/">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon nuxt to="/create/post">
        <v-icon>mdi-plus-box</v-icon>
      </v-btn>
      <v-btn icon nuxt to="/notifications">
        <v-badge :content="count" :value="count" color="pink" overlap>
          <v-icon> mdi-heart </v-icon>
        </v-badge>
      </v-btn>
      <v-btn icon @click="dialog = true">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-avatar size="30">
              <img :src="$auth.user.avatar" alt="" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>{{ $auth.user.username }}</v-list-item-title>
          </v-list-item>
          <v-list-item nuxt :to="`/user/${$auth.user.username}`">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item nuxt to="/accounts/saved">
            <v-list-item-title>Saved</v-list-item-title>
          </v-list-item>
          <v-list-item nuxt @click="() => $auth.logout()">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
      q: "",
      loading: false,
      users: [],
      controller: null,
      limit: 10,
      page: 1,
      enough: true,
      count: 0,
    };
  },
  async fetch() {
    this.count = (await this.$axios.$get(`/notification/unseen`)).count;
  },
  methods: {
    async search() {
      try {
        if (this.controller) {
          this.controller.abort();
        } else {
          this.controller = new AbortController();
        }
        if (!this.q.trim()) {
          this.users = [];
          this.enough = true;
          return;
        }
        this.loading = true;
        const response = await this.$axios.$get(
          `/user/search?q=${this.q}&limit-${this.limit}&page=${this.page}`,
          {
            signal: this.controller?.signal,
          }
        );

        this.users = response.users;
        this.enough = this.users.length < this.limit;
      } catch (error) {
        return;
      } finally {
        this.loading = false;
      }
    },
    async loadMore() {
      if (this.loading) return;
      this.loading = true;
      this.page = this.page + 1;

      try {
        const res = await this.$axios.$get(
          `/user/search?q=${this.q}&limit-${this.limit}&page=${this.page}`,
          {
            signal: this.controller?.signal,
          }
        );

        this.users = this.users.concat(res.users);
        this.enough = res.users.length < this.limit;
      } catch (err) {
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
.logo-text {
  font-family: cursive;
  font-weight: 800;
}
</style>
