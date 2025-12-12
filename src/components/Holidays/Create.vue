<template>
    <div class="p-4 max-w-2xl mx-auto">
        <h2 class="text-xl font-bold mb-2 sm:mb-4">เพิ่มวันหยุด</h2>
        <form @submit.prevent="addHoliday" class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0">
                <div class="flex-1">
                    <label class="block mb-1 font-medium text-sm sm:text-base">ชื่อวันหยุด</label>
                    <input v-model="newHoliday.summary" type="text"
                        class="input input-bordered w-full text-sm sm:text-base px-1 py-1 sm:px-3 sm:py-2 h-10 sm:h-12"
                        required />
                </div>
                <div class="flex-1">
                    <label class="block mb-1 font-medium text-sm sm:text-base">วันที่ (เลือกได้หลายวัน)</label>
                    <flat-pickr v-model="newHoliday.dates" :config="flatpickrConfig"
                        class="input input-bordered w-full text-sm sm:text-base px-1 py-1 sm:px-3 sm:py-2 h-10 sm:h-12"
                        required />
                </div>
            </div>
            <button type="button" class="btn btn-secondary w-full h-10 sm:h-12" @click="addHoliday"
                :disabled="!canAddHoliday">เพิ่มรายการ</button>
        </form>

        <div v-if="holidays.length" class="mt-6">
            <h3 class="font-semibold mb-2">รายการวันหยุดที่เพิ่ม</h3>
            <table class="table w-full mb-4">
                <thead>
                    <tr>
                        <th>ชื่อวันหยุด</th>
                        <th>วันที่</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) in pagedHolidays" :key="idx + (currentPage - 1) * pageSize">
                        <td>{{ item.summary }}</td>
                        <td>{{ formatDisplayDate(item.date) }}</td>
                        <td><button class="btn btn-xs btn-error"
                                @click="removeHoliday(idx + (currentPage - 1) * pageSize)">ลบ</button></td>
                    </tr>
                </tbody>
            </table>
            <div class="flex justify-between items-center mb-2" v-if="totalPages > 1">
                <button class="btn btn-xs" :disabled="currentPage === 1" @click="currentPage--">&lt; ก่อนหน้า</button>
                <span class="text-sm">หน้า {{ currentPage }} / {{ totalPages }}</span>
                <button class="btn btn-xs" :disabled="currentPage === totalPages" @click="currentPage++">ถัดไป
                    &gt;</button>
            </div>
            <form @submit.prevent="handleSubmit">
                <button type="submit" class="btn btn-primary w-full" :disabled="loading">
                    <span v-if="loading">กำลังบันทึก...</span>
                    <span v-else>บันทึกวันหยุดทั้งหมด</span>
                </button>
            </form>
        </div>
    </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue'
import holidaysApi from '../../api/holidays'
import FlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import Swal from 'sweetalert2'

const newHoliday = ref({ summary: '', dates: [] })
const holidays = ref([])
const loading = ref(false)
const error = ref('')
const success = ref(false)
const pageSize = 3
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(holidays.value.length / pageSize))
const pagedHolidays = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return holidays.value.slice(start, start + pageSize)
})
watch(holidays, () => { currentPage.value = 1 })

const flatpickrConfig = {
    mode: 'multiple',
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'd/m/Y',
    enableTime: false,
    allowInput: true
}

const canAddHoliday = computed(() => {
    return newHoliday.value.summary && newHoliday.value.dates && newHoliday.value.dates.length > 0
})

function addHoliday() {
    if (!canAddHoliday.value) return
    let datesArr = []
    if (Array.isArray(newHoliday.value.dates)) {
        datesArr = newHoliday.value.dates
    } else if (typeof newHoliday.value.dates === 'string') {
        datesArr = newHoliday.value.dates.split(',')
    }
    datesArr.forEach(date => {
        holidays.value.push({
            summary: newHoliday.value.summary,
            date: formatDate(date)
        })
    })
    newHoliday.value.summary = ''
    newHoliday.value.dates = []
}

function removeHoliday(idx) {
    holidays.value.splice(idx, 1)
}


function formatDate(date) {
    if (!date) return ''
    let dObj
    if (typeof date === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
            const [d, m, y] = date.split('/')
            return `${y}-${m}-${d}`
        }
        dObj = new Date(date)
    } else {
        dObj = date
    }
    if (dObj instanceof Date && !isNaN(dObj)) {
        const y = dObj.getFullYear()
        const m = String(dObj.getMonth() + 1).padStart(2, '0')
        const d = String(dObj.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
    }
    return ''
}

function formatDisplayDate(date) {
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [y, m, d] = date.split('-')
        return `${d}/${m}/${y}`
    }
    if (typeof date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        return date
    }
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
}

const emit = defineEmits(['saved'])
async function handleSubmit() {
    if (!holidays.value.length) return
    loading.value = true
    error.value = ''
    success.value = false
    try {
        await holidaysApi.createHoliday(holidays.value)
        success.value = true
        holidays.value = []
        Swal.fire({
            icon: 'success',
            title: 'เพิ่มวันหยุดสำเร็จ',
            showConfirmButton: false,
            timer: 1500
        })
        emit('saved')
    } catch (e) {
        error.value = 'เกิดข้อผิดพลาดในการบันทึกวันหยุด'
        Swal.fire({
            icon: 'error',
            title: 'เพิ่มวันหยุดไม่สำเร็จ',
            text: error.value,
            showConfirmButton: true
        })
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.input {
    margin-bottom: 0.5rem;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    border: 1px solid #e5e7eb;
    padding: 0.5rem;
    text-align: left;
}
</style>
