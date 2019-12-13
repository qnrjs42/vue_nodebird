export const state = () => ({
  me: null,
});

export const mutations = ({ // 동기적 작업
  setMe(state, payload) {
    state.me = payload;

  }
});

export const actions = { // 비동기적 작업
  signUp({commit, state }, payload) {
    commit('setMe', payload);
  },

  logIn({commit}, payload) {
    commit('setMe', payload);
  },

  logOut({commit}, payload) {
    commit('setMe', payload);
  },
}
