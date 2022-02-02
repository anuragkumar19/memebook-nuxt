<template>
  <main>
    <div class="text-center" v-if="$fetchState.pending">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <v-container v-else-if="user">
      <v-row class="px-6 py-6">
        <v-col cols="4" class="text-center">
          <v-img :src="user.avatar" style="border-radius: 50%" />
          <v-btn
            color="secondary"
            icon
            nuxt
            to="/accounts/upload-avatar"
            v-if="$auth.user.username == user.username"
            ><v-icon>mdi-camera</v-icon></v-btn
          >
        </v-col>
        <v-col cols="8">
          <h1 style="font-weight: 300" class="mb-3">
            {{ user.username }}
            <v-btn
              nuxt
              class="ml-3"
              small
              outlined
              to="/accounts/edit"
              v-if="$auth.user.username == user.username"
              >Edit Profile</v-btn
            >
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="ml-3"
                  small
                  icon
                  v-if="$auth.user.username == user.username"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item nuxt to="/accounts/changePassword">
                  <v-list-item-title>Change Password</v-list-item-title>
                </v-list-item>
                <v-list-item
                  href="https://github.com/anuragkumar19/memebook-nuxt/issues"
                  target="_blank"
                >
                  <v-list-item-title>Report a problem</v-list-item-title>
                </v-list-item>
                <v-list-item @click="$auth.logout()">
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <!-- isFollowing: true // means $auth.user.following includes user,
            isFollower: true // means req.user.followers includes user -->
            <v-btn
              small
              color="primary"
              outlined
              v-if="$auth.user.username != user.username && !user.isFollowing"
              @click="follow"
              :loading="submitting"
            >
              {{ user.isFollower ? "Follow Back" : "Follow" }}
            </v-btn>
            <v-menu
              offset-y
              v-if="$auth.user.username != user.username && user.isFollowing"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  :loading="submitting"
                >
                  Following
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="dialog = true">
                  <v-list-item-title>Unfollow</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </h1>
          <h4 class="mb-3 d-none d-md-flex align-center">
            <span>{{ user.postsCount }} Posts</span>
            <v-btn nuxt :to="`/user/${user.username}/followers`" text
              >{{ user.followers }} Followers</v-btn
            >
            <v-btn nuxt :to="`/user/${user.username}/followings`" text
              >{{ user.following }} Following</v-btn
            >
          </h4>
          <h3>
            {{ user.name }}
          </h3>
          <p>{{ user.bio }}</p>
          <a :href="user.website" v-if="user.website">{{ user.website }}</a>
        </v-col>
      </v-row>
      <v-divider class="mt-4" />
      <v-row class="mt-4 d-flex d-md-none text-center">
        <v-col cols="4"> {{ user.postsCount }} Posts </v-col>
        <v-col cols="4">
          <nuxt-link :to="`/user/${user.username}/followers`"
            >{{ user.followers }} Followers</nuxt-link
          >
        </v-col>
        <v-col cols="4">
          <nuxt-link :to="`/user/${user.username}/followings`"
            >{{ user.following }} Following</nuxt-link
          >
        </v-col>
      </v-row>
      <v-divider class="mt-4 d-flex d-md-none" />
      <h2 class="my-3">Posts</h2>
      <Posts :posts="posts" @delete="handleDelete" />
      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="400">
          <v-card>
            <v-card-title class="text-h5">
              Are you sure to unfollow <code>{{ user.username }}</code
              >?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                @click="dialog = false"
                :loading="submitting"
              >
                Cancel
              </v-btn>
              <v-btn
                color="green darken-1"
                text
                @click="unfollow"
                :loading="submitting"
              >
                Yes, Unfollow
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <nuxt-child />
    </v-container>
    <NotFound v-else />
    <div class="text-center">
      <v-btn
        text
        color="primary"
        :loading="loading"
        v-if="!enough"
        @click="getData"
        class="mt-3"
      >
        Load More
      </v-btn>
    </div>
  </main>
</template>

<script>
export default {
  name: "ProfilePage",
  data() {
    return {
      posts: [],
      user: null,
      dialog: false,
      submitting: false,
      limit: 5,
      page: 1,
      enough: false,
      loading: false,
    };
  },
  async fetch() {
    try {
      if (this.$route.params.username == this.$auth.user.username) {
        this.user = this.$auth.user;
      } else {
        const res = await this.$axios.$get(
          `/user/${this.$route.params.username}`
        );

        this.user = res.user;
      }
    } catch (err) {
      return;
    }

    this.posts = (
      await this.$axios.$get(
        `/user/${this.user.username}/posts?limit=${this.limit}&page=${this.page}`
      )
    ).posts;
    this.enough = this.posts.length < this.limit;
  },
  methods: {
    async follow() {
      try {
        this.submitting = true;
        await this.$axios.$post(`/user/${this.user.username}/follow`);
        this.user.isFollowing = true;
        this.user.followers = this.user.followers + 1;
        await this.$auth.fetchUser();
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.submitting = false;
      }
    },
    async unfollow() {
      try {
        this.submitting = true;
        await this.$axios.$post(`/user/${this.user.username}/unfollow`);
        this.user.isFollowing = false;
        this.user.followers = this.user.followers - 1;
        this.dialog = false;
        await this.$auth.fetchUser();
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.submitting = false;
      }
    },
    async getData() {
      if (this.loading) return;
      this.loading = true;
      this.page = this.page + 1;

      try {
        const res = await this.$axios.$get(
          `/user/${this.user.username}/posts?page=${this.page}&limit=${this.limit}`
        );

        this.posts = this.posts.concat(res.posts);
        this.enough = res.posts.length < this.limit;
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.loading = false;
      }
    },
    handleDelete(id) {
      this.posts = this.posts.filter((post) => post._id !== id);
    },
  },
  head() {
    return {
      title: `${this.user?.username} (${this.user?.name}) - Profile`,
    };
  },
};
</script>
