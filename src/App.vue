<template>
  <div id="app">
    <transition appear name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  created () {
    console.log('APP CREATED')
    // Doesn't get called because boilerplate ondeviceready handler bombs
    document.addEventListener('deviceready', this.init)
  },
  methods: {
    init () {
      console.log('INIT with cordova = ' + window.cordova)
      console.log('INIT with this.$router = ' + this.$router)
      if (window.cordova) {
        cordova.plugins.backgroundMode.setDefaults({ silent: true })

        cordova.plugins.notification.local.on('click', (notification, state) => {
          console.log('CLICK: ' + JSON.stringify(notification))
          this.$router.push({
            name: 'sw-run',
            params: {
              id: notification.data.runId
            }
          })
        })
      }
    }
  }
}
</script>

<style scoped>
#app {
  font-family: "Lucida Grande", Helvetica, Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

#app a {
  color: #00B7FF;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
