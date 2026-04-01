<template>
    <div v-if="visible" class="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-base-100 rounded-lg shadow-lg w-full max-w-2xl p-6 relative m-4">
            <button class="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost" @click="$emit('close')">✕</button>
            <div class="flex items-center gap-4 mb-4">
                <div class="avatar">
                    <div class="w-16 h-16 rounded-full">
                        <img v-if="teacher.picture" :src="getPictureUrl(teacher.picture)" :alt="teacher.name"
                            class="w-full h-full object-cover" />
                        <div v-else
                            class="w-full h-full bg-primary text-primary-content flex items-center justify-center">
                            <span class="text-lg font-semibold">{{ getInitials(teacher.name) }}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="font-bold text-lg">{{ teacher.name }}</div>
                    <div class="text-sm text-base-content/70">รหัส: {{ teacherCode }}</div>
                    <div class="text-sm">แผนก: {{ teacher.department }} | ตำแหน่ง: {{ teacher.position }}</div>
                </div>
            </div>
            <div class="mb-2 font-semibold flex items-center gap-2">
                <span>ปฏิทินการมาโรงเรียน</span>
                <select v-model="selectedMonth" class="select select-bordered select-xs">
                    <option v-for="(m, idx) in monthsTH" :key="idx" :value="idx">{{ m }}</option>
                </select>
                <select v-model="selectedYear" class="select select-bordered select-xs">
                    <option v-for="y in yearOptions" :key="y" :value="y">{{ y + 543 }}</option>
                </select>
            </div>
            <div class="overflow-x-auto">
                <table class="table table-xs w-full text-center">
                    <thead>
                        <tr>
                            <th v-for="d in daysShort" :key="d">{{ d }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(week, widx) in calendar" :key="widx">
                            <td v-for="(day, didx) in week" :key="didx">
                                <div v-if="day">
                                    <span
                                        :class="getDayClass(day) + ' inline-block w-7 h-7 rounded-full leading-7 cursor-pointer'"
                                        v-if="getAttendanceMap[dateToStr(day)] && getAttendanceMap[dateToStr(day)].timeStamps && getAttendanceMap[dateToStr(day)].timeStamps.length > 0"
                                        @click="openAttendanceInfo(day)">
                                        {{ day.getDate() }}
                                    </span>
                                    <span :class="getDayClass(day) + ' inline-block w-7 h-7 rounded-full leading-7'"
                                        v-else-if="getHolidayTitle(day)" :title="getHolidayTitle(day)">
                                        {{ day.getDate() }}
                                    </span>
                                    <span :class="getDayClass(day) + ' inline-block w-7 h-7 rounded-full leading-7'"
                                        v-else>
                                        {{ day.getDate() }}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="flex gap-4 mt-4 text-xs">
                <div class="flex items-center gap-1"><span class="inline-block w-4 h-4 rounded-full bg-blue-500"></span>
                    มาโรงเรียน</div>
                <div class="flex items-center gap-1"><span
                        class="inline-block w-4 h-4 rounded-full bg-yellow-400"></span> มาสาย</div>
                <div class="flex items-center gap-1"><span class="inline-block w-4 h-4 rounded-full bg-red-500"></span>
                    ไม่ได้สแกน</div>
                <div class="flex items-center gap-1"><span class="inline-block w-4 h-4 rounded-full bg-gray-400"></span>
                    วันหยุด</div>
            </div>
            <AttendanceInfo ref="attendanceInfoRef" :user="teacher" :attendance="selectedAttendanceInfo"
                type="teacher" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import reportApi from '../../api/report'
import holidaysApi from '../../api/holidays'
import AttendanceInfo from '../AttendanceInfo.vue'

const props = defineProps({
    teacher: { type: Object, required: true },
    visible: { type: Boolean, default: false },
})

const today = new Date()
const monthsTH = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
const daysShort = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

const selectedMonth = ref(today.getMonth())
const selectedYear = ref(today.getFullYear())
const yearOptions = computed(() => {
    const current = today.getFullYear()
    return [current - 1, current, current + 1]
})

const teacherCode = computed(() => props.teacher.code || props.teacher.userid || props.teacher.id || '-')

const attendances = ref([])
const holidays = ref([])
const loading = ref(false)
const attendanceInfoRef = ref(null)
const selectedAttendanceInfo = ref(null)

const calendar = computed(() => {
    const year = selectedYear.value
    const month = selectedMonth.value
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const weeks = []
    let week = new Array(firstDay.getDay()).fill(null)
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(year, month, d)
        week.push(date)
        if (week.length === 7) {
            weeks.push(week)
            week = []
        }
    }
    if (week.length) {
        while (week.length < 7) week.push(null)
        weeks.push(week)
    }
    return weeks
})

const getPictureUrl = (pic) => {
    if (!pic) return ''
    if (pic.startsWith('http://') || pic.startsWith('https://')) return pic
    return `${import.meta.env.VITE_IMG_PROFILE_URL || ''}${pic}`
}

const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 3) {
        return (parts[1][0] || '') + (parts[2][0] || '')
    }
    if (parts.length === 2) {
        return (parts[0][0] || '') + (parts[1][0] || '')
    }
    return parts[0][0] || '?'
}

const getAttendanceMap = computed(() => {
    const map = {}
    attendances.value.forEach(a => {
        map[a.date] = a
    })
    return map
})

const dateToStr = (dateObj) => {
    if (!dateObj) return ''
    return (
        dateObj.getFullYear() +
        '-' + String(dateObj.getMonth() + 1).padStart(2, '0') +
        '-' + String(dateObj.getDate()).padStart(2, '0')
    )
}

const openAttendanceInfo = (dateObj) => {
    const dstr = dateToStr(dateObj)
    const att = getAttendanceMap.value[dstr]
    if (att && att.timeStamps && att.timeStamps.length > 0) {
        selectedAttendanceInfo.value = att
        attendanceInfoRef.value.open()
    }
}

const getDayClass = (dateObj) => {
    if (!dateObj) return ''
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    if (dateObj > now) return ''
    const dstr = dateObj.getFullYear() + '-' + String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + String(dateObj.getDate()).padStart(2, '0')
    const att = getAttendanceMap.value[dstr]
    if (att && att.timeStamps && att.timeStamps.length > 0) {
        const firstTime = att.timeStamps[0].timestamp.slice(11, 16)
        if (firstTime > '08:01') return 'bg-yellow-400 text-black'
        return 'bg-blue-500 text-white'
    }
    const isHoliday = holidays.value.some(h => h.date === dstr)
    if (isHoliday) return 'bg-gray-400 text-white'
    return 'bg-red-500 text-white'
}

const fetchAttendance = async () => {
    if (!props.teacher) return
    loading.value = true
    try {
        const year = selectedYear.value
        const month = selectedMonth.value
        const start = `${year}-${String(month + 1).padStart(2, '0')}-01`
        const end = `${year}-${String(month + 1).padStart(2, '0')}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, '0')}`
        const res = await reportApi.getAttendanceReport({
            start,
            end,
            role: 'teacher',
            userid: props.teacher.userid || props.teacher.id,
            page: 1,
            limit: 1,
        })
        if (res.data && res.data.length > 0) {
            attendances.value = res.data[0].attendances || []
        } else {
            attendances.value = []
        }
        const holidaysRes = await holidaysApi.getHolidaysByRange(start, end)
        holidays.value = Array.isArray(holidaysRes.data) ? holidaysRes.data : []
    } catch (e) {
        attendances.value = []
        holidays.value = []
    } finally {
        loading.value = false
    }
}

function getHolidayTitle(dateObj) {
    if (!dateObj) return ''
    const dstr = dateObj.getFullYear() + '-' + String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + String(dateObj.getDate()).padStart(2, '0')
    const holiday = holidays.value.find(h => h.date === dstr)
    return holiday ? holiday.summary : ''
}


watch([
    () => props.teacher,
    selectedMonth,
    selectedYear,
    () => props.visible
], ([teacher, m, y, vis], [oldTeacher]) => {
    if (teacher !== oldTeacher) {
        selectedMonth.value = today.getMonth()
        selectedYear.value = today.getFullYear()
    }
    if (vis) fetchAttendance()
})

onMounted(() => {
    if (props.visible) fetchAttendance()
})
</script>

<style scoped>
.table-xs td,
.table-xs th {
    padding: 0.25rem;
}

.fixed {
    margin: 0 !important;
}
</style>
