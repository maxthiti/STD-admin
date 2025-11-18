<template>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">สถิติรายวัน</h2>
                <div class="h-80">
                    <canvas ref="barChartRef"></canvas>
                </div>
            </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">สัดส่วนผู้ใช้</h2>
                <div class="h-80 flex items-center justify-center">
                    <canvas ref="pieChartRef"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    centerDate: {
        type: Date,
        default: () => new Date()
    }
})

const barChartRef = ref(null)
const pieChartRef = ref(null)
let barChart = null
let pieChart = null

onMounted(async () => {
    const Chart = (await import('chart.js/auto')).default

    if (barChartRef.value) {
        barChart = new Chart(barChartRef.value, {
            type: 'bar',
            data: {
                labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
                datasets: [
                    {
                        label: 'เข้า',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'ออก',
                        data: [45, 49, 60, 71, 46, 45, 30],
                        backgroundColor: 'rgba(255, 159, 64, 0.5)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    }

    if (pieChartRef.value) {
        pieChart = new Chart(pieChartRef.value, {
            type: 'pie',
            data: {
                labels: ['อาจารย์', 'นักเรียน', 'ผู้ปกครอง', 'แขก'],
                datasets: [{
                    label: 'จำนวน',
                    data: [300, 850, 75, 25],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: false
                    }
                }
            }
        })
    }
})

onUnmounted(() => {
    if (barChart) barChart.destroy()
    if (pieChart) pieChart.destroy()
})
</script>

<style scoped></style>
