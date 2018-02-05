<template>
  <div v-if="run" class="sw-page sw-run-editor">
    <h1 class="sw-header">
      <button class="sw-action-button" @click="$router.go(-1)">
        <i class="material-icons">cancel</i>
      </button>
      <div class="sw-page-title">Edit</div>
      <button class="sw-action-button">
        <i class="material-icons">done</i>
      </button>
    </h1>
    <div class="sw-name-editor">
      <label for="name">Run Name:</label>
      <input type="text" name="name" v-model="run.name" placeholder="Run Name" />
    </div>
    <ol class="sw-card-list" v-if="run.steps.length">
      <sw-step-editor v-for="step in run.steps" :step="step" :key="step.id" />
    </ol>
    <button class="sw-action-button">
      <i title="New Step" class="material-icons">add_circle_outline</i>
    </button>
  </div>
  <div v-else class="sw-page sw-run-editor">
    <h1 class="sw-header">Run not found</h1>
  </div>
</template>

<script>
import swStepEditor from './sw-step.vue'

export default {
  name: 'sw-run',
  props: [ 'id' ],
  watch: {
    '$route' (to, from) {
      this.run = this.$services.dataStore.getRun(to.params.id)
    }
  },
  data () {
    return {
      run: this.$services.dataStore.getRun(this.id)
    }
  },
  methods: {
  },
  components: {
    swStepEditor
  }
}
</script>

<style>
.sw-name-editor {
  padding: 50px 0 0 0;
}
</style>
