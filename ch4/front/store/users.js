export const state = () => ({
  me: null,
  followerList: [],

  followingList: [],

  hasMoreFollower: true,
  hasMoreFollowing: true,
});


const totalFollowers = 8;
const totalFollowings = 6;
const limit = 3;

export const mutations = ({ // 동기적 작업
  setMe(state, payload) {
    state.me = payload;
  },

  changeNickname(state, payload) {
    state.me.nickname = payload.nickname;
  },

  addFollower(state, payload) {
    state.followerList.push(payload);
  },

  addFollowing(state, payload) {
    state.followingList.push(payload);
  },

  removeFollower(state, payload) {
    const index = state.followerList.findIndex(v=> v.id === payload.id);
    state.followerList.splice(index, 1);
  },

  removeFollowing(state, payload) {
    const index = state.followingList.findIndex(v=> v.id === payload.id);
    state.followingList.splice(index, 1);
  },

  loadFollowers(state) {
    const diff = totalFollowers - state.followerList.length;
    const fakeUsers = Array(limit).fill().map(v=> ({
      id: Math.random().toString(),
      nickname: Math.floor(Math.random() * 1000),
    }));
    state.followerList = state.followerList.concat(fakeUsers);
    state.hasMoreFollower = fakeUsers.length === limit;
  },

  loadFollowings(state) {
    const diff = totalFollowings - state.followingList.length;
    const fakeUsers = Array(limit).fill().map(v=> ({
      id: Math.random().toString(),
      nickname: Math.floor(Math.random() * 1000),
    }));
    state.followingList = state.followingList.concat(fakeUsers);
    state.hasMoreFollowing = fakeUsers.length === limit;
  }

});

export const actions = { // 비동기적 작업
  signUp({ commit, state }, payload) {
    this.$axios.post('http://localhost:3085/user', {
      email: payload.email,
      nickname: payload.nickname,
      password: payload.password,
    });
    commit('setMe', payload);
  },

  logIn({commit}, payload) {
    commit('setMe', payload);
  },

  logOut({commit}, payload) {
    commit('setMe', payload);
  },

  changeNickname({commit}, payload) {
    commit('changeNickname', payload);
  },

  addFollower({commit}, payload) {
    commit('addFollwer', payload);
  },

  removeFollowing({commit}, payload) {
    // 비동기 요청
    commit('removeFollowing', payload);
  },

  removeFollower({commit}, payload) {
    commit('removeFollower', payload);
  },
  loadFollowers({commit, state}, payload) {
    if(state.hasMoreFollower) {
      commit('loadFollowers');
    }
  },
  loadFollowings({commit, state}, payload) {
    if(state.hasMoreFollowing) {
      commit('loadFollowings');
    }
  },
}