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
import usePlaceholders from '../../store/placeholders'
import HeaderHero from './HeaderHero.vue'
import MenuPanel from './MenuPanel.vue'

defineProps({
  logoClickCallback: {
    type: Function,
    required: false
  }
})

const { title } = usePlaceholders()
</script>

<template>
  <header class="dark:text-white pt-4 px-2 <sm:px-0">
    <div class="container mx-auto flex flex-row py-4 px-6 justify-between glass-soft <sm:(pb-2 pt-5 px-5 justify-start)">
      <h1 @click="logoClickCallback" class="hero-headline text-sm tracking-widest font-medium py-1 <sm:w-1/2">
        <router-link :to="'/'">{{ title }}</router-link>
      </h1>
      <MenuPanel class="hero-cta mt-0.5"/>
    </div>
    <HeaderHero class="pt-6 pb-9 <sm:pb-4" />
  </header>
</template>
