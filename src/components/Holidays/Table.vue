<template>
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <div class="overflow-x-auto">
                <table class="table table-zebra table-xs sm:table-sm md:table-md">
                    <thead>
                        <tr>
                            <th class="bg-primary text-primary-content">ชื่อวันหยุด</th>
                            <th class="bg-primary text-primary-content">วันที่</th>
                            <th class="bg-primary text-primary-content text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="7" class="text-center py-8">
                                <span class="loading loading-spinner loading-lg text-primary"></span>
                            </td>
                        </tr>
                        <tr v-else-if="holidays.length === 0">
                            <td colspan="7" class="text-center py-8 text-base-content/50">
                                ไม่มีข้อมูลวันหยุด
                            </td>
                        </tr>
                        <tr v-else v-for="(item, idx) in holidays" :key="idx" class="hover">
                            <td>{{ item.summary }}</td>
                            <td>{{ formatDisplayDate(item.date) }}</td>
                            <td>
                                <div class="flex gap-2 justify-center">
                                    <button class="btn btn-sm btn-error btn-outline" @click="$emit('delete', item)"
                                        title="ลบ">
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
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    holidays: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

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
</script>
<style scoped>
.table th,
.table td {
    vertical-align: middle;
}
</style>