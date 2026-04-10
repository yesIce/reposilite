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
import GlobeIcon from '../icons/GlobeIcon.vue'
import usePlaceholders from '../../store/placeholders'

const { title, description, organizationWebsite, organizationLogo } = usePlaceholders()
</script>

<template>
  <div class="container mx-auto pt-8 pb-4">
    <div class="flex flex-col items-center text-center">
      <div class="w-20 mb-4">
        <img class="hero-logo border border-white border-opacity-10 rounded-full" :src="organizationLogo">
      </div>
      <h1 class="hero-headline page-title text-5xl <sm:text-3xl">{{ title }}</h1>
      <div class="section-divider"></div>
      <div class="glass-panel max-w-3xl w-full p-6 <sm:px-4">
        <div class="hero-subtext card-body" v-html="description"></div>
        <div class="hero-cta flex flex-row justify-center py-2">
          <GlobeIcon />
          <a class="px-3 text-[#bbbbbb] hover:text-[#ffb800]" :href="organizationWebsite" target="_blank">{{ organizationWebsite }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
