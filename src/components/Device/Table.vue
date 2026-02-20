<template>
    <div class="overflow-x-auto bg-base-100 rounded-lg shadow">
        <template v-if="isMobile">
            <div v-if="devices.length === 0" class="text-center py-8 text-base-content/60">
                ไม่พบข้อมูลอุปกรณ์
            </div>
            <div v-else class="flex flex-col gap-4">
                <div v-for="(device, index) in devices" :key="device._id"
                    class="bg-white rounded-lg shadow p-4 border border-base-200">
                    <div class="font-bold text-primary mb-2">{{ index + 1 }}</div>
                    <div class="font-medium mb-1">Serial: {{ device.serial_number }}</div>
                    <div class="mb-1">สถานที่: {{ device.location }}</div>
                    <div class="mb-1 flex items-center gap-2">สถานะ:
                        <span :class="isOnline(device.current_time)
                            ? 'inline-block w-3 h-3 rounded-full bg-green-500'
                            : 'inline-block w-3 h-3 rounded-full bg-red-500'"
                            :title="isOnline(device.current_time) ? 'ออนไลน์' : 'ออฟไลน์'"></span>
                        <span :class="formatStatus(device.status) === 'ออนไลน์' ? 'text-green-600' : 'text-red-600'">
                            {{ formatStatus(device.status) }}
                        </span>
                    </div>
                    <div v-if="auth.user?.role !== 'viewer'" class="flex gap-2 justify-end mt-2">
                        <button @click="$emit('edit', device)" class="btn btn-xs btn-warning btn-outline">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button @click="$emit('delete', device._id)" class="btn btn-xs btn-error btn-outline">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <table class="table w-full">
                <thead>
                    <tr class="bg-base-200">
                        <th class="text-center hidden xl:table-cell">ลำดับ</th>
                        <th>Serial Number</th>
                        <th class="hidden sm:table-cell">IP Address</th>
                        <th>สถานที่</th>
                        <th class="hidden xl:table-cell">เวลาปัจจุบัน</th>
                        <th class="hidden sm:table-cell">เข้า/ออก</th>
                        <th>สถานะ</th>
                        <th v-if="auth.user?.role !== 'viewer'" class="text-center">จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="devices.length === 0">
                        <td colspan="8" class="text-center py-8 text-base-content/60">
                            ไม่พบข้อมูลอุปกรณ์
                        </td>
                    </tr>
                    <tr v-for="(device, index) in devices" :key="device._id"
                        class="hover:bg-base-200 transition-colors">
                        <td class="text-center hidden xl:table-cell">{{ index + 1 }}</td>
                        <td class="font-medium">{{ device.serial_number }}</td>
                        <td class="hidden sm:table-cell">{{ device.ipaddress }}</td>
                        <td>{{ device.location }}</td>
                        <td class="hidden xl:table-cell">{{ formatDateTime(device.current_time) }}</td>
                        <td class="hidden sm:table-cell">{{ formatGateType(device.gate_type) }}</td>
                        <td>
                            <span
                                :class="isOnline(device.current_time) ? 'inline-block w-3 h-3 rounded-full bg-green-500 mr-2 align-middle' : 'inline-block w-3 h-3 rounded-full bg-red-500 mr-2 align-middle'"
                                :title="isOnline(device.current_time) ? 'ออนไลน์' : 'ออฟไลน์'"></span>
                        </td>
                        <td v-if="auth.user?.role !== 'viewer'" class="text-center">
                            <div class="flex gap-2 justify-center">
                                <button @click="$emit('edit', device)" class="btn btn-sm btn-warning btn-outline">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button @click="$emit('delete', device._id)" class="btn btn-sm btn-error btn-outline">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()

const isMobile = ref(window.innerWidth < 1050)
const handleResize = () => {
    isMobile.value = window.innerWidth < 1050
}
onMounted(() => {
    window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
defineProps({
    devices: {
        type: Array,
        required: true,
        default: () => []
    }
})

defineEmits(['edit', 'delete'])

const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-'
    try {
        const date = new Date(dateTimeString)
        return date.toLocaleString('th-TH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    } catch (error) {
        return dateTimeString
    }
}

const formatGateType = (gateType) => {
    if (!gateType) return '-'
    const s = String(gateType).toLowerCase()
    if (s === 'in' || s === 'enter' || s === 'entry') return 'เข้า'
    if (s === 'out' || s === 'exit') return 'ออก'
    return gateType
}

const formatStatus = (status) => {
}

const isOnline = (currentTime) => {
    if (!currentTime) return false
    try {
        const now = new Date()
        const deviceTime = new Date(currentTime)
        const diffMs = now - deviceTime
        const diffMin = diffMs / 1000 / 60
        return diffMin <= 3
    } catch (e) {
        return false
    }
}
</script>

<style scoped>
.table :where(thead, tbody) :where(tr:not(:last-child)),
.table :where(thead, tbody) :where(tr:first-child:last-child) {
    border-bottom-width: 1px;
    border-bottom-color: hsl(var(--b3) / 0.2);
}
</style>