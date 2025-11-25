<template>
    <div class="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table class="table w-full">
            <thead>
                <tr class="bg-base-200">
                    <th class="text-center">ลำดับ</th>
                    <th>Serial Number</th>
                    <th>IP Address</th>
                    <th>สถานที่</th>
                    <th>เวลาปัจจุบัน</th>
                    <th>เข้า/ออก</th>
                    <th>สถานะ</th>
                    <th class="text-center">จัดการ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="devices.length === 0">
                    <td colspan="8" class="text-center py-8 text-base-content/60">
                        ไม่พบข้อมูลอุปกรณ์
                    </td>
                </tr>
                <tr v-for="(device, index) in devices" :key="device._id" class="hover:bg-base-200 transition-colors">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="font-medium">{{ device.serial_number }}</td>
                    <td>{{ device.ipaddress }}</td>
                    <td>{{ device.location }}</td>
                    <td>{{ formatDateTime(device.current_time) }}</td>
                    <td>{{ formatGateType(device.gate_type) }}</td>
                    <td>{{ formatStatus(device.status) }}</td>
                    <td class="text-center">
                        <div class="flex gap-2 justify-center">
                            <button @click="$emit('edit', device)" class="btn btn-sm btn-warning btn-outline">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button @click="$emit('delete', device._id)" class="btn btn-sm btn-error btn-outline">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
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
    if (status === undefined || status === null || status === '') return '-'
    if (status === true) return 'ออนไลน์'
    if (status === false) return 'ออฟไลน์'
    const s = String(status).toLowerCase()
    if (s === 'online' || s === 'active') return 'ออนไลน์'
    if (s === 'offline' || s === 'inactive') return 'ออฟไลน์'
    return String(status)
}
</script>

<style scoped>
.table :where(thead, tbody) :where(tr:not(:last-child)),
.table :where(thead, tbody) :where(tr:first-child:last-child) {
    border-bottom-width: 1px;
    border-bottom-color: hsl(var(--b3) / 0.2);
}
</style>
