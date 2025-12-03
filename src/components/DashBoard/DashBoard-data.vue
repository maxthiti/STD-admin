<template>
    <div class="space-y-4">
        <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">สรุปรายวัน</h3>
            <div class="flex items-center gap-2">
                <input type="date" v-model="selectedDate" class="input input-sm input-bordered" @change="fetchDaily" />
                <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            </div>
        </div>

        <dialog ref="attendanceModal" class="modal" @close="resetAttendancePage">
            <div class="modal-box max-w-7xl">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 class="font-bold text-lg mb-4">รายการเข้าเรียน{{ attendanceRole === 'teacher' ? 'ครู' : 'นักเรียน'
                    }} วันที่ {{ displayDate }}</h3>

                <div class="flex gap-2 mb-4" v-if="attendanceRole === 'student'">
                    <div v-if="residentRole !== 'teacher'" class="form-control">
                        <label class="label py-1">
                            <span class="label-text text-sm font-medium">ชั้นปี</span>
                        </label>
                        <select v-model="attendanceGrade" class="select select-sm select-bordered w-full"
                            @change="handleGradeChange">
                            <option value="">ทั้งหมด</option>
                            <option v-for="grade in availableGrades" :key="grade" :value="grade">{{ grade }}</option>
                        </select>
                    </div>
                    <div v-if="residentRole !== 'teacher'" class="form-control">
                        <label class="label py-1">
                            <span class="label-text text-sm font-medium">ห้อง</span>
                        </label>
                        <select v-model.number="attendanceClassroom" class="select select-sm select-bordered w-full"
                            @change="reloadAttendance" :disabled="!attendanceGrade">
                            <option :value="0">ทั้งหมด</option>
                            <option v-for="classroom in availableClassrooms" :key="classroom" :value="classroom">{{
                                classroom }}</option>
                        </select>
                    </div>
                </div>

                <AttendanceTable :data="attendanceData" :pagination="attendancePagination" @viewDetail="viewDetail"
                    @page-change="handlePageChange" />

            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>

        <dialog ref="lateModal" class="modal">
            <div class="modal-box max-w-7xl">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 class="font-bold text-lg mb-4">รายการมาสาย{{ lateRole === 'teacher' ? 'ครู' : 'นักเรียน' }} วันที่
                    {{ displayDate }}</h3>

                <LateTable :data="lateData" :pagination="latePagination" @page-change="handleLatePageChange" />
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>

        <dialog ref="missedModal" class="modal">
            <div class="modal-box max-w-7xl">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 class="font-bold text-lg mb-4">รายการขาด{{ missedRole === 'teacher' ? 'ครู' : 'นักเรียน' }} วันที่
                    {{ displayDate }}</h3>

                <MissedTable :data="missedData" :pagination="missedPagination" @page-change="handleMissedPageChange" />
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>

        <AttendanceDetail ref="detailModal" />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="stats shadow bg-base-100">
                <div class="stat group" ref="studentStatRef">
                    <div class="stat-title">จำนวนนักเรียนทั้งหมด</div>
                    <div class="stat-value text-primary">{{ totals.total_students || 0 }}</div>
                    <div class="stat-figure">
                        <div ref="studentIconRef" class="w-20 h-20 transition-transform duration-200"></div>
                    </div>
                </div>
            </div>
            <div class="stats shadow bg-base-100">
                <div class="stat group" ref="teacherStatRef">
                    <div class="stat-title">จำนวนครูทั้งหมด</div>
                    <div class="stat-value text-secondary">{{ totals.total_teachers || 0 }}</div>
                    <div class="stat-figure">
                        <div ref="teacherIconRef" class="w-20 h-20 transition-transform duration-200"></div>
                    </div>
                </div>
            </div>
            <div class="stats shadow bg-base-100">
                <div class="stat group" ref="combinedStatRef">
                    <div class="stat-title">ทั้งหมดที่เข้า</div>
                    <div class="stat-value text-purple-500">{{ totalCombined }}</div>
                    <div class="stat-desc">ประจำวันที่ {{ displayDate }}</div>
                    <div class="stat-figure">
                        <div ref="combinedIconRef" class="w-20 h-20 transition-transform duration-200"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card bg-base-100 shadow-xl group" ref="studentAbsentStatRef">
                <div class="card-body p-4">
                    <h4 class="card-title">นักเรียน</h4>
                    <div class="stats stats-vertical lg:stats-horizontal bg-base-100 w-full">
                        <div class="stat relative">
                            <div class="stat-title">เข้า</div>
                            <div class="stat-value text-primary">{{ student.total }}</div>
                            <div class="stat-desc absolute bottom-2 right-2">
                                <button @click="showAttendanceTable" class="btn btn-xs btn-primary btn-plain">
                                    คลิก
                                </button>
                            </div>
                        </div>
                        <div class="stat relative">
                            <div class="stat-title">มาสาย</div>
                            <div class="stat-value text-black">{{ student.late }}</div>
                            <div class="stat-desc absolute bottom-2 right-2">
                                <button @click="showStudentLateTable" class="btn btn-xs btn-ghost btn-plain">
                                    คลิก
                                </button>
                            </div>
                        </div>
                        <div class="stat relative border-l pl-4">
                            <div class="stat-title">ขาด</div>
                            <div class="stat-value text-error">{{ studentAbsent }}</div>
                            <div class="stat-desc absolute bottom-2 right-2">
                                <button @click="showStudentMissedTable" class="btn btn-xs btn-error btn-plain">
                                    คลิก
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card bg-base-100 shadow-xl group" ref="teacherAbsentStatRef">
                <div class="card-body p-4">
                    <h4 class="card-title">ครู</h4>
                    <div class="stats stats-vertical lg:stats-horizontal bg-base-100 w-full">
                        <div class="stat relative">
                            <div class="stat-title">เข้า</div>
                            <div class="stat-value text-secondary">{{ teacher.total }}</div>
                            <div class="stat-desc absolute bottom-2 right-2">
                                <button @click="showTeacherAttendanceTable" class="btn btn-xs btn-secondary btn-plain">
                                    คลิก
                                </button>
                            </div>
                        </div>
                        <div class="stat relative">
                            <div class="stat-title">มาสาย</div>
                            <div class="stat-value text-black">{{ teacher.late }}</div>
                            <div class="stat-desc absolute bottom-2 right-2">
                                <button @click="showTeacherLateTable" class="btn btn-xs btn-ghost btn-plain">
                                    คลิก
                                </button>
                            </div>
                        </div>
                        <div class="stat group relative border-l pl-4" ref="teacherAbsentStatRef">
                            <div class="stat-title">ขาด</div>
                            <div class="stat-value text-error">{{ teacherAbsent }}</div>
                            <div class="stat-desc absolute bottom-2 right-2">
                                <button @click="showTeacherMissedTable" class="btn btn-xs btn-error btn-plain">
                                    คลิก
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
const studentCardRef = ref(null)
import lottie from 'lottie-web'
import reportApi from '../../api/report.js'
import { ClassRoomService } from '../../api/class-room.js'
import AttendanceTable from '../Report/AttendanceTable.vue'
import LateTable from '../Report/LateTable.vue'
import MissedTable from '../Report/MissedTable.vue'
import AttendanceDetail from '../Report/AttendanceDetail.vue'

const emit = defineEmits(['dateChange'])

const selectedDate = ref(new Date().toISOString().split('T')[0])
const loading = ref(false)

const studentIconRef = ref(null)
const studentStatRef = ref(null)
const teacherIconRef = ref(null)
const teacherStatRef = ref(null)
const combinedIconRef = ref(null)
const combinedStatRef = ref(null)
const studentLateIconRef = ref(null)
const studentLateStatRef = ref(null)
const studentAbsentStatRef = ref(null)
const teacherAbsentStatRef = ref(null)

const totals = ref({ total_students: 0, total_teachers: 0 })
const student = ref({ total: 0, late: 0 })
const teacher = ref({ total: 0, late: 0 })

const attendanceModal = ref(null)
const lateModal = ref(null)
const missedModal = ref(null)
const detailModal = ref(null)
const attendanceData = ref([])
const attendancePage = ref(1)
const attendanceLimit = ref(5)
const attendanceTotalItems = ref(0)
const attendanceTotalPages = ref(0)
const attendanceGrade = ref('')
const attendanceClassroom = ref(0)
const attendanceRole = ref('student')
const lateData = ref([])
const lateAllData = ref([])
const latePage = ref(1)
const lateLimit = ref(5)
const lateTotalItems = ref(0)
const lateTotalPages = ref(0)
const lateRole = ref('student')
const missedData = ref([])
const missedAllData = ref([])
const missedPage = ref(1)
const missedLimit = ref(5)
const missedTotalItems = ref(0)
const missedTotalPages = ref(0)
const missedRole = ref('student')
const classrooms = ref([])

const classRoomService = new ClassRoomService()

const residentRole = ref(localStorage.getItem('residentRole') || '')
const localGrade = ref(localStorage.getItem('grade') || '')
const localClassroom = ref(Number(localStorage.getItem('classroom')) || 0)
const profileName = ref(localStorage.getItem('profileName') || '')

const displayDate = computed(() => {
    const d = new Date(selectedDate.value)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}/${mm}/${yyyy}`
})

const attendancePagination = computed(() => ({
    page: attendancePage.value,
    limit: attendanceLimit.value,
    total_items: attendanceTotalItems.value,
    total_pages: attendanceTotalPages.value
}))

const latePagination = computed(() => ({
    page: latePage.value,
    limit: lateLimit.value,
    total_items: lateTotalItems.value,
    total_pages: lateTotalPages.value
}))

const missedPagination = computed(() => ({
    page: missedPage.value,
    limit: missedLimit.value,
    total_items: missedTotalItems.value,
    total_pages: missedTotalPages.value
}))

const availableGrades = computed(() => {
    if (!classrooms.value || classrooms.value.length === 0) return []
    const grades = [...new Set(classrooms.value.map(c => c.grade))]
    return grades.sort((a, b) => {
        const numA = parseInt(a.replace('ม.', ''))
        const numB = parseInt(b.replace('ม.', ''))
        return numA - numB
    })
})

const availableClassrooms = computed(() => {
    if (!attendanceGrade.value || !classrooms.value || classrooms.value.length === 0) return []
    const filtered = classrooms.value.filter(c => c.grade === attendanceGrade.value)
    const classNums = [...new Set(filtered.map(c => c.classroom))]
    return classNums.sort((a, b) => a - b)
})

const totalCombined = computed(() => (student.value.total || 0) + (teacher.value.total || 0))
const studentAbsent = computed(() => Math.max((totals.value.total_students || 0) - (student.value.total || 0), 0))
const teacherAbsent = computed(() => Math.max((totals.value.total_teachers || 0) - (teacher.value.total || 0), 0))

const attendanceFilteredData = ref([])

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

async function fetchClassrooms() {
    try {
        const res = await classRoomService.getClassRooms()
        if (res.message === 'Success' && res.data) {
            classrooms.value = res.data
            if (availableGrades.value.length > 0) {
                attendanceGrade.value = availableGrades.value[0]
            }
            if (availableClassrooms.value.length > 0) {
                attendanceClassroom.value = availableClassrooms.value[0]
            }
        }
    } catch (e) {
        console.error('Error fetching classrooms:', e)
    }
}

async function showAttendanceTable() {
    try {
        loading.value = true
        attendanceRole.value = 'student'
        let params = {
            start: selectedDate.value,
            end: selectedDate.value,
            role: 'student',
            page: attendancePage.value,
            limit: 5,
            grade: attendanceGrade.value,
            classroom: attendanceClassroom.value
        }
        if (residentRole.value === 'teacher') {
            params.grade = localGrade.value
            params.classroom = localClassroom.value
            params.limit = 50
        }
        const res = await reportApi.getAttendanceReport(params)
        if (res.message === 'Success' && res.data) {
            let filtered = (res.data || []).filter(item => item.attendances && item.attendances.length > 0)
            if (residentRole.value === 'teacher') {
                attendanceFilteredData.value = filtered
                attendanceTotalItems.value = filtered.length
                attendanceTotalPages.value = Math.ceil(filtered.length / 5) || 1
                attendanceData.value = filtered.slice((attendancePage.value - 1) * 5, attendancePage.value * 5)
            } else {
                attendanceData.value = filtered
                attendanceTotalItems.value = res.total_items || filtered.length
                attendanceTotalPages.value = res.total_pages || 1
            }
            attendanceModal.value?.showModal()
        }
    } catch (e) {
        console.error('Error fetching attendance data:', e)
    } finally {
        loading.value = false
    }
}

async function showTeacherAttendanceTable() {
    try {
        loading.value = true
        attendanceRole.value = 'teacher'
        let params = {
            start: selectedDate.value,
            end: selectedDate.value,
            role: 'teacher',
            page: attendancePage.value,
            limit: 5
        }
        if (residentRole.value === 'teacher') {
            params.grade = null
            params.classroom = 0
            params.name = profileName.value
            params.limit = 50
        }
        const res = await reportApi.getAttendanceReport(params)
        if (res.message === 'Success' && res.data) {
            let filtered = (res.data || []).filter(item => item.attendances && item.attendances.length > 0)
            if (residentRole.value === 'teacher') {
                attendanceFilteredData.value = filtered
                attendanceTotalItems.value = filtered.length
                attendanceTotalPages.value = Math.ceil(filtered.length / 5) || 1
                attendanceData.value = filtered.slice((attendancePage.value - 1) * 5, attendancePage.value * 5)
            } else {
                attendanceData.value = filtered
                attendanceTotalItems.value = res.total_items || filtered.length
                attendanceTotalPages.value = res.total_pages || 1
            }
            attendanceModal.value?.showModal()
        }
    } catch (e) {
        console.error('Error fetching teacher attendance data:', e)
    } finally {
        loading.value = false
    }
}

async function showStudentLateTable() {
    try {
        loading.value = true
        lateRole.value = 'student'
        let params = {
            date: selectedDate.value,
            role: 'student'
        }
        const res = await reportApi.getLateReport(params)
        if (res.message === 'Success' && res.data) {
            let allLate = res.data || [];
            if (residentRole.value === 'teacher') {
                allLate = allLate.filter(item => item.grade === localGrade.value && Number(item.classroom) === localClassroom.value);
            }
            lateAllData.value = allLate;
            lateTotalItems.value = lateAllData.value.length;
            lateTotalPages.value = Math.ceil(lateAllData.value.length / lateLimit.value) || 1;
            latePage.value = 1;
            const start = 0;
            lateData.value = lateAllData.value.slice(start, start + lateLimit.value);
            lateModal.value?.showModal();
        }
    } catch (e) {
        console.error('Error fetching student late data:', e);
    } finally {
        loading.value = false;
    }
}

async function showTeacherLateTable() {
    try {
        loading.value = true
        lateRole.value = 'teacher'
        let params = {
            date: selectedDate.value,
            role: 'teacher'
        }
        const res = await reportApi.getLateReport(params)
        if (res.message === 'Success' && res.data) {
            let allLate = res.data || [];
            if (residentRole.value === 'teacher') {
                allLate = allLate.filter(item => item.name === profileName.value);
            }
            lateAllData.value = allLate;
            lateTotalItems.value = lateAllData.value.length;
            lateTotalPages.value = Math.ceil(lateAllData.value.length / lateLimit.value) || 1;
            latePage.value = 1;
            const start = 0;
            lateData.value = lateAllData.value.slice(start, start + lateLimit.value);
            lateModal.value?.showModal();
        }
    } catch (e) {
        console.error('Error fetching teacher late data:', e);
    } finally {
        loading.value = false;
    }
}

async function showStudentMissedTable() {
    try {
        loading.value = true
        missedRole.value = 'student'
        const res = await reportApi.getMissedReport({
            date: selectedDate.value,
            role: 'student'
        })
        if (res.message === 'Success' && res.data) {
            let allMissed = res.data || [];
            if (residentRole.value === 'teacher') {
                allMissed = allMissed.filter(item => item.grade === localGrade.value && Number(item.classroom) === localClassroom.value);
            }
            missedAllData.value = allMissed;
            missedTotalItems.value = missedAllData.value.length;
            missedTotalPages.value = Math.ceil(missedAllData.value.length / missedLimit.value) || 1;
            missedPage.value = 1;
            const start = 0;
            missedData.value = missedAllData.value.slice(start, start + missedLimit.value);
            missedModal.value?.showModal();
        }
    } catch (e) {
        console.error('Error fetching student missed data:', e);
    } finally {
        loading.value = false;
    }
}

async function showTeacherMissedTable() {
    try {
        loading.value = true
        missedRole.value = 'teacher'
        const res = await reportApi.getMissedReport({
            date: selectedDate.value,
            role: 'teacher'
        })
        if (res.message === 'Success' && res.data) {
            let allMissed = res.data || [];
            if (residentRole.value === 'teacher') {
                allMissed = allMissed.filter(item => item.name === profileName.value);
            }
            missedAllData.value = allMissed;
            missedTotalItems.value = missedAllData.value.length;
            missedTotalPages.value = Math.ceil(missedAllData.value.length / missedLimit.value) || 1;
            missedPage.value = 1;
            const start = 0;
            missedData.value = missedAllData.value.slice(start, start + missedLimit.value);
            missedModal.value?.showModal();
        }
    } catch (e) {
        console.error('Error fetching teacher missed data:', e);
    } finally {
        loading.value = false;
    }
}

function handleLatePageChange(page) {
    if (page >= 1 && page <= lateTotalPages.value) {
        latePage.value = page
        const start = (page - 1) * lateLimit.value
        lateData.value = lateAllData.value.slice(start, start + lateLimit.value)
    }
}

function handleMissedPageChange(page) {
    if (page >= 1 && page <= missedTotalPages.value) {
        missedPage.value = page
        const start = (page - 1) * missedLimit.value
        missedData.value = missedAllData.value.slice(start, start + missedLimit.value)
    }
}

async function reloadAttendance() {
    attendancePage.value = 1
    if (attendanceRole.value === 'teacher') {
        await showTeacherAttendanceTable()
    } else {
        await showAttendanceTable()
    }
}

function handleGradeChange() {
    if (availableClassrooms.value.length > 0) {
        attendanceClassroom.value = availableClassrooms.value[0]
    } else {
        attendanceClassroom.value = 0
    }
    reloadAttendance()
}

async function handlePageChange(page) {
    if (page >= 1 && page <= attendanceTotalPages.value) {
        attendancePage.value = page
        if (residentRole.value === 'teacher') {
            attendanceData.value = attendanceFilteredData.value.slice((attendancePage.value - 1) * 5, attendancePage.value * 5)
        } else {
            if (attendanceRole.value === 'teacher') {
                await showTeacherAttendanceTable()
            } else {
                await showAttendanceTable()
            }
        }
    }
}

function viewDetail(item) {
    detailModal.value?.openModal(item)
}

function resetAttendancePage() {
    attendancePage.value = 1
}

onMounted(() => {
    fetchDaily()
    fetchClassrooms()
    if (studentIconRef.value) {
        const anim = lottie.loadAnimation({
            container: studentIconRef.value,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: new URL('../../assets/doodle-color-353-internship-hover-pinch.json', import.meta.url).href,
        })
        anim.addEventListener('DOMLoaded', () => {
            anim.goToAndStop(0, true)
        })
        const containerEl = studentStatRef.value || studentIconRef.value
        const playAnim = () => anim.play()
        const stopAnim = () => anim.stop()
        containerEl.addEventListener('mouseenter', playAnim)
        containerEl.addEventListener('mouseleave', stopAnim)
    }

    if (teacherIconRef.value) {
        const anim2 = lottie.loadAnimation({
            container: teacherIconRef.value,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: new URL('../../assets/doodle-color-16-id-business-card-hover-pinch.json', import.meta.url).href,
        })
        anim2.addEventListener('DOMLoaded', () => {
            anim2.goToAndStop(0, true)
        })
        const containerEl2 = teacherStatRef.value || teacherIconRef.value
        const playAnim2 = () => anim2.play()
        const stopAnim2 = () => anim2.stop()
        containerEl2.addEventListener('mouseenter', playAnim2)
        containerEl2.addEventListener('mouseleave', stopAnim2)
    }

    if (combinedIconRef.value) {
        const anim3 = lottie.loadAnimation({
            container: combinedIconRef.value,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: new URL('../../assets/doodle-color-330-organization-hover-pinch.json', import.meta.url).href,
        })
        anim3.addEventListener('DOMLoaded', () => {
            anim3.goToAndStop(0, true)
        })
        const containerEl3 = combinedStatRef.value || combinedIconRef.value
        const playAnim3 = () => anim3.play()
        const stopAnim3 = () => anim3.stop()
        containerEl3.addEventListener('mouseenter', playAnim3)
        containerEl3.addEventListener('mouseleave', stopAnim3)
    }

    if (studentLateIconRef.value) {
        const animLate = lottie.loadAnimation({
            container: studentLateIconRef.value,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: new URL('../../assets/doodle-color-292-clock-time-hover-pinch.json', import.meta.url).href,
        })
        animLate.addEventListener('DOMLoaded', () => {
            animLate.goToAndStop(0, true)
        })
        const containerLate = studentCardRef.value || studentLateStatRef.value || studentLateIconRef.value
        const playLate = () => animLate.play()
        const stopLate = () => animLate.stop()
        containerLate.addEventListener('mouseenter', playLate)
        containerLate.addEventListener('mouseleave', stopLate)
    }
})
</script>

<style scoped></style>