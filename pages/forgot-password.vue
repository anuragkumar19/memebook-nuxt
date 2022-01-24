<template>
  <v-row justify="center" align="center" style="padding: 0 4rem">
    <v-col md="6" sm="10">
      <v-card>
        <v-card-text style="text-align: center; padding: 4rem 2rem">
          <h1>Forget Password?</h1>
          <p style="margin-top: 1rem">
            Enter your email address and we OTP send you a link to reset your
            password.
          </p>
          <v-form v-model="valid" @submit.prevent="forgotPassword">
            <v-container>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                required
                type="email"
              ></v-text-field>
            </v-container>
            <v-btn
              type="submit"
              color="primary"
              block
              :disabled="!valid"
              :loading="submitting"
            >
              Get OTP
            </v-btn>
          </v-form>
          <nuxt-link
            to="/login"
            style="display: inline-block; margin: 2rem 0 0 0"
          >
            Back to login
          </nuxt-link>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ForogtPasswordPage",
  auth: false,
  data() {
    return {
      email: "",
      valid: false,
      submitting: false,
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
    };
  },
  methods: {
    async forgotPassword() {
      try {
        this.submitting = true;
        const res = await this.$axios.$post("/auth/forgot-password", {
          email: this.email,
        });

        this.$toast.success(res.message);
        this.$store.commit("setResetEmail", this.email);

        this.$router.push("/reset-password");
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style></style>
