<template>
  <div class="flex flex-col justify-center items-center">
    <!-- <Station :modules="modules" :sun-position="sunPosition" /> -->
    <LiveData :generation-power="data!.plant.generationPower" :last-update-date="data!.plant.lastUpdateDate"
      :is-operating="data!.plant.operating" :inverters="(data!.inverters as unknown as InverterData[])" />
    <History class="mt-8" />
  </div>
  <!-- <pre>{{ data }}</pre> -->
  <!-- <div>
    <NuxtWelcome />
  </div> -->
</template>

<script setup lang="ts">
import type { InverterData } from './server/api/solarman/types';

// TODO: Move this fetch to live_data.vue
const { data } = await useFetch('/api/real_time')

const modules = computed(() => [
  ['1', '2', '5', '7'],
  ['3', '4', '6', '8'],
  []
]);

const sunPosition = computed(() => data.value!.sun);
</script>