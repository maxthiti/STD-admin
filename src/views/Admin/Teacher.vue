<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 class="text-2xl font-bold text-primary">จัดการอาจารย์</h2>
        </div>

        <div class="card bg-base-100 shadow-md">
            <div class="card-body p-4">
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="form-control w-full sm:flex-1">
                        <label class="label py-1">
                            <span class="label-text text-sm">ค้นหา</span>
                        </label>
                        <div class="relative">
                            <input v-model="searchQuery" @input="fetchTeachers" type="text"
                                placeholder="ค้นหาชื่อหรือรหัสอาจารย์..."
                                class="input input-bordered input-sm w-full" />
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div class="form-control w-full sm:w-auto">
                        <label class="label py-1">
                            <span class="label-text text-sm">&nbsp;</span>
                        </label>
                        <button @click="resetSearch" class="btn btn-ghost btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            รีเซ็ต
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <TeacherTable :teachers="paginatedTeachers" :loading="loading" :departmentFilter="filterDepartment"
            :positionFilter="filterPosition" :departments="departments" :positions="positions"
            @filterDepartment="handleFilterDepartment" @filterPosition="handleFilterPosition" />

        <div v-if="totalPages > 1" class="flex justify-center">
            <div class="join">
                <button class="join-item btn btn-sm" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                    «
                </button>
                <button v-for="page in displayedPages" :key="page" class="join-item btn btn-sm"
                    :class="{ 'btn-active': page === currentPage }" @click="goToPage(page)">
                    {{ page }}
                </button>
                <button class="join-item btn btn-sm" @click="goToPage(currentPage + 1)"
                    :disabled="currentPage === totalPages">
                    »
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import TeacherTable from '../../components/ListTeacher/Table.vue'
import { TeacherService } from '../../api/teacher'
import { DepartmentService } from '../../api/department'
import { PositionService } from '../../api/position'

const teacherService = new TeacherService()
const departmentService = new DepartmentService()
const positionService = new PositionService()

const teachers = ref([])
const departments = ref([])
const positions = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filterDepartment = ref('')
const filterPosition = ref('')
const currentPage = ref(1)
const itemsPerPage = 5
const imageBaseUrl = import.meta.env.VITE_APP_BASE_URL + 'uploads/'

const totalPages = computed(() => Math.ceil(teachers.value.length / itemsPerPage))

const paginatedTeachers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return teachers.value.slice(start, end)
})

const displayedPages = computed(() => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages.value, startPage + maxVisible - 1)

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }
    return pages
})

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const fetchTeachers = async () => {
    loading.value = true
    currentPage.value = 1
    try {
        const response = await teacherService.getTeachers(searchQuery.value, filterDepartment.value, filterPosition.value)
        if (response.message === 'Success' && response.data) {
            teachers.value = response.data.map(teacher => ({
                id: teacher._id,
                userid: teacher.userid,
                name: teacher.name,
                code: teacher.userid,
                department: teacher.department || '-',
                position: teacher.position || '-',
                email: teacher.userid + '@ckk.ac.th',
                phone: teacher.phone || '-',
                picture: teacher.picture ? imageBaseUrl + teacher.picture : ''
            }))
        }
    } catch (error) {
        console.error('Fetch teachers error:', error)
        const { default: Swal } = await import('sweetalert2')
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถโหลดข้อมูลอาจารย์ได้',
            confirmButtonColor: '#2563eb',
            didOpen: () => {
                document.getElementById('app').removeAttribute('aria-hidden')
            }
        })
        teachers.value = []
    } finally {
        loading.value = false
    }
}

const resetSearch = () => {
    searchQuery.value = ''
    filterDepartment.value = ''
    filterPosition.value = ''
    fetchTeachers()
}

const handleFilterDepartment = (value) => {
    filterDepartment.value = value
    fetchTeachers()
}

const handleFilterPosition = (value) => {
    filterPosition.value = value
    fetchTeachers()
}

const fetchDepartments = async () => {
    try {
        const response = await departmentService.getDepartments()
        if (response.message === 'Success' && response.data) {
            departments.value = response.data
        }
    } catch (error) {
        console.error('Fetch departments error:', error)
    }
}

const fetchPositions = async () => {
    try {
        const response = await positionService.getPositions()
        if (response.message === 'Success' && response.data) {
            positions.value = response.data
        }
    } catch (error) {
        console.error('Fetch positions error:', error)
    }
}

onMounted(() => {
    fetchDepartments()
    fetchPositions()
    fetchTeachers()
})
</script>

<style scoped></style>
