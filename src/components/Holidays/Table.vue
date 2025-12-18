<template>
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-3">
            <div class="overflow-x-auto">
                <table class="table table-zebra table-xs sm:table-sm md:table-md">
                    <thead>
                        <tr>
                            <th class="bg-primary text-primary-content">ชื่อวันหยุด</th>
                            <th class="bg-primary text-primary-content">วันที่</th>
                            <th v-if="auth.user?.role !== 'viewer'" class="bg-primary text-primary-content text-center">จัดการ</th>
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
                        <tr v-else v-for="(item, idx) in pagedHolidays" :key="idx + (currentPage - 1) * pageSize"
                            class="hover">
                            <td>{{ item.summary }}</td>
                            <td>{{ formatDisplayDate(item.date) }}</td>
                            <td v-if="auth.user?.role !== 'viewer'">
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
            <div v-if="totalPages > 1" class="flex justify-center items-center mt-6">
                <div class="join gap-1">
                    <button class="join-item btn btn-sm" :disabled="currentPage === 1" @click="currentPage--">‹</button>
                    <template v-for="page in visiblePages" :key="page">
                        <button class="join-item btn btn-sm" :class="{ 'btn-active': page === currentPage }"
                            @click="currentPage = page">{{ page }}</button>
                    </template>
                    <button class="join-item btn btn-sm" :disabled="currentPage === totalPages"
                        @click="currentPage++">›</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()

const props = defineProps({
    holidays: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});


const pageSize = 10;
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(props.holidays.length / pageSize));
const pagedHolidays = computed(() => {
    const sorted = [...props.holidays].sort((a, b) => {
        const toISO = (d) => {
            if (typeof d === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
                const [day, month, year] = d.split('/');
                return `${year}-${month}-${day}`;
            }
            return d;
        };
        return new Date(toISO(a.date)) - new Date(toISO(b.date));
    });
    const start = (currentPage.value - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
});
watch(() => props.holidays, () => { currentPage.value = 1; });

// Pagination: แสดงเลขหน้าแบบ window
const visiblePages = computed(() => {
    const windowSize = 5;
    let start = Math.max(1, currentPage.value - Math.floor(windowSize / 2));
    let end = start + windowSize - 1;
    if (end > totalPages.value) {
        end = totalPages.value;
        start = Math.max(1, end - windowSize + 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

function formatDisplayDate(date) {
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [y, m, d] = date.split('-');
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
</script>
<style scoped>
.table th,
.table td {
    vertical-align: middle;
}
</style>