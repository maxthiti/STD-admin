<template>
    <div>
        <input ref="fileInput" type="file" accept=".xlsx,.xls" style="display:none" @change="handleExcelImport" />

        <button class="btn btn-success btn-sm" @click="triggerFileInput">นำเข้า Excel</button>
        <div class="mt-1">
            <a href="/Excel-Dayoff.xlsx" download class="text-xs text-blue-500 underline">ตัวอย่างไฟล์ Excel</a>
        </div>

        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div class="bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in">
                <button class="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost" @click="closeModal">✕</button>
                <h3 class="font-bold mb-4">ตัวอย่างวันหยุดที่นำเข้า</h3>
                <table class="table w-full mb-2">
                    <thead>
                        <tr>
                            <th>ชื่อวันหยุด</th>
                            <th>วันที่</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, idx) in holidays" :key="item.summary + '_' + item.date">
                            <td>{{ item.summary }}</td>
                            <td>{{ formatDisplayDate(item.date) }}</td>
                            <td><button class="btn btn-xs btn-error" @click="removeHoliday(idx)">ลบ</button></td>
                        </tr>
                    </tbody>
                </table>
                <div class="flex justify-end mt-4 gap-2">
                    <button class="btn btn-secondary" @click="closeModal">ยกเลิก</button>
                    <button class="btn btn-primary" :disabled="!holidays.length || loading" @click="confirmImport">
                        <span v-if="loading">กำลังนำเข้า...</span>
                        <span v-else>ยืนยันนำเข้า</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'

const fileInput = ref(null)
const holidays = ref([])
const loading = ref(false)
const showModal = ref(false)
const emit = defineEmits(['imported'])

function triggerFileInput() {
    fileInput.value && fileInput.value.click()
}

function formatDate(date) {
    if (!date) return ''
    if (typeof date === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
            const [d, m, y] = date.split('/')
            return `${y}-${m}-${d}`
        }
    }
    if (typeof date === 'number') {
        const excelEpoch = new Date(Date.UTC(1899, 11, 30))
        const d = new Date(excelEpoch.getTime() + date * 86400000)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
    }
    return ''
}

function formatDisplayDate(date) {
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [y, m, d] = date.split('-');
        return `${d}/${m}/${y}`;
    }
    if (typeof date === 'string' && /^\d{8}$/.test(date)) {
        const y = date.slice(0, 4);
        const m = date.slice(4, 6);
        const d = date.slice(6, 8);
        return `${d}/${m}/${y}`;
    }
    if (typeof date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        return date;
    }
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function handleExcelImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
        try {
            const data = new Uint8Array(evt.target.result)
            const workbook = XLSX.read(data, { type: 'array' })
            const sheet = workbook.Sheets[workbook.SheetNames[0]]
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })
            const imported = []
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i]
                if (row[0] && row[1]) {
                    imported.push({
                        summary: String(row[0]),
                        date: formatDate(row[1])
                    })
                }
            }
            if (imported.length === 0) {
                Swal.fire({ icon: 'info', title: 'ไม่พบข้อมูลวันหยุดในไฟล์', showConfirmButton: true })
                return
            }
            holidays.value = imported
            showModal.value = true
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'นำเข้าไฟล์ล้มเหลว', text: err?.message || '', showConfirmButton: true })
        }
        fileInput.value.value = ''
    }
    reader.readAsArrayBuffer(file)
}

function removeHoliday(idx) {
    holidays.value.splice(idx, 1)
}

function closeModal() {
    holidays.value = []
    showModal.value = false
}

async function confirmImport() {
    if (!holidays.value.length) return
    loading.value = true
    try {
        emit('imported', holidays.value)
        Swal.fire({ icon: 'success', title: `นำเข้าวันหยุดสำเร็จ ${holidays.value.length} รายการ`, showConfirmButton: false, timer: 1500 })
        holidays.value = []
        showModal.value = false
    } catch (e) {
        Swal.fire({ icon: 'error', title: 'นำเข้าวันหยุดไม่สำเร็จ', text: e?.message || '', showConfirmButton: true })
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
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
