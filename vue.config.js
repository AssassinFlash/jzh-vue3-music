// 使用backend
const registerRouter = require('./backend/router')
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和mixin
        prependData: `
        @import "./src/assets/scss/variable.scss";
        @import "./src/assets/scss/mixin.scss";`
      }
    }
  },
  devServer: {
    before (app) {
      registerRouter(app)
    }
  }
}
