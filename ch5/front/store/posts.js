import Vue from 'vue';

export const state = () => ({
  mainPosts: [],
  hasMorePost: true,
  imagePaths: [],
});

const totalPosts = 51;
const limit = 10;

export const mutations = {
  addMainPost(state, payload) { // 게시글 작성
    state.mainPosts.unshift(payload);
    state.imagePaths = [];
  },

  removeMainPost(state, payload) { // 게시글 삭제
    const index = state.mainPosts.findIndex(v => v.id === payload.postId);
    state.mainPosts.splice(index, 1);
  },

  loadComments(state, payload) { // 게시글의 댓글 불러오기
    const index = state.mainPosts.findIndex(v => v.id === payload.postId);
    Vue.set(state.mainPosts[index], 'Comments', payload.data);
  },

  addComment(state, payload) { // 게시글의 댓글 작성
    const index = state.mainPosts.findIndex(v => v.id === payload.postId);
    state.mainPosts[index].Comments.unshift(payload);
  },

  loadPosts(state, payload) { // 게시글 불러오기
    state.mainPosts = state.mainPosts.concat(payload.data);
    state.hasMorePost = payload.length === limit;
    // if (payload.reset) {
    //   state.mainPosts = payload.data;
    // } else {
    //   state.mainPosts = state.mainPosts.concat(payload.data);
    // }
    // state.hasMorePost = payload.data.length === 10;
  },

  concatImagePaths(state, payload) { // 이미지 넣었는데 또 추가할 때
    state.imagePaths = state.imagePaths.concat(payload);
  },

  removeImagePath(state, payload) { // 이미지 제거하기
    state.imagePaths.splice(payload, 1);
  }
};

export const actions = {
  add({ commit, state }, payload) {
    // 서버에 게시글 등록 요청 보냄
    this.$axios.post('/post', {
      content: payload.content,
      image: state.imagePaths,
    }, {
      withCredentials: true,
    })
    .then((res) => {
      commit('addMainPost', res.data);
    })
    .catch((err) => {
      console.error(err);
    });

  },

  remove({ commit }, payload) {
    this.$axios.delete(`/post/${payload.postId}`, {
      withCredentials: true,
    })
    .then(() => {
      commit('removeMainPost', payload.postId);
    })
    .catch((err) => {
      console.error(err);
    });
  },

  addComment({ commit }, payload) {
    this.$axios.post(`/post/${payload.postId}/Comment`, {
      content: payload.content,
    }, {
      withCredentials: true,
    })
    .then((res) => {
      commit('addComment', res.data);
    })
    .catch((err) => {
      console.error(err);
    });
  },

  loadComment({ commit, payload }) {
    this.$axios.get(`/post/${payload.postId}/Comments`, {
      content: payload.content,
    })
    .then((res) => {
      commit('loadComments', res.data);
    })
    .catch((err) => {
      console.error(err);
    });
  },

  loadPosts({ commit, state }, payload) {
    if(state.hasMorePost) {
      this.$axios.get(`/posts?offset=${state.mainPosts.length}&limit=10`)
        .then(() => {
          commit('loadPosts', res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },

  uploadImages({ commit }, payload) {
    this.$axios.post('/post/images', payload, {
      withCredentials: true,
    })
    .then((res) => { // back의 post에서 받음
      commit('concatImagePaths', res.data);
    })
    .catch((err) => {
      console.error(err);
    });
  }
};
