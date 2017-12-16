<template>
  <div class="sw-page sw-home">
    <h1 class="sw-header">Welcome to StepWatch</h1>
    <ol class="sw-card-list">
      <li>
        <div class="sw-card">
          <div class="sw-category-text">
            Programs defined
          </div>
          <div class="sw-category-count">
            {{ programCount }}
          </div>
          <button v-if="programCount === 0" v-on:click="createProgram()" class="sw-button">Create New</button>          
          <button v-else v-on:click="listPrograms()" class="sw-button">Go to List</button>          
        </div>
      </li>
      <li>
        <div class="sw-card">
          <div class="sw-category-text">
            Runs in progress
          </div>
          <div class="sw-category-count">
            {{ runningCount }}
          </div>
          <button v-if="runningCount > 0" v-on:click="listRunning()" class="sw-button">Go to List</button>          
        </div>
      </li>
      <li>
        <div class="sw-card">
          <div class="sw-category-text">
            Run history
          </div>
          <div class="sw-category-count">
            {{ historyCount }}
          </div>
          <button v-if="historyCount > 0" v-on:click="listHistory()" class="sw-button">Go to List</button>          
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'sw-home',
  data () {
    return {
      runs: this.$services.dataStore.getRuns()
    }
  },
  computed: {
    programCount () {
      return this.runs.filter(
        r => r.status === 'program'
      ).length
    },
    runningCount () {
      return this.runs.filter(
        r => ['paused', 'running', 'created'].indexOf(r.status) >= 0
      ).length
    },
    historyCount () {
      return this.runs.filter(
        r => ['canceled', 'complete'].indexOf(r.status) >= 0
      ).length
    }
  },
  methods: {
    createProgram () {
    },
    listPrograms () {
      this.$router.push('/runs/program')
    },
    listRunning () {
      this.$router.push('/runs/running')
    },
    listHistory () {
      this.$router.push('/runs/history')
    }
  }
}
</script>

<style scoped>
.sw-category-count {
  margin: 30px auto;
  font-size: xx-large;
}
</style>
