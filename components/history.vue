<template>
  <div class="flex flex-col w-full max-w-3xl">
    <div class="text-center">
      <span class="font-bold text-lg">Novembro / 2023</span>
    </div>
    <div class="">
      <div>
        <Line class="w-full" :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { Line } from 'vue-chartjs'
import { type ChartData, type ChartOptions } from 'chart.js'

import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, PointElement, CategoryScale, LinearScale, ChartDataLabels)

const { data } = await useFetch('/api/history')

const chartData = computed(() => {
  return {
    labels: data.value?.map(d => d.day),
    datasets: [
      {
        type: 'line',
        label: 'kWh',
        backgroundColor: 'rgba(242, 151, 75, 0.7)',
        borderColor: 'rgba(242, 151, 75, 0.7)',
        data: data.value?.map(d => d.generationValue),
        fill: false,
        order: 0,
      }
    ]
  } as ChartData<"line">;
})

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      },
      datalabels: {
        color: '#000000',
        anchor: 'end',
        align: 'top',
        font: {
          size: 10
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#000000',
          font: {
            size: 14,
            weight: 400
          },
          maxRotation: 0,
        },
        title: {
          display: true,
          align: 'start',
          text: 'Dia',
          color: '#000000',
          font: {
            size: 16,
            weight: 600
          },
        }
      },
      y: {
        ticks: {
          color: '#000000',
          font: {
            size: 14,
            weight: 400
          },
          maxRotation: 0,
        },
        title: {
          display: true,
          align: 'start',
          text: 'kWh',
          color: '#000000',
          font: {
            size: 16,
            weight: 600
          },
        }
      }
    }
  } as ChartOptions<"line">;
});
</script>