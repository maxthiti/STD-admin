<template>
    <div class="space-y-6">
        <transition name="slide-up">
            <div v-show="showGraphCard" class="grid grid-cols-1">
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                        <div class="flex items-center justify-between lg:flex gap-2 hidden lg:flex">
                            <h2 class="card-title flex items-center gap-2">สถิติรายวัน
                                <div class="flex items-center gap-1">
                                    <span class="badge badge-outline text-xs">{{ weekLabel }}</span>
                                </div>
                            </h2>
                            <router-link to="/home/report/stats" class="btn btn-xs btn-ghost">
                                ดูเพิ่มเติม →
                            </router-link>
                        </div>
                        <div class="flex items-center justify-between gap-2 lg:hidden">
                            <div class="flex flex-col items-start">
                                <span class="font-bold text-lg leading-tight">สถิติ</span>
                                <span class="font-bold text-lg leading-tight">รายวัน</span>
                            </div>
                            <div class="flex-1 flex justify-center">
                                <span class="px-4 py-1 border rounded-full text-xs font-medium bg-base-100 shadow-sm">{{
                                    weekLabel }}</span>
                            </div>
                            <router-link to="/home/report/stats" class="btn btn-xs btn-ghost whitespace-nowrap">
                                ดูเพิ่มเติม →
                            </router-link>
                        </div>
                        <div class="h-80">
                            <canvas ref="barChartRef"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import reportApi from '../../api/report.js'

const props = defineProps({
    date: {
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    }
})

const barChartRef = ref(null)
let barChart = null

const currentWeekStart = ref(new Date())
const totals = ref({ total_students: 0, total_teachers: 0 })
const rawStats = ref([])
const strangerCount = ref(0)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const loading = ref(false)
const showGraphCard = ref(false)

function getUtilityBgColor(className) {
    const el = document.createElement('div')
    el.className = className
    el.style.display = 'none'
    document.body.appendChild(el)
    const color = getComputedStyle(el).backgroundColor
    document.body.removeChild(el)
    return color || 'rgba(0,0,0,1)'
}

function getThemeColors() {
    const primary = getUtilityBgColor('bg-primary')
    const primaryLight = getUtilityBgColor('bg-primary/70')
    const secondary = getUtilityBgColor('bg-secondary')
    const secondaryLight = getUtilityBgColor('bg-secondary/70')
    return { primary, primaryLight, secondary, secondaryLight }
}

function formatDateISO(d) {
    return d.toISOString().split('T')[0]
}

function formatDateThai(date) {
    const d = new Date(date)
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
}

function getMonday(d) {
    const date = new Date(d)
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(date.setDate(diff))
}

function getSunday(monday) {
    const date = new Date(monday)
    date.setDate(date.getDate() + 6)
    return date
}

const weekLabel = computed(() => {
    const monday = getMonday(currentWeekStart.value)
    const sunday = getSunday(monday)
    return `${formatDateThai(monday)} - ${formatDateThai(sunday)}`
})

async function fetchDailyStats() {
    loading.value = true
    try {
        const monday = getMonday(currentWeekStart.value)
        const sunday = getSunday(monday)
        const start = formatDateISO(monday)
        const end = formatDateISO(sunday)

        const response = await reportApi.getDailyStats(start, end)
        if (response.message === 'Success') {
            totals.value.total_students = response.data.total_students || 0
            totals.value.total_teachers = response.data.total_teachers || 0
            rawStats.value = response.data.daily_stats || []

            await fetchStrangerData()
            buildBarChart(start, end)
        }
    } catch (e) {
        console.error('Daily stats error', e)
    } finally {
        loading.value = false
    }
}

async function fetchStrangerData() {
    try {
        const params = {
            start: `${selectedDate.value} 00:00:00`,
            end: `${selectedDate.value} 23:59:59`,
            device_sn: '',
            page: 1,
            limit: 1
        }
        const response = await reportApi.getStrangerReport(params)
        if (response.message === 'Success') {
            strangerCount.value = response.total_items || 0
        }
    } catch (e) {
        console.error('Stranger data error', e)
        strangerCount.value = 0
    }
}

function buildBarChart(start, end) {
    if (!barChartRef.value) return
    if (barChart) barChart.destroy()

    const ChartLib = window.Chart
    if (!ChartLib) return

    const startDate = new Date(start)
    const labelsISO = []
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate)
        d.setDate(startDate.getDate() + i)
        labelsISO.push(d.toISOString().split('T')[0])
    }

    const map = {}
    rawStats.value.forEach(s => { map[`${s.role}_${s.date}`] = s })


    const studentOntime = []
    const studentLate = []
    const studentNotScan = []
    const teacherOntime = []
    const teacherLate = []
    const teacherNotScan = []

    labelsISO.forEach(date => {
        const stu = map[`student_${date}`]
        const tea = map[`teacher_${date}`]
        // นักเรียน
        const stuLate = stu ? stu.late : 0
        const stuOntime = stu ? stu.ontime ?? Math.max((stu.total ?? 0) - (stu.late ?? 0) - (stu.not_scan ?? 0), 0) : 0
        // คำนวณไม่ได้สแกน = total_students - stu.total
        const stuTotal = stu ? stu.total ?? 0 : 0
        const stuNotScan = Math.max((totals.value.total_students ?? 0) - stuTotal, 0)
        studentOntime.push(stuOntime)
        studentLate.push(stuLate)
        studentNotScan.push(stuNotScan)
        // ครู
        const teaLate = tea ? tea.late : 0
        const teaOntime = tea ? tea.ontime ?? Math.max((tea.total ?? 0) - (tea.late ?? 0) - (tea.not_scan ?? 0), 0) : 0
        const teaTotal = tea ? tea.total ?? 0 : 0
        const teaNotScan = Math.max((totals.value.total_teachers ?? 0) - teaTotal, 0)
        teacherOntime.push(teaOntime)
        teacherLate.push(teaLate)
        teacherNotScan.push(teaNotScan)
    })

    const weekdayLabels = labelsISO.map(d => {
        const dt = new Date(d)
        const dayIdx = dt.getDay()
        const thaiDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
        return thaiDays[dayIdx]
    })


    const { primary, primaryLight, secondary, secondaryLight } = getThemeColors()
    const black = 'rgba(0,0,0,0.85)'
    const red = 'rgba(239,68,68,0.85)'
    const blue = 'rgba(59,130,246,0.7)'

    const isTeacher = localStorage.getItem('residentRole') === 'teacher'
    let datasets = [
        { label: 'นักเรียน (ตรงเวลา)', data: studentOntime, backgroundColor: primary, borderColor: primary },
        { label: 'นักเรียน (สาย)', data: studentLate, backgroundColor: black, borderColor: black },
        { label: 'นักเรียน (ไม่ได้สแกน)', data: studentNotScan, backgroundColor: red, borderColor: red }
    ]
    if (!isTeacher) {
        datasets.push(
            { label: 'ครู (ตรงเวลา)', data: teacherOntime, backgroundColor: secondary, borderColor: secondary },
            { label: 'ครู (สาย)', data: teacherLate, backgroundColor: black, borderColor: black },
            { label: 'ครู (ไม่ได้สแกน)', data: teacherNotScan, backgroundColor: red, borderColor: red }
        )
    }

    barChart = new ChartLib(barChartRef.value, {
        type: 'bar',
        data: {
            labels: weekdayLabels,
            datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        title: (items) => {
                            const idx = items[0]?.dataIndex ?? 0
                            const iso = labelsISO[idx]
                            return formatDateThai(iso)
                        },
                        label: (ctx) => {
                            const v = ctx.parsed.y || 0
                            return `${ctx.dataset.label}: ${Math.round(v)}`
                        },
                        footer: (items) => {
                            const total = items.reduce((sum, it) => sum + it.parsed.y, 0)
                            return 'รวม: ' + Math.round(total)
                        }
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    color: '#222',
                    font: { weight: 'bold', size: 12 },
                    formatter: (value) => value > 0 ? value : ''
                }
            },
            scales: {
                x: { stacked: false },
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        callback: (v) => Math.round(v)
                    }
                }
            }
        },
        plugins: [window.ChartDataLabels]
    })
}

watch(() => props.date, (newDate) => {
    selectedDate.value = newDate
    const date = new Date(newDate)
    const monday = getMonday(date)
    currentWeekStart.value = monday
    fetchDailyStats()
})

onMounted(async () => {
    const Chart = (await import('chart.js/auto')).default
    const ChartDataLabels = (await import('chartjs-plugin-datalabels')).default
    window.Chart = Chart
    window.ChartDataLabels = ChartDataLabels
    selectedDate.value = props.date
    const date = new Date(props.date)
    const monday = getMonday(date)
    currentWeekStart.value = monday
    fetchDailyStats()

    showGraphCard.value = false
    setTimeout(() => {
        showGraphCard.value = true
    }, 100)
})

onUnmounted(() => {
    if (barChart) barChart.destroy()
})
</script>

<style scoped>
.slide-up-enter-active {
    transition: all 1.1s cubic-bezier(0.23, 1, 0.32, 1);
}

.slide-up-leave-active {
    transition: all 1.1s cubic-bezier(0.23, 1, 0.32, 1);
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateY(60px);
}

.slide-up-leave-to {
    opacity: 0;
    transform: translateY(60px);
}
</style>
