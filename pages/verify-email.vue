<template>
  <v-row align="center" justify="center">
    <v-card max-width="500px">
      <v-card-text class="px-6 py-8">
        <h1>Enter OTP</h1>
        <p class="mt-3">
          A OTP has been sent to your email
          <code>{{ $store.state.signup_email }}</code> to verify your email
        </p>
        <v-form @submit.prevent="verify">
          <v-otp-input
            length="6"
            plain
            type="number"
            v-model="otp"
            @input="validate"
          ></v-otp-input>
          <div class="text-right">
            <v-btn
              :disabled="!valid"
              color="primary"
              class="mt-3"
              type="submit"
              :loading="submitting"
              >Verify</v-btn
            >
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: "VerifyEmailPage",
  auth: "guest",
  data() {
    return {
      otp: "",
      valid: false,
      submitting: false,
    };
  },
  methods: {
    async verify() {
      if (this.valid) {
        try {
          this.submitting = true;
          const res = await this.$axios.$post("/auth/verify", {
            otp: this.otp,
            email: this.$store.state.signup_email,
          });

          this.$toast.success(res.message);

          this.$store.commit("setSignupEmail", "");
          this.$router.push("/login");
        } catch (err) {
          this.$toast.error(err.response.data.message);
        } finally {
          this.submitting = false;
        }
      }
    },
    validate() {
      if (this.otp.length === 6) {
        this.valid = true;
      } else {
        this.valid = false;
      }
    },
  },
  created() {
    if (!this.$store.state.signup_email) {
      this.$router.push("/login");
    }
  },
};
</script>
