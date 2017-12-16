<template>
  <li>
    <div class="sw-card sw-run-category">
      <div class="sw-run-category-text">
        {{ title }}
      </div>
      <div class="sw-run-category-count">
        {{ runs.length }}
      </div>
      <button v-if="runs.length > 0" v-on:click="listRuns()" class="sw-button">Go to List</button>
    </div>
  </li>
</template>

<script>
export default {
  name: 'sw-run-category',
  props: [
    'title', 'type', 'filter'
  ],
  data () {
    var runs

    switch (this.type) {
      case 'program': {
        runs = this.$services.dataStore.getRuns(
          r => r.status === 'program'
        )
        break
      }
      case 'running': {
        runs = this.$services.dataStore.getRuns(
          r => ['paused', 'running', 'created'].indexOf(r.status) >= 0
        )
        break
      }
      case 'history': {
        runs = this.$services.dataStore.getRuns(
          r => ['canceled', 'complete'].indexOf(r.status) >= 0
        )
        break
      }
    }

    return {
      runs: runs
    }
  },
  methods: {
    listRuns () {
      this.$router.push('/runs/' + this.type)
    }
  }
}
</script>

<style scoped>
.sw-run-category-count {
  margin: 30px auto;
  font-size: xx-large;
}
</style>
