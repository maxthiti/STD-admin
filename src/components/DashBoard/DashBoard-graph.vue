<template>
    <div class="space-y-6">
        <div class="grid grid-cols-1">
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <div class="flex items-center justify-between">
                        <h2 class="card-title flex items-center gap-2">สถิติรายวัน
                            <div class="flex items-center gap-1">
                                <span class="badge badge-outline text-xs">{{ weekLabel }}</span>
                            </div>
                        </h2>
                        <router-link to="/home/report/stats" class="btn btn-xs btn-ghost">
                            ดูเพิ่มเติม →
                        </router-link>
                    </div>
                    <div class="h-80">
                        <canvas ref="barChartRef"></canvas>
                    </div>
                </div>
            </div>
        </div>
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

function navigateWeek(direction) {
    const monday = getMonday(currentWeekStart.value)
    monday.setDate(monday.getDate() + (direction * 7))
    currentWeekStart.value = monday
    fetchDailyStats()
}

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

            const studentData = rawStats.value.find(s => s.role === 'student' && s.date === selectedDate.value)
            const teacherData = rawStats.value.find(s => s.role === 'teacher' && s.date === selectedDate.value)
            const studentTotal = studentData ? studentData.total : 0
            const teacherTotal = teacherData ? teacherData.total : 0

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
    const teacherOntime = []
    const teacherLate = []

    labelsISO.forEach(date => {
        const stu = map[`student_${date}`]
        const tea = map[`teacher_${date}`]
        const stuLate = stu ? stu.late : 0
        const stuTotal = stu ? stu.total : 0
        const teaLate = tea ? tea.late : 0
        const teaTotal = tea ? tea.total : 0
        studentLate.push(stuLate)
        studentOntime.push(Math.max(stuTotal - stuLate, 0))
        teacherLate.push(teaLate)
        teacherOntime.push(Math.max(teaTotal - teaLate, 0))
    })

    const weekdayLabels = labelsISO.map(d => {
        const dt = new Date(d)
        const dayIdx = dt.getDay()
        const thaiDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
        return thaiDays[dayIdx]
    })

    const { primary, primaryLight, secondary, secondaryLight } = getThemeColors()
    const red = 'rgba(220, 38, 38, 0.9)'
    const redLight = 'rgba(248, 113, 113, 0.9)'

    barChart = new ChartLib(barChartRef.value, {
        type: 'bar',
        data: {
            labels: weekdayLabels,
            datasets: [
                { label: 'นักเรียน (ตรงเวลา)', data: studentOntime, backgroundColor: primary, borderColor: primary, stack: 'student' },
                { label: 'นักเรียน (สาย)', data: studentLate, backgroundColor: red, borderColor: red, stack: 'student' },
                { label: 'ครู (ตรงเวลา)', data: teacherOntime, backgroundColor: secondary, borderColor: secondary, stack: 'teacher' },
                { label: 'ครู (สาย)', data: teacherLate, backgroundColor: redLight, borderColor: redLight, stack: 'teacher' }
            ]
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
                }
            },
            scales: {
                x: { stacked: true },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        callback: (v) => Math.round(v)
                    }
                }
            }
        }
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
    window.Chart = Chart
    selectedDate.value = props.date
    const date = new Date(props.date)
    const monday = getMonday(date)
    currentWeekStart.value = monday
    fetchDailyStats()
})

onUnmounted(() => {
    if (barChart) barChart.destroy()
})
</script>

<style scoped></style>
