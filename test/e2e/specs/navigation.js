// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'home page to run list and back': function (browser) {
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer + '/#')
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.sw-home')
      .assert.containsText('h1', 'StepWatch')
      .assert.elementPresent('.sw-home .sw-card-list li:first-child')
      .click('.sw-home .sw-card-list li:first-child')
      .waitForElementVisible('.sw-run-list', 5000)
      .assert.containsText('h1', 'Programs')
      .back()
      .waitForElementVisible('.sw-home', 5000)
      .assert.containsText('h1', 'StepWatch')
      .forward()
      .waitForElementVisible('.sw-run-list', 5000)
      .assert.containsText('h1', 'Programs')
      .end()
  }
}
