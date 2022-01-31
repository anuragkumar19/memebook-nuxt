export const state = () => ({
  signup_email: "",
  reset_email: "",
  posts: [],
});

export const mutations = {
  setSignupEmail(state, email) {
    state.signup_email = email;
  },
  setResetEmail(state, email) {
    state.reset_email = email;
  },
  setPosts(state, posts) {
    state.posts = posts;
  },
};
