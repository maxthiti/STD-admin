<template>
    <div class="p-0 md:p-6 space-y-6">
        <div class="flex justify-between items-center text-white">
            <h1 class="text-lg md:text-3xl font-bold">ตารางมาสาย</h1>
            <input v-model="filters.date" type="date" @change="fetchData"
                class="text-sm px-2 py-1 bg-white border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary rounded shadow-sm text-base-content" />
        </div>

        <div class="bg-base-100 rounded-lg shadow-lg p-4 space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-if="residentRole !== 'teacher'" class="form-control">
                    <label class="label py-1">
                        <span class="label-text text-sm font-medium">ประเภท</span>
                    </label>
                    <select v-model="filters.role" @change="handleRoleChange"
                        class="select select-sm select-bordered w-full">
                        <option value="student">นักเรียน</option>
                        <option value="teacher">ครู</option>
                    </select>
                </div>
                <div class="form-control">
                    <label class="label py-1">
                        <span class="label-text text-sm font-medium">ค้นหาชื่อ/รหัส</span>
                    </label>
                    <input v-model="filters.search" type="text" placeholder="กรอกชื่อหรือรหัส"
                        class="input input-sm input-bordered w-full" />
                </div>
                <div v-if="residentRole === 'teacher'" class="form-control flex flex-col items-center md:items-end">
                    <div
                        class="p-1 text-white bg-primary rounded-md text-center min-w-[120px] flex flex-col items-center">
                        <span class="label-text text-sm font-medium mb-1 text-secondary">ชั้นปี / ห้อง</span>
                        <span>{{ teacherGrade }}/{{ teacherClassroom }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="error" class="alert alert-error shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-12">
            <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>

        <div v-else>
            <LateTable :data="paginatedData" :pagination="paginationData" @page-change="goToPage" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import LateTable from '../../../components/Report/LateTable.vue'
import reportApi from '../../../api/report.js'

const residentRole = localStorage.getItem('residentRole') || ''
const teacherGrade = localStorage.getItem('grade') || ''
const teacherClassroom = localStorage.getItem('classroom') || ''

const loading = ref(false)
const error = ref(null)
const lateData = ref([])

const filters = ref({
    role: 'student',
    date: getDefaultDate(),
    search: '',
    grade: residentRole === 'teacher' ? teacherGrade : '',
    classroom: residentRole === 'teacher' ? teacherClassroom : ''
})

const pagination = ref({
    page: 1,
    limit: 10
})

function getDefaultDate() {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
        let params = {
            date: filters.value.date,
            role: filters.value.role,
        }
        if (residentRole === 'teacher') {
            params.grade = teacherGrade
            params.classroom = teacherClassroom
        }
        const response = await reportApi.getLateReport(params)

        if (response.message === 'Success') {
            lateData.value = response.data || []
            pagination.value.page = 1
        }
    } catch (err) {
        error.value = 'เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง'
        console.error('Error fetching late report:', err)
    } finally {
        loading.value = false
    }
}

// const resetFilters = () => {
//     filters.value = {
//         role: 'student',
//         date: getDefaultDate(),
//         search: ''
//     }
//     pagination.value.page = 1
//     fetchData()
// }

const handleRoleChange = () => {
    pagination.value.page = 1
    fetchData()
}

// const triggerSearch = () => {
//     pagination.value.page = 1
// }

const isNumericSearch = computed(() => /^\d+$/.test(filters.value.search.trim()))

const filteredData = computed(() => {
    let base = lateData.value
    if (residentRole === 'teacher' && teacherGrade && teacherClassroom) {
        base = base.filter(item => {
            const match = item.grade.trim() === teacherGrade.trim()
                && Number(String(item.classroom).trim()) === Number(String(teacherClassroom).trim())
            console.log('item.classroom:', item.classroom, typeof item.classroom, 'teacherClassroom:', teacherClassroom, typeof teacherClassroom, 'match:', Number(String(item.classroom).trim()) === Number(String(teacherClassroom).trim()))
            return match
        })
    }
    const term = filters.value.search.trim()
    if (!term) return base
    if (isNumericSearch.value) {
        return base.filter(item => item.userid && item.userid.includes(term))
    }
    const lower = term.toLowerCase()
    return base.filter(item => item.name && item.name.toLowerCase().includes(lower))
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / pagination.value.limit) || 1)

const paginatedData = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.limit
    return filteredData.value.slice(start, start + pagination.value.limit)
})

const paginationData = computed(() => ({
    page: pagination.value.page,
    limit: pagination.value.limit,
    total_items: filteredData.value.length,
    total_pages: totalPages.value
}))

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        pagination.value.page = page
    }
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped></style>