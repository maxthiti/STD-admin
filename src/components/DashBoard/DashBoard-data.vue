<template>
    <div class="space-y-4">
        <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">สรุปรายวัน</h3>
            <div class="flex items-center gap-2">
                <input type="date" v-model="selectedDate" class="input input-sm input-bordered" @change="fetchDaily" />
                <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="stats shadow bg-base-100">
                <div class="stat">
                    <div class="stat-title">จำนวนนักเรียนทั้งหมด</div>
                    <div class="stat-value text-primary">{{ totals.total_students || 0 }}</div>
                </div>
            </div>
            <div class="stats shadow bg-base-100">
                <div class="stat">
                    <div class="stat-title">จำนวนครูทั้งหมด</div>
                    <div class="stat-value text-secondary">{{ totals.total_teachers || 0 }}</div>
                </div>
            </div>
            <div class="stats shadow bg-base-100">
                <div class="stat">
                    <div class="stat-title">ทั้งหมดที่เข้า</div>
                    <div class="stat-value text-purple-500">{{ totalCombined }}</div>
                    <div class="stat-desc">ประจำวันที่ {{ displayDate }}</div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body p-4">
                    <h4 class="card-title">นักเรียน</h4>
                    <div class="stats stats-vertical lg:stats-horizontal bg-base-100 w-full">
                        <div class="stat">
                            <div class="stat-title">เข้า</div>
                            <div class="stat-value text-success">{{ student.total }}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title">มาสาย</div>
                            <div class="stat-value text-warning">{{ student.late }}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title">ขาด</div>
                            <div class="stat-value text-error">{{ studentAbsent }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card bg-base-100 shadow-xl">
                <div class="card-body p-4">
                    <h4 class="card-title">ครู</h4>
                    <div class="stats stats-vertical lg:stats-horizontal bg-base-100 w-full">
                        <div class="stat">
                            <div class="stat-title">เข้า</div>
                            <div class="stat-value text-info">{{ teacher.total }}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title">มาสาย</div>
                            <div class="stat-value text-warning">{{ teacher.late }}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-title">ขาด</div>
                            <div class="stat-value text-warning">{{ teacherAbsent }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import reportApi from '../../api/report.js'

const emit = defineEmits(['dateChange'])

const selectedDate = ref(new Date().toISOString().split('T')[0])
const loading = ref(false)

const totals = ref({ total_students: 0, total_teachers: 0 })
const student = ref({ total: 0, late: 0 })
const teacher = ref({ total: 0, late: 0 })

const displayDate = computed(() => {
    const d = new Date(selectedDate.value)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}/${mm}/${yyyy}`
})

const totalCombined = computed(() => (student.value.total || 0) + (teacher.value.total || 0))
const studentAbsent = computed(() => Math.max((totals.value.total_students || 0) - (student.value.total || 0), 0))
const teacherAbsent = computed(() => Math.max((totals.value.total_teachers || 0) - (teacher.value.total || 0), 0))

async function fetchDaily() {
    loading.value = true
    emit('dateChange', selectedDate.value)
    try {
        const start = selectedDate.value
        const end = selectedDate.value
        const res = await reportApi.getDailyStats(start, end)
        if (res.message === 'Success' && res.data) {
            totals.value.total_students = res.data.total_students || 0
            totals.value.total_teachers = res.data.total_teachers || 0
            const list = res.data.daily_stats || []
            const stu = list.find(x => x.role === 'student') || { total: 0, late: 0 }
            const tea = list.find(x => x.role === 'teacher') || { total: 0, late: 0 }
            student.value = { total: stu.total || 0, late: stu.late || 0 }
            teacher.value = { total: tea.total || 0, late: tea.late || 0 }
        }
    } catch (e) {
        console.error('Daily summary error', e)
        totals.value = { total_students: 0, total_teachers: 0 }
        student.value = { total: 0, late: 0 }
        teacher.value = { total: 0, late: 0 }
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchDaily()
})
</script>

<style scoped></style>
