const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8888,
    open: false,
    proxy: {
      // 如果请求的地址是以 /api 开头就会请求到'http://121.4.103.100',
      '/api': {
        target: 'http://175.27.228.178:3000/api/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' //请求的时候api会被替换成''
        }
      }
    }
  }
})
