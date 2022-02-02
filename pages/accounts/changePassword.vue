<template>
  <v-row justify="center" align="center" class="py-10 px-5">
    <v-card max-width="600px">
      <v-card-title>
        <span class="text-h5">Change Password</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form v-model="valid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Old Password"
                  required
                  v-model="oldPassword"
                  type="password"
                  :rules="passwordRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="New Password"
                  required
                  v-model="newPassword"
                  type="password"
                  :rules="passwordRules"
                ></v-text-field>
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
          :disabled="!valid"
          :loading="submitting"
          @click="updatePassword"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-row>
</template>
<script>
export default {
  name: "changePasswordPage",
  data() {
    return {
      valid: false,
      submitting: false,
      oldPassword: "",
      newPassword: "",
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => v.length >= 6 || "Password must be at least 6 characters",
      ],
    };
  },
  methods: {
    async updatePassword() {
      try {
        this.submitting = true;
        await this.$axios.$put(`/user/password`, {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        });

        this.$toast.success("Password updated successfully");
        this.$router.push("/");
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>
