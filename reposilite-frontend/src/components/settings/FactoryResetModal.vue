<script setup>
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import { property } from '../../helpers/vue-extensions'
import CloseIcon from '../icons/CloseIcon.vue'

const props = defineProps({
  callback: property(Function, true)
})

const showFactoryReset = ref(false)

const factoryReset = () => {
  props.callback()
  showFactoryReset.value = false
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<template>
  <div id="adjustments-modal">
    <VueFinalModal
      v-model="showFactoryReset"
      v-bind="$attrs"
      class="flex justify-center iems-center bg-black bg-opacity-70 backdrop-blur-sm"
    >
      <div class="relative m-w-20 py-5 px-10 rounded-2xl text-center glass-modal">
        <div>
          <h1 class="font-bold pb-4">Factory reset</h1>
          <p>Do you really want to reset whole configuration to the default values?</p>
          <div class="factory-reset-confirm flex mx-auto w-full gap-4 justify-center">
            <button class="danger-action" @click="factoryReset">Yes</button>
            <button class="secondary-action" @click="showFactoryReset = false">No</button>
          </div>
        </div>
        <button class="absolute top-0 right-0 mt-5 mr-9 icon-action" @click="showFactoryReset = false">
          <CloseIcon />
        </button>
      </div>
    </VueFinalModal>
    <div @click="showFactoryReset = true">
      <slot name="button"></slot>
    </div>
  </div>
</template>

<style scoped>
.factory-reset-confirm {
  @apply mt-6;
}
</style>
