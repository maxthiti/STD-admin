<template>
    <div class="p-6 space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-primary">ตารางเข้า-ออก</h1>
            <input v-model="filters.date" type="date" @change="fetchData"
                class="text-sm px-2 py-1 bg-transparent border-none focus:outline-none focus:ring-0 rounded" />
        </div>

        <div class="bg-base-100 rounded-lg shadow-lg p-4 space-y-3">

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div class="form-control">
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
                        class="input input-sm input-bordered w-full" @keyup.enter="fetchData" />
                </div>

                <div class="form-control">
                    <label class="label py-1">
                        <span class="label-text text-sm font-medium">ชั้นปี</span>
                    </label>
                    <select v-model="filters.grade" class="select select-sm select-bordered w-full"
                        :disabled="filters.role === 'teacher'">
                        <option value="">ทั้งหมด</option>
                        <option value="ม.1">ม.1</option>
                        <option value="ม.2">ม.2</option>
                        <option value="ม.3">ม.3</option>
                        <option value="ม.4">ม.4</option>
                        <option value="ม.5">ม.5</option>
                        <option value="ม.6">ม.6</option>
                    </select>
                </div>

                <div class="form-control">
                    <label class="label py-1">
                        <span class="label-text text-sm font-medium">ห้อง</span>
                    </label>
                    <input v-model.number="filters.classroom" type="number" placeholder="หมายเลขห้อง"
                        class="input input-sm input-bordered w-full" :disabled="filters.role === 'teacher'" min="0" />
                </div>
            </div>

            <div class="flex gap-2">
                <button @click="fetchData" class="btn btn-sm btn-primary" :disabled="loading">
                    <svg v-if="loading" class="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    ค้นหา
                </button>
                <button @click="resetFilters" class="btn btn-sm btn-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    รีเซ็ต
                </button>
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
            <ReportTable :data="reportData" @viewDetail="openDetailModal" />

            <div v-if="pagination.total_pages > 1" class="flex justify-center items-center gap-2 mt-6">
                <button @click="goToPage(1)" class="btn btn-sm" :disabled="pagination.page === 1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
                <button @click="goToPage(pagination.page - 1)" class="btn btn-sm" :disabled="pagination.page === 1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div class="flex gap-1">
                    <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                        :class="['btn btn-sm', page === pagination.page ? 'btn-primary' : '']">
                        {{ page }}
                    </button>
                </div>

                <button @click="goToPage(pagination.page + 1)" class="btn btn-sm"
                    :disabled="pagination.page === pagination.total_pages">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <button @click="goToPage(pagination.total_pages)" class="btn btn-sm"
                    :disabled="pagination.page === pagination.total_pages">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <div v-if="pagination.total_items > 0" class="text-center text-sm text-base-content/60 mt-4">
                แสดง {{ ((pagination.page - 1) * pagination.limit) + 1 }} - {{
                    Math.min(pagination.page * pagination.limit, pagination.total_items)
                }} จาก {{ pagination.total_items }} รายการ
            </div>
        </div>

        <AttendanceDetail ref="detailModal" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ReportTable from '../../../components/Report/AttendanceTable.vue'
import AttendanceDetail from '../../../components/Report/AttendanceDetail.vue'
import reportApi from '../../../api/report.js'

const loading = ref(false)
const error = ref(null)
const reportData = ref([])
const detailModal = ref(null)

const filters = ref({
    role: 'student',
    search: '',
    grade: 'ม.1',
    classroom: 1,
    date: getDefaultDate()
})

const pagination = ref({
    page: 1,
    limit: 20,
    total_items: 0,
    total_pages: 0
})

function getDefaultDate() {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

const handleRoleChange = () => {
    if (filters.value.role === 'teacher') {
        filters.value.grade = ''
        filters.value.classroom = 0
    } else {
        filters.value.grade = 'ม.1'
        filters.value.classroom = 1
    }
    pagination.value.page = 1
    fetchData()
}

const fetchData = async () => {
    loading.value = true
    error.value = null

    try {
        const rawSearch = filters.value.search.trim()
        const isNumeric = /^\d+$/.test(rawSearch)
        const params = {
            start: filters.value.date,
            end: filters.value.date,
            role: filters.value.role,
            name: isNumeric ? '' : rawSearch,
            userid: isNumeric ? rawSearch : '',
            page: pagination.value.page,
            limit: pagination.value.limit,
            grade: filters.value.grade,
            classroom: filters.value.role === 'teacher' ? 0 : filters.value.classroom
        }

        const response = await reportApi.getAttendanceReport(params)

        if (response.message === 'Success') {
            reportData.value = response.data
            pagination.value = {
                page: response.page,
                limit: response.limit,
                total_items: response.total_items,
                total_pages: response.total_pages
            }
        }
    } catch (err) {
        error.value = 'เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง'
        console.error('Error fetching report:', err)
    } finally {
        loading.value = false
    }
}

const resetFilters = () => {
    filters.value = {
        role: 'student',
        search: '',
        grade: 'ม.1',
        classroom: 1,
        date: getDefaultDate()
    }
    pagination.value.page = 1
    fetchData()
}

const goToPage = (page) => {
    if (page >= 1 && page <= pagination.value.total_pages) {
        pagination.value.page = page
        fetchData()
    }
}

const visiblePages = computed(() => {
    const current = pagination.value.page
    const total = pagination.value.total_pages
    const delta = 2
    const pages = []

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        pages.push(i)
    }

    if (current - delta > 2) {
        pages.unshift('...')
    }
    if (current + delta < total - 1) {
        pages.push('...')
    }

    if (total > 0) {
        pages.unshift(1)
        if (total > 1) {
            pages.push(total)
        }
    }

    return pages.filter((p, idx, arr) => p !== '...' || arr[idx - 1] !== '...')
})

const openDetailModal = (item) => {
    detailModal.value.openModal(item)
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped></style>
