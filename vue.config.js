module.exports = {
  outputDir: 'www',
  assetsDir: 'static',
  baseUrl: './',
  runtimeCompiler: true,
  chainWebpack: config => {
    if (process.env.NODE_ENV !== 'production') {
      config.devtool('eval')
      config.module
        .rule('istanbul')
        .test(/\.(js|vue)$/)
        .enforce('post')
        .include.add('src')
        .end()
        .use('istanbul-instrumenter-loader')
        .loader('istanbul-instrumenter-loader')
        .options({ esModules: true })
        .end()
    }
  }
}
