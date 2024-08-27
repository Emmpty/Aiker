const draw = {
  namespaced: true,
  state: {
    galleryDrawList: [],
    mineDrawList: [],
    // 光影舞蹈制作参数
    danceDrwaParam: uni.getStorageSync('danceDrwaParam') || {
      draftId: '',    // 首帧图像制作id，用来获取制作结果
      firstImgShowStatus: null,  // 首帧图像弹框,null：没制作，0为成功，大于0制作中，小于0失败
    },
  },
  mutations: {
    changeGalleryDrawList(state, data) {
      state.galleryDrawList = data
      // uni.setStorageSync('galleryDrawList', data)
    },
    changeMineDrawList(state, data) {
      state.mineDrawList = data
      // uni.setStorageSync('mineDrawList', data)
    },
    changeDanceDrwaParam(state, data) {
      state.danceDrwaParam = data
      uni.setStorageSync('danceDrwaParam', data)
    },
  },
  getters: {},
  actions: {}
}

export default draw
