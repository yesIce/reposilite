<!--
  - Copyright (c) 2023 dzikoysk
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<script setup>
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import { createToast } from 'mosha-vue-toastify'
import { useSession } from '../../store/session'
import CloseIcon from '../icons/CloseIcon.vue'

const { login } = useSession()
const showLogin = ref(false)
const name = ref('')
const secret = ref('')

const close = () => 
  (showLogin.value = false)

const signin = (name, secret) =>
  login(name, secret)
    .then(() => createToast(`Dashboard accessed as ${name}`, { position: 'bottom-right' }))
    .then(() => close())
    .catch(error => createToast(`${error.response.status}: ${error.response.data.message}`, { type: 'danger' }))
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div id="login-modal">
    <VueFinalModal
      v-model="showLogin"
      v-bind="$attrs"
      class="flex justify-center items-center bg-black bg-opacity-70 backdrop-blur-sm"
    >
      <div class="relative m-w-20 py-5 px-10 rounded-2xl text-center glass-modal">
        <p class="font-bold text-xl pb-4">Login with access token</p>
        <form class="flex flex-col w-96 <sm:w-65" @submit.prevent="signin(name, secret)">
          <input placeholder="Name" v-model="name" type="text" class="input"/>
          <input placeholder="Secret" v-model="secret" type="password" class="input"/>
          <div class="text-right mt-1">
            <button @click="close()" class="link-action">← Back to index</button>
          </div>
          <button class="primary-action my-3">Sign in</button>
        </form>
        <button class="absolute top-0 right-0 mt-5 mr-5 icon-action" @click="close()">
          <CloseIcon />
        </button>
      </div>
    </VueFinalModal>
    <div @click="showLogin = true">
      <slot name="button"></slot>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply p-2;
  @apply my-1;
  @apply rounded-md;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(10px);
}
.dark .input {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.22);
}
</style>
