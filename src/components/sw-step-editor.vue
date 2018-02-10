<template>
  <li class="sw-step-editor">
    <div class="sw-card">
      <div class="sw-editor">
        <input type="text" name="name" v-model="step.name" placeholder="Run Name" required="required"/>
        <label for="name">Step Name:</label>
      </div>
      <div class="sw-editor">
        <input type="number" name="name" v-model="step.totalSeconds" placeholder="Duration in seconds" required="required" min="1">
        <label for="name">Duration in seconds:</label>
      </div>
      <div class="sw-actions">
        <button v-if="canMoveUp" @click.stop="moveUp" class="sw-action-button" title="Move Up">
          <i class="material-icons">arrow_upward</i>
        </button>
        <button v-if="canMoveDown" @click.stop="moveDown" class="sw-action-button" title="Move Down">
          <i class="material-icons">arrow_downward</i>
        </button>
        <button @click.stop="copy" class="sw-action-button" title="Copy">
          <i class="material-icons">content_copy</i>
        </button>
        <button @click.stop="remove" class="sw-action-button" title="Delete">
          <i class="material-icons">delete</i>
        </button>
      </div>
    </div>
  </li>
</template>

<script>
import models from '@/stepwatch/models'
import swDigitalClock from './sw-digital-clock.vue'

export default {
  name: 'sw-step',
  components: { swDigitalClock },
  props: {
    step: {
      type: models.Step,
      required: true
    },
    canMoveUp: {
      type: Boolean,
      default: false
    },
    canMoveDown: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    moveUp () {
      this.$emit('moveUp', this.step)
    },
    moveDown () {
      this.$emit('moveDown', this.step)
    },
    copy () {
      this.$emit('copy', this.step)
    },
    remove () {
      this.$emit('remove', this.step)
    }
  }
}
</script>

<style scoped>
.sw-editor {
  text-align: left;
  display: flex;
  flex-direction: column-reverse;
}

.sw-editor input {
  font-size: 1.5em;
  width: 100%;
  margin: 0 0 5px 0;
  padding: 0;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-radius: 0;
}

.sw-editor input:invalid {
  border-color: red;
  color: red;
}

.sw-editor input:invalid + label {
  color: red;
}

</style>
