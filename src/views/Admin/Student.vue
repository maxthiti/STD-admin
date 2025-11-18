<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 class="text-2xl font-bold text-primary">จัดการนักเรียน</h2>
            <button class="btn btn-primary" @click="openCreateModal">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                เพิ่มนักเรียน
            </button>
        </div>

        <div class="card bg-base-100 shadow-md">
            <div class="card-body p-4">
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="form-control w-full sm:w-auto">
                        <label class="label py-1">
                            <span class="label-text text-sm">ชั้นปี</span>
                        </label>
                        <select v-model="selectedGrade" @change="fetchStudents"
                            class="select select-bordered select-sm w-full sm:w-32">
                            <option value="ม.1">ม.1</option>
                            <option value="ม.2">ม.2</option>
                            <option value="ม.3">ม.3</option>
                            <option value="ม.4">ม.4</option>
                            <option value="ม.5">ม.5</option>
                            <option value="ม.6">ม.6</option>
                        </select>
                    </div>

                    <div class="form-control w-full sm:w-auto">
                        <label class="label py-1">
                            <span class="label-text text-sm">ห้อง</span>
                        </label>
                        <select v-model="selectedClassroom" @change="fetchStudents"
                            class="select select-bordered select-sm w-full sm:w-24">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                        </select>
                    </div>

                    <div class="form-control w-full sm:flex-1">
                        <label class="label py-1">
                            <span class="label-text text-sm">ค้นหาชื่อ/รหัส</span>
                        </label>
                        <div class="relative">
                            <input v-model="searchQuery" @input="handleSearch" type="text"
                                placeholder="ค้นหาชื่อหรือรหัสนักเรียน..."
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
                        <button @click="resetFilters" class="btn btn-ghost btn-sm">
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

        <StudentTable :students="filteredStudents" :loading="loading" />

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
import StudentTable from '../../components/ListStudent/Table.vue'
import { StudentService } from '../../api/student'

const studentService = new StudentService()
const students = ref([])
const loading = ref(false)
const selectedGrade = ref('ม.1')
const selectedClassroom = ref('1')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5
const imageBaseUrl = import.meta.env.VITE_APP_BASE_URL + 'uploads/'

const filteredBySearch = computed(() => {
    if (!searchQuery.value.trim()) {
        return students.value
    }
    const query = searchQuery.value.toLowerCase().trim()
    return students.value.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.code.toLowerCase().includes(query)
    )
})

const totalPages = computed(() => Math.ceil(filteredBySearch.value.length / itemsPerPage))

const filteredStudents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredBySearch.value.slice(start, end)
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

const handleSearch = () => {
    currentPage.value = 1
}

const fetchStudents = async () => {
    loading.value = true
    currentPage.value = 1
    searchQuery.value = ''
    try {
        const response = await studentService.getStudents(selectedGrade.value, selectedClassroom.value)
        if (response.message === 'Success' && response.data) {
            students.value = response.data.map(student => ({
                id: student._id,
                userid: student.userid,
                name: student.name,
                code: student.userid,
                grade: student.grade,
                room: student.classroom,
                email: student.userid + '@student.ckk.ac.th',
                phone: student.phone || '-',
                picture: student.picture ? imageBaseUrl + student.picture : ''
            }))
        }
    } catch (error) {
        console.error('Fetch students error:', error)
        const { default: Swal } = await import('sweetalert2')
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถโหลดข้อมูลนักเรียนได้',
            confirmButtonColor: '#2563eb',
            didOpen: () => {
                document.getElementById('app').removeAttribute('aria-hidden')
            }
        })
        students.value = []
    } finally {
        loading.value = false
    }
}

const resetFilters = () => {
    selectedGrade.value = 'ม.1'
    selectedClassroom.value = '1'
    searchQuery.value = ''
    fetchStudents()
}

onMounted(() => {
    fetchStudents()
})
</script>

<style scoped></style>
