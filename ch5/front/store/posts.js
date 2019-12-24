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
    state.mainPosts[index].Comments = payload;
  },

  addComment(state, payload) { // 게시글의 댓글 작성
    const index = state.mainPosts.findIndex(v => v.id === payload.postId);
    state.mainPosts[index].Comments.unshift(payload);
  },

  loadPosts(state, payload) { // 게시글 불러오기
    state.mainPosts = state.mainPosts.concat(payload);
    state.hasMorePost = payload.length === limit;
  },

  concatImagePaths(state, payload) { // 이미지 넣었는데 또 추가할 때
    state.imagePaths = state.imagePaths.concat(payload);
  },

  removeImagePath(state, payload) { // 이미지 제거하기
    state.imagePaths.splice(payload, 1);
  }
};

export const actions = {
  add({ commit }, payload) {
    // 서버에 게시글 등록 요청 보냄
    this.$axios.post('http://localhost:3085/post', {
      content: payload.content,
      imagePaths: state.imagePaths,
    }, {
      withCredentials: true,
    })
    .then((res) => {
      commit('addMainPost', res.data);
    })
    .catch(() => {

    });

  },

  remove({ commit }, payload) {
    this.$axios.delete(`http://localhost:3085/post/${payload.postId}`, {
      withCredentials: true,
    })
    .then(() => {
      commit('removeMainPost', payload.postId);
    })
    .catch(() => {

    });
  },

  addComment({ commit }, payload) {
    this.$axios.post(`http://localhost:3085/post/${payload.postId}/Comment`, {
      content: payload.content,
    }, {
      withCredentials: true,
    })
    .then((res) => {
      commit('addComment', res.data);
    })
    .catch(() => {

    });
  },

  loadComment({ commit, payload }) {
    this.$axios.get(`http://localhost:3085/posts/${payload.postId}/Comment`, {
      content: payload.content,
    })
    .then((res) => {
      commit('loadComments', res.data);
    })
    .catch(() => {

    });
  },

  loadPosts({ commit, state }, payload) {
    if(state.hasMorePost) {
      this.$axios.get(`http://localhost:3085/posts?offset=${state.mainPosts.length}&limit=10`)
        .then(() => {
          commit('loadPosts', res.data);
        })
        .catch(() => {

        });
    }
  },

  uploadImages({ commit }, payload) {
    this.$axios.post('http://localhost:3085/post/images', payload, {
      withCredentials: true,
    })
    .then((res) => { // back의 post에서 받음
      commit('concatImagePaths', res.data);
    })
    .catch(() => {

    })
  }
};
