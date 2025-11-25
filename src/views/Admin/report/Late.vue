<template>
    <div class="p-6 space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold text-primary">ตารางมาสาย</h1>
            <input v-model="filters.date" type="date" @change="fetchData"
                class="text-sm px-2 py-1 bg-transparent border-none focus:outline-none focus:ring-0 rounded" />
        </div>

        <div class="bg-base-100 rounded-lg shadow-lg p-4 space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        class="input input-sm input-bordered w-full" />
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
            <LateTable :data="paginatedData" @viewImage="openImageModal" />
            <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
                <button @click="goToPage(1)" class="btn btn-sm" :disabled="pagination.page === 1">«</button>
                <button @click="goToPage(pagination.page - 1)" class="btn btn-sm"
                    :disabled="pagination.page === 1">‹</button>
                <div class="flex gap-1">
                    <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                        :class="['btn btn-sm', page === pagination.page ? 'btn-primary' : '']">
                        {{ page }}
                    </button>
                </div>
                <button @click="goToPage(pagination.page + 1)" class="btn btn-sm"
                    :disabled="pagination.page === totalPages">›</button>
                <button @click="goToPage(totalPages)" class="btn btn-sm"
                    :disabled="pagination.page === totalPages">»</button>
            </div>
            <div v-if="filteredData.length > 0" class="text-center text-sm text-base-content/60 mt-4">
                แสดง {{ startItem }} - {{ endItem }} จาก {{ filteredData.length }} รายการ
            </div>
        </div>
    </div>

    <dialog ref="imageModal" class="modal">
        <div class="modal-box max-w-7xl w-full p-0">
            <form method="dialog">
                <button
                    class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10 bg-white/80 hover:bg-white">✕</button>
            </form>
            <img v-if="selectedImage"
                :src="`${selectedImageType === 'profile' ? imgProBaseUrl : imgBaseUrl}${selectedImage}`"
                alt="late image" class="w-full h-auto max-h-[90vh] object-contain" />
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import LateTable from '../../../components/Report/LateTable.vue'
import reportApi from '../../../api/report.js'

const imgBaseUrl = import.meta.env.VITE_APP_IMG_URL
const imgProBaseUrl = import.meta.env.VITE_IMG_PROFILE_URL

const loading = ref(false)
const error = ref(null)
const lateData = ref([])
const selectedImage = ref(null)
const selectedImageType = ref('snap')
const imageModal = ref(null)

const filters = ref({
    role: 'student',
    date: getDefaultDate(),
    search: ''
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
        const params = {
            date: filters.value.date,
            role: filters.value.role,
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

const resetFilters = () => {
    filters.value = {
        role: 'student',
        date: getDefaultDate(),
        search: ''
    }
    pagination.value.page = 1
    fetchData()
}

const handleRoleChange = () => {
    pagination.value.page = 1
    fetchData()
}

const triggerSearch = () => {
    pagination.value.page = 1
}

const isNumericSearch = computed(() => /^\d+$/.test(filters.value.search.trim()))

const filteredData = computed(() => {
    const term = filters.value.search.trim()
    if (!term) return lateData.value
    if (isNumericSearch.value) {
        return lateData.value.filter(item => item.userid && item.userid.includes(term))
    }
    const lower = term.toLowerCase()
    return lateData.value.filter(item => item.name && item.name.toLowerCase().includes(lower))
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / pagination.value.limit) || 1)

const paginatedData = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.limit
    return filteredData.value.slice(start, start + pagination.value.limit)
})

const startItem = computed(() => filteredData.value.length === 0 ? 0 : (pagination.value.page - 1) * pagination.value.limit + 1)
const endItem = computed(() => Math.min(pagination.value.page * pagination.value.limit, filteredData.value.length))

const visiblePages = computed(() => {
    const current = pagination.value.page
    const total = totalPages.value
    const delta = 2
    const pages = []
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        pages.push(i)
    }
    if (current - delta > 2) pages.unshift('...')
    if (current + delta < total - 1) pages.push('...')
    if (total > 0) {
        pages.unshift(1)
        if (total > 1) pages.push(total)
    }
    return pages.filter((p, idx, arr) => p !== '...' || arr[idx - 1] !== '...')
})

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        pagination.value.page = page
    }
}

const openImageModal = (payload) => {
    if (payload && typeof payload === 'object' && payload.path) {
        selectedImage.value = payload.path
        selectedImageType.value = payload.type || 'snap'
    } else {
        selectedImage.value = payload
        selectedImageType.value = 'snap'
    }
    imageModal.value.showModal()
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped></style>