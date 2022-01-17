<template>
  <li>
    <div class="sw-card sw-run-category" v-on:click="listRuns()">
      <h2>
        <div class="sw-run-category-text">{{ title }}</div>
      </h2>
      <div class="sw-run-category-count">{{ runs.length }}</div>
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
      runs: this.$store.getters.getRuns(this.filter)
    }
  },
  methods: {
    listRuns () {
      this.$router.push({
        path: '/runs/' + this.type
      })
    }
  }
}
</script>

<style scoped>
.sw-run-category-count {
  margin: 10px auto;
  font-size: xx-large;
}
</style>
