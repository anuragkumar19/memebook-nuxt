<template>
  <v-row justify="center" align="center" style="padding: 0 4rem">
    <v-col md="6" sm="10">
      <v-card>
        <v-card-text style="text-align: center; padding: 4rem 2rem">
          <h1>Reset Your Password</h1>
          <p style="margin-top: 1rem">
            Enter your OTP sent to your email {{ $store.state.reset_email }} and
            new password.
          </p>
          <v-form v-model="valid" @submit.prevent="resetPassword">
            <v-container>
              <v-otp-input
                length="6"
                plain
                type="number"
                v-model="otp"
                @input="validate"
              ></v-otp-input>
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="New Password"
                type="password"
                required
              ></v-text-field>
            </v-container>
            <v-btn
              type="submit"
              color="primary"
              block
              :disabled="!(valid && isOtpValid)"
              :loading="submitting"
            >
              Reset Password
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
  name: "ResetPasswordPage",
  auth: false,
  data() {
    return {
      isOtpValid: false,
      valid: false,
      otp: "",
      password: "",
      submitting: false,
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => v.length >= 6 || "Password must be at least 6 characters",
      ],
    };
  },
  methods: {
    async resetPassword() {
      try {
        this.submitting = true;
        const res = await this.$axios.$post("/auth/reset-password", {
          email: this.$store.state.reset_email,
          otp: this.otp,
          password: this.password,
        });
        this.$toast.success(res.message);
        this.$store.commit("setResetEmail", "");
        this.$router.push("/login");
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        this.submitting = false;
      }
    },
    validate() {
      this.isOtpValid = this.otp.length === 6;
    },
  },
  created() {
    if (!this.$store.state.reset_email) {
      this.$router.push("/login");
    }
  },
};
</script>
