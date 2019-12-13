export const state = () => ({
  me: null,
});

export const mutations = ({ // 동기적 작업
  setMe(state, payload) {
    state.me = payload;

  }
});

export const actions = { // 비동기적 작업
  signUp(context, payload) {

  },
  logIn(context, payload) {

  },
  logOut(context, payload) {

  },
}
