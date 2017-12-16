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
  props: {
    type: {
      type: String
    },
    title: {
      type: String,
      default: 'All runs and programs'
    },
    filter: {
      type: Function,
      default: r => true
    }
  },
  data () {
    return {
      runs: this.$services.dataStore.getRuns(this.filter)
    }
  },
  methods: {
    listRuns () {
      this.$router.push({
        name: 'sw-run-list',
        params: {
          type: this.type,
          title: this.title,
          filter: this.filter
        }
      })
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
