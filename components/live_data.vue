<template>
  <div class="flex">
    <div class="flex flex-col">
      <div class="flex justify-center flex-1">
        <div class="rounded-sm shadow-lg p-4 m-4 text-center flex-1 min-w-fit">
          <span class="block text-lg font-bold">Produção atual</span>
          <span v-if="areAllOffline" class="block text-3xl text-blue-800 font-bold">{{ generationPower }} W</span>
          <span v-else class="block text-xl text-red-600 font-bold">Desligada</span>
        </div>
        <div class="rounded-sm shadow-lg p-4 m-4 text-center flex-1 min-w-fit">
          <span class="block text-lg font-bold">Produção diária</span>
          <span class="block text-3xl text-green-800 font-bold">{{ totalGeneratedDay }} kWh</span>
        </div>
      </div>
      <div class="rounded-sm shadow-lg p-2 mx-4 my-0 text-center flex-1">
        <span class="block text-xs pt-2">{{ lastUpdateAtString }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InverterData } from '~/server/api/solarman/types';

const props = defineProps<{
  generationPower: number,
  lastUpdateDate: string,
  isOperating: boolean
  inverters: InverterData[]
}>()

const { generationPower, lastUpdateDate, isOperating, inverters } = props;

const lastUpdateAtString = computed(() => {
  const now = new Date().valueOf();
  const lastUpdate = new Date(lastUpdateDate);
  const diff = now - lastUpdate.valueOf();

  if (diff < 60000) { // Less than a minute
    return `Atualizado ${diff / 1000} segundos atrás`;
  }

  if (diff < 3600000) { // Less than an hour
    return `Atualizado ${Math.floor((diff / 1000) / 60)} minutos atrás`;
  }

  return `Atualizado ${Math.floor((diff / 1000) / 60 / 60)} horas atrás`;
});

const totalGeneratedDay = computed(() => {
  const dailyTotal = inverters.reduce(((acc, inData) => { return acc + parseFloat(inData.dailyProduction) }), 0);
  return dailyTotal;
})

const areAllOffline = computed(() => {
  return inverters.filter((i) => i.state != 3).length != 0;
})
</script>