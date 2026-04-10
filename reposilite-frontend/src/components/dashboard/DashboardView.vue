<script setup>
import InstanceStatusCharts from "./InstanceStatusCharts.vue"
import StatusSnapshotsChart from "./StatusSnapshotsChart.vue"
import ResolvedRequestsChart from "./ResolvedRequestsChart.vue"

defineProps({
  selectedTab: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="container mx-auto pt-6 px-15 pb-10 text-xs rounded-3xl glass-panel <sm:(px-2 rounded-2xl)">
    <div class="flex">
      <h1 class="page-title pb-2 text-lg">Instance status</h1>
      <span class="accent-icon mt-0.7 ml-3">i</span>
    </div>
    <div class="section-divider"></div>
    <InstanceStatusCharts :selectedTab="selectedTab" />
    <StatusSnapshotsChart :selectedTab="selectedTab" />
    <ResolvedRequestsChart />
  </div>
</template>
