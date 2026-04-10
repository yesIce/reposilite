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
import {ref, toRaw, watch} from 'vue'
import {JsonForms} from '@jsonforms/vue'
import {Tabs, Tab, TabPanels, TabPanel} from 'vue3-tabs'
import { useConfiguration } from '../../store/configuration'
import download from 'downloadjs'
import FactoryResetModal from './FactoryResetModal.vue'
import { property } from '../../helpers/vue-extensions'

const props = defineProps({
  selectedTab: property(String, true)
})

const {
  fetchConfiguration,
  updateConfiguration, 
  renderers, 
  configurationValidator,
  domains, 
  configurations,
  schemas,
  selectedDomain
} = useConfiguration()

const isValid = ref(true)
const hasChanged = ref(false)

const executeIfValid = (callback) => { 
  if (isValid.value) callback() 
}

const updateFormsConfiguration = (domain, event) => {
  if (!hasChanged.value) {
    hasChanged.value = configurations.value[domain] != event.data
  }
  configurations.value[domain] = event.data
  isValid.value = event.errors.length == 0
  event.errors.forEach(error => {
    console.log(error)
  })
}

watch(
  () => props.selectedTab,
  (selectedTab, prev) => {
    /* Fetch configuration only when user opens the configuration tab  */
    if (selectedTab === 'Settings' && prev == undefined && domains.value.length == 0)
      fetchConfiguration()
  },
  { immediate: true }
)

const downloadSettings = () => {
  download(
    JSON.stringify(toRaw(configurations.value)), 
    'shared.configuration.json', 
    'application/json'
  )
}

const factoryReset = () => {
  const emptyConfiguration = {}
  domains.value.forEach(domain => emptyConfiguration[domain] = {})
  configurations.value = emptyConfiguration
  updateConfiguration()
}

/* JsonForms configuration */
const formsConfiguration = {
  showUnfocusedDescription: true
}
</script>

<template>
  <div class="container mx-auto py-10 px-15 rounded-3xl glass-panel <sm:rounded-2xl">
    <div class="flex justify-between pb-3 flex-col">
      <div>
        <p>Modify configuration shared between all instances.</p>
        <p><strong>Remember</strong>: Configuration propagation can take up to 10 seconds on all your instances.</p>
      </div>
      <div id="configuration-state" class="flex flex-row flex-wrap gap-2 pt-8 <sm:flex-col">
        <button 
          @click.prevent="executeIfValid(downloadSettings)" 
          class="secondary-action"
          :class="{ 'is-disabled': !isValid }"
          :disabled="!isValid"
        >
          Download as JSON
        </button>
        <FactoryResetModal :callback="factoryReset">
            <template v-slot:button>
                <button class="secondary-action">Factory reset</button>
            </template>
        </FactoryResetModal>
        <button 
          @click.prevent="executeIfValid(updateConfiguration)" 
          class="primary-action"
          :class="{ 'is-disabled': !isValid || !hasChanged }"
          :disabled="!isValid || !hasChanged"
        >
          Update and reload
        </button>
        <button 
          @click.prevent="fetchConfiguration"
          class="secondary-action"
          :class="{ 'is-disabled': !isValid || !hasChanged }"
          :disabled="!isValid || !hasChanged"
        >
          Reset changes
        </button>
      </div>
    </div>
    <Tabs v-model="selectedDomain">
      <Tab v-for="domain in domains"
        class="item"
        :key="`config:${domain}`"
        :val="domain"
        :label="schemas[domain]?.title"
        :indicator="true"
      />
    </Tabs>
    <TabPanels v-model="selectedDomain">
      <TabPanel 
        v-for="domain in domains" 
        :val="domain" 
        :key="`config_tab:${domain}`" 
        class="border-1 rounded p-4 glass-soft"
      >
        <JsonForms
          v-if="configurations[domain]"
          :config="formsConfiguration"
          :data="configurations[domain]"
          :schema="schemas[domain]"
          :renderers="renderers"
          :ajv="configurationValidator"
          @change="updateFormsConfiguration(domain, $event)"
        />
      </TabPanel>
    </TabPanels>
  </div>
</template>

<!--suppress CssInvalidAtRule -->
<style scoped>
#configuration-state button {
  @apply text-sm;
  min-width: 170px;
}

@media (max-width: 640px) {
  #configuration-state button {
    width: 100%;
    min-width: 0;
  }
}
.item {
  @apply pb-1;
  @apply pt-1.5;
  @apply cursor-pointer;
  color: #ffffff;
  background: rgba(30, 30, 30, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.07);
}
.tabs .item:hover {
  @apply text-yellow-400;
  background-color: rgba(255, 196, 0, 0.08);
  transition: color 200ms ease, background-color 200ms ease;
}
</style>

<!--suppress CssInvalidAtRule -->
<style>
.error {
  @apply text-red-500 px-2 font-bold;
}
.vertical-layout, .group-layout {
  @apply container mx-auto;
}
.control .input:not([type=checkbox]), .control .select {
  @apply text-sm h-9 px-4 text-black;
}
.control .input[type="checkbox"] {
  @apply h-5 w-5;
}
.control .input, .control .select {
  @apply mx-2 rounded;
}
.control .select {
  @apply pr-8;
}
.vertical-layout, .group, .array-list {
  @apply flex flex-col flex-wrap py-4 h-full;
  gap: 1rem;
}
.label, label {
  padding-bottom: 0.5em;
  padding-left: 0.45em;
  display: inline-block;
  font-weight: bold;
}
.description {
  padding-left: 0.45em;
  padding-bottom: 0.7em;
  @apply text-sm italic;
}
.array-list {
  padding: 0;
}
.array-list-label {
  font-weight: bold;
}
.array-list-item-label {
  margin-right: auto;
}
.array-list-item-delete {
  @apply absolute right-0 top-2;
}
.array-list-item-toolbar {
  @apply flex flex-row items-baseline relative;
}
.array-list-item-label {
  display: none;
}
.array-list-item-toolbar>button {
  padding: 0.5rem;
}
.array-list-legend {
  @apply flex flex-row-reverse gap-2 w-full;
  margin-bottom: 1rem;
}
.array-list-item-wrapper {
}
.one-of-container {
  @apply h-full flex flex-col; 
}
.one-of-container .active, .tab-panel .array-list .tab-panel .array-list .active {
  background: rgba(255, 196, 0, 0.08);
}
.one-of-container .tab-panel, .tab-panel .array-list .tab-panel .array-list .tab-panel {
  background: rgba(34, 34, 34, 0.9);
  border-radius: 0.25rem;
  padding-left: 17px;
}
.tabs > div {
  @apply rounded-t-lg;
}
.tab-panel {
  @apply h-full;
  @apply border rounded-md px-6 py-2;
  border-color: rgba(255, 255, 255, 0.07);
}
.array-list-add {
  @apply rounded-full h-6 w-6 leading-6 bg-gray-700 ml-auto text-white z-1;
}
.array-list-item-move-up {
  display: none;
}
.array-list-item-move-down {
  display: none;
}
.array-list-no-data {
  @apply p-4 italic rounded-md;
  background: rgba(255, 255, 255, 0.36);
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}
.dark .array-list-no-data {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.2);
}
.wrapper {
  @apply flex py-2;
}
.wrapper p {
  @apply px-2 text-sm;
}
.wrapper input {
  @apply w-1/2;
}
.wrapper input, .wrapper select {
  @apply dark:text-white !important;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(10px);
}
.dark .wrapper input, .dark .wrapper select {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.22);
}
.wrapper input:not([type=checkbox]):read-only {
  @apply bg-gray-200 bg-opacity-70 dark:bg-gray-800 text-gray-500 !important;
}
.array-list-legend {
  margin-bottom: 0;
}
.description {
  padding-bottom: 0;
}
</style>
