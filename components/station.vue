<template>
  <div>
    <div class="border border-black">
      <div class="relative bg-blue-800 border border-white">
        <div v-for="moduleRow in modules">
          <div class="flex">
            <div v-for="solarModule in moduleRow" class="solar-module flex flex-col module w-12 p-1 text-white">
              <span class="flex justify-center items-center border border-white bg-blue-500 text-center align-middle">
                Atual
              </span>
              <span class="flex justify-center items-center border border-white bg-blue-500 text-center align-middle">
                {{ solarModule }}
              </span>
            </div>
          </div>
        </div>
        <div :style="styleSun" class="absolute left-0 top-0 w-full h-full flex justify-center items-center">
          <div class="w-8 h-8 opacity-50 rounded-full bg-yellow-400 border-2 border-yellow-800">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import type { CSSProperties } from 'vue';

const props = defineProps<{
  modules: string[][],
  sunPosition: { altitude: number, azimuth: number }
}>()

const { modules, sunPosition } = props;

const moduleAngle = -23;

const correctedAzimuth = computed(() => sunPosition.azimuth - moduleAngle)

const styleSun = computed(() => {
  const translate = (sunPosition.altitude / 180) * 100;

  return {
    transform: `rotate(${correctedAzimuth.value}deg) translateY(-${translate + 40}%) `
  } as CSSProperties;
})
</script>

<style lang="postcss">
.solar-module span {
  aspect-ratio: 1/0.8;
  font-size: 8px;
  text-align: center;
}
</style>