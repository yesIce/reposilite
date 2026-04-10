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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { property } from '../../helpers/vue-extensions'

defineProps({
  parentPath: property(String, true)
})

const route = useRoute()

const breadcrumbs = computed(() => {
  const parts = route.path.split('/').filter(Boolean)

  return parts.map((name, index) => ({
    link: '/' + parts.slice(0, index + 1).join('/'),
    name: index === parts.length - 1 ? name : name + '/'
  }))
})
</script>

<template>
  <div class="pb-3">
    <div class="breadcrumb-shell">
      <router-link to="/" class="breadcrumb-root select-none">Repository</router-link>
      <span class="breadcrumb-divider select-none">/</span>
      <span class="select-text">
        <router-link v-for="crumb of breadcrumbs" :key="crumb.link" :to="crumb.link" class="breadcrumb-link">
          <span>{{ crumb.name }}</span>
        </router-link>
      </span>
      <router-link :to="parentPath" class="breadcrumb-up select-none" title="Go to parent directory">
        ⤴
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.breadcrumb-shell {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: var(--bg-panel-soft);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  padding: 0.45rem 0.7rem;
  color: var(--text-muted);
  font-weight: 600;
}

.breadcrumb-root {
  color: var(--text-main);
}

.breadcrumb-divider {
  color: var(--text-note);
}

.breadcrumb-link {
  color: var(--text-muted);
}

.breadcrumb-link:hover {
  color: #ffb800;
  transition: color 180ms ease;
}

.breadcrumb-up {
  margin-left: 0.2rem;
  color: var(--text-note);
  font-size: 1.05rem;
}

.breadcrumb-up:hover {
  color: #ffb800;
}

</style>
