module.exports = {
  // 反向代理
  devServer: {
    host: 'asset-manage.graduation.co',
    port: 8086,
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        ws: true,
        changeOrigin: true,
        pathRewrite: {"^/api": ""}
      },
    },
  }
}