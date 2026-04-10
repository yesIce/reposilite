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
import { computed, ref, watchEffect, defineAsyncComponent } from 'vue'
import { useSession } from '../store/session'
import useQualifier from '../store/qualifier'
import DefaultHeader from '../components/header/DefaultHeader.vue'
import FileBrowserView from '../components/browser/FileBrowserView.vue'
import {Tabs, Tab, TabPanels, TabPanel} from 'vue3-tabs'
import { property } from '../helpers/vue-extensions'

const ConsoleView = defineAsyncComponent(() => import('../components/console/ConsoleView.vue'))
const DashboardView = defineAsyncComponent(() => import('../components/dashboard/DashboardView.vue'))
const SettingsView = defineAsyncComponent(() => import('../components/settings/SettingsView.vue'))

defineProps({
  qualifier: property(Object, true)
})

const listOfTabs = [
  { name: 'Overview', label: 'Repository', manager: false },
  { name: 'Dashboard', label: 'Dashboard', manager: true },
  { name: 'Console', label: 'Console', manager: true },
  { name: 'Settings', label: 'Settings', manager: true },
]

const { isManager } = useSession()
const { redirectTo } = useQualifier()

const menuTabs = computed(() => {
  return listOfTabs
    .filter(entry => !entry?.manager || isManager.value)
})

const tabLabel = (tabName) =>
  listOfTabs.find(entry => entry.name === tabName)?.label ?? tabName

const isOverviewTab = (tabName) =>
  tabName === 'Overview'

const isDashboardTab = (tabName) =>
  tabName === 'Dashboard'

const tabButtonClass = (tabName) => ({
  dashboard: isDashboardTab(tabName),
  'overview-tab': isOverviewTab(tabName)
})

const selectedTab = ref(localStorage.getItem('selectedTab') || 'Overview')

watchEffect(() => {
  localStorage.setItem('selectedTab', selectedTab.value)
})

const createTabClick = (newTab) => {
  if (newTab == 'Overview') {
    redirectTo('/')
  }
}

const selectHomepage = () => 
  selectedTab.value = 'Overview'
</script>

<template>
  <div>
    <DefaultHeader :logoClickCallback="selectHomepage" />
    <div class="overflow-y-visible">
      <div class="container mx-auto <sm:px-0">
        <Tabs 
          v-model="selectedTab"
          @update:modelValue="createTabClick"
        >
          <template 
            v-for="(tab, i) in menuTabs" 
            :key="`menu${i}`"
          >
            <Tab
              class="item font-normal <sm:w-1/4"
              :class="tabButtonClass(tab.name)"
              :val="tab.name"
              :label="tabLabel(tab.name)"
              :indicator="true"
            />
          </template>
        </Tabs>
      </div>
      <hr class="border-yellow-400 border-opacity-20">
      <div class="overflow-auto">
        <TabPanels v-model="selectedTab">
          <TabPanel :val="'Overview'">
            <FileBrowserView v-if="selectedTab == 'Overview'" :qualifier="qualifier" ref=""/>
          </TabPanel>
          <TabPanel :val="'Dashboard'" v-show="isManager">
            <DashboardView v-if="selectedTab == 'Dashboard'" :selectedTab="selectedTab" />
          </TabPanel>
          <TabPanel :val="'Console'" v-show="isManager">
            <ConsoleView v-if="selectedTab == 'Console'" :selectedTab="selectedTab" />
          </TabPanel>
           <TabPanel :val="'Settings'" v-show="isManager">
            <SettingsView v-if="selectedTab == 'Settings'" :selectedTab="selectedTab" />
          </TabPanel>
        </TabPanels>
      </div>
    </div>
  </div>
</template>

<style>
.tabs .tab {
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.tabs .item:hover {
  @apply text-yellow-400;
  background-color: rgba(255, 196, 0, 0.08);
  transition: color 200ms ease, background-color 200ms ease;
}
.tabs .overview-tab:hover {
  background-color: rgba(255, 184, 0, 0.2);
}
  .dashboard {
    @media (max-width: 640px) {
      padding-left: 0px !important;
    }
}
.dashboard .tab {
  @media (max-width: 640px){
    padding-left: 15px !important;
  }
}
</style>

<style scoped>
.item {
  @apply px-2;
  @apply pb-1;
  @apply pt-2;
  @apply cursor-pointer;
  color: var(--text-main);
  background: var(--bg-panel);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  min-height: 40px;
}
.selected {
  border-color: rgba(255, 184, 0, 0.65);
  @apply text-yellow-400;
  background: rgba(255, 196, 0, 0.13);
}
.overview-tab {
  background: linear-gradient(180deg, rgba(255, 184, 0, 0.16) 0%, rgba(255, 184, 0, 0.06) 100%);
  border-color: rgba(255, 184, 0, 0.35);
}
</style>
