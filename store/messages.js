export const state = () => ({
  users: {},
});

export const mutations = {
  handle(state, data) {
    if (state.users[data.from._id]) {
      state.users[data.from._id].messages.push(data);
    }
  },
  setMessages(state, data) {
    state.users[data.user] = data;
  },
};
