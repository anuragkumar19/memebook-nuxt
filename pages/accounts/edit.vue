<template>
  <v-row justify="center" align="center" class="py-10 px-5">
    <v-card max-width="600px">
      <v-card-title>
        <span class="text-h5">Edit Profile</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form v-model="valid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Name"
                  required
                  v-model="name"
                  :rules="nameRules"
                  @input="isDataChanged"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Username"
                  required
                  v-model="username"
                  :rules="usernameRules"
                  @input="isDataChanged"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  type="url"
                  label="Website"
                  required
                  v-model="website"
                  :rules="websiteRules"
                  @input="isDataChanged"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  counter
                  label="Bio"
                  :rules="bioRules"
                  v-model="bio"
                  @input="isDataChanged"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          nuxt
          :to="`/user/${$auth.user.username}`"
        >
          Back to Profile
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          :disabled="!(changed && valid)"
          :loading="submitting"
          @click="updateProfile"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-row>
</template>

<script>
export default {
  head: {
    title: "Edit Profile",
  },
  data: ({ $auth }) => ({
    changed: false,
    username: $auth.user.username,
    name: $auth.user.name,
    bio: $auth.user.bio,
    website: $auth.user.website,
    valid: true,
    nameRules: [
      (v) => !!v || "Full Name is required",
      (v) => v.length >= 3 || "Full Name must be at least 3 characters",
    ],
    usernameRules: [
      (v) => !!v || "Username is required",
      (v) => v.length >= 3 || "Username must be at least 3 characters",
      (v) =>
        /^[a-zA-Z0-9._]+$/.test(v) ||
        "Username must contain only letters, numbers, periods(.) and underscores(_)",
    ],
    bioRules: [(v) => v.length < 200 || "Bio must be less than 200 characters"],
    websiteRules:
      [
        (v) =>
          !v ||
          /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(
            v
          ),
      ] || "Website must be a valid URL",
    submitting: false,
    error: false,
  }),
  methods: {
    isDataChanged() {
      this.changed =
        this.username !== this.$auth.user.username ||
        this.name !== this.$auth.user.name ||
        this.bio !== this.$auth.user.bio ||
        this.website !== this.$auth.user.website;
    },
    async updateProfile() {
      this.submitting = true;
      try {
        if (this.name !== this.$auth.user.name) {
          await this.$axios.$put("/user/name", { name: this.name });
        }
        if (this.username !== this.$auth.user.username) {
          await this.$axios.$put("/user/username", { username: this.username });
        }
        if (this.bio !== this.$auth.user.bio) {
          await this.$axios.$put("/user/bio", { bio: this.bio });
        }
        if (this.website !== this.$auth.user.website) {
          await this.$axios.$put("/user/website", { website: this.website });
        }
      } catch (err) {
        this.$toast.error(err.response.data.message);
        this.error = true;
      } finally {
        await this.$auth.fetchUser();
        this.submitting = false;
        if (!this.error) {
          this.$toast.success("Profile updated successfully");
          this.$router.push("/user/" + this.$auth.user.username);
        } else {
          this.error = false;
        }
      }
    },
  },
};
</script>
