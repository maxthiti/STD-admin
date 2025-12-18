<template>
    <div class="flex items-center flex-row justify-between mb-4 gap-4">
        <h1 class="text-xl sm:text-2xl font-bold text-white whitespace-nowrap">จัดการวันหยุด</h1>
        <button v-if="auth.user?.role !== 'viewer'" class="btn btn-primary btn-sm ml-2 whitespace-nowrap shrink-0" @click="showCreate = true">+
            เพิ่มวันหยุด</button>
    </div>
    <div class="flex gap-2 items-center justify-end mb-4">
        <select v-model="filterType" class="select select-bordered select-sm min-w-[80px] max-w-[120px] text-xs sm:text-base">
            <option value="month">เดือน</option>
            <option value="day">วัน</option>
            <option value="year">ปี</option>
        </select>
        <input v-if="filterType === 'day'" type="date" v-model="dateInput"
            class="input input-bordered input-sm text-xs sm:text-base w-auto" />
        <input v-if="filterType === 'month'" type="month" v-model="monthInput"
            class="input input-bordered input-sm text-xs sm:text-base w-auto" />
        <input v-if="filterType === 'year'" type="number" min="1900" max="2100" v-model="yearInput"
            class="input input-bordered input-sm w-auto text-xs sm:text-base" />
    </div>

    <HolidaysTable :holidays="holidays.data || []" @delete="onDeleteHoliday" />

    <div v-if="showCreate" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div class="bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-2xl relative animate-fade-in">
            <button class="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
                @click="showCreate = false">✕</button>
            <Create @saved="showCreate = false; fetchHolidays()" />
        </div>
    </div>
    <DeleteDialog v-if="showDelete" :holiday="deletingHoliday" @confirm="handleDeleteConfirm"
        @cancel="handleDeleteCancel" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Create from '../../components/Holidays/Create.vue'
import HolidaysTable from '../../components/Holidays/Table.vue'
import DeleteDialog from '../../components/Holidays/Delete.vue'
import holidaysApi from '../../api/holidays'
import Swal from 'sweetalert2'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()

const showCreate = ref(false)
const holidays = ref([])
const showDelete = ref(false)
const deletingHoliday = ref(null)

function onDeleteHoliday(item) {
    deletingHoliday.value = item
    showDelete.value = true
}

async function handleDeleteConfirm() {
    if (!deletingHoliday.value) return
    try {
        await holidaysApi.deleteHoliday(deletingHoliday.value._id)
        showDelete.value = false
        deletingHoliday.value = null
        await fetchHolidays()
        Swal.fire({
            icon: 'success',
            title: 'ลบวันหยุดสำเร็จ',
            showConfirmButton: false,
            timer: 1500
        })
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'ลบวันหยุดไม่สำเร็จ',
            text: e?.response?.data?.message || 'เกิดข้อผิดพลาด',
            showConfirmButton: true
        })
    }
}

function handleDeleteCancel() {
    showDelete.value = false
    deletingHoliday.value = null
}

const today = new Date()
const yyyy = today.getFullYear()
const mm = String(today.getMonth() + 1).padStart(2, '0')
const dd = String(today.getDate()).padStart(2, '0')

const filterType = ref('year')
const dateInput = ref(`${yyyy}-${mm}-${dd}`)
const monthInput = ref(`${yyyy}-${mm}`)
const yearInput = ref(yyyy)

function getRange() {
    if (filterType.value === 'day') {
        return { start: dateInput.value, end: dateInput.value }
    }
    if (filterType.value === 'month') {
        const [y, m] = monthInput.value.split('-')
        const firstDay = '01'
        const lastDay = String(new Date(Number(y), Number(m), 0).getDate()).padStart(2, '0')
        return { start: `${y}-${m}-${firstDay}`, end: `${y}-${m}-${lastDay}` }
    }
    if (filterType.value === 'year') {
        const y = yearInput.value
        return { start: `${y}-01-01`, end: `${y}-12-31` }
    }
    return { start: dateInput.value, end: dateInput.value }
}

async function fetchHolidays() {
    const { start, end } = getRange()
    try {
        holidays.value = await holidaysApi.getHolidaysByRange(start, end)
    } catch (e) {
        // handle error
    }
}

watch([filterType, dateInput, monthInput, yearInput], fetchHolidays)
onMounted(fetchHolidays)
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in {
    animation: fade-in 0.2s ease;
}
</style>