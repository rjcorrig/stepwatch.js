// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'browse to run view': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = process.env.VUE_DEV_SERVER_URL

    browser
      .url(devServer + '/#/run/bar')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.sw-run')
      .assert.containsText('h1', 'not found')
      .url(devServer + '/#/run/foo')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.sw-run')
      .assert.containsText('h1', 'Sprint')
      .end()
  }
}
