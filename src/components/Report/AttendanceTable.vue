<template>
    <div class="hidden lg:block bg-base-100 rounded-lg shadow-lg overflow-x-auto">
        <table class="table table-zebra w-full">
            <thead>
                <tr class="bg-primary text-primary-content">
                    <th class="text-center">รหัส</th>
                    <th class="text-center">โปรไฟล์</th>
                    <th>ชื่อ-สกุล</th>
                    <th class="text-center">ตำแหน่ง</th>
                    <th class="text-center">ชั้นเรียน/แผนก</th>
                    <th class="text-center">เข้า</th>
                    <th class="text-center">ออก</th>
                    <th class="text-center">รายละเอียด</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="data.length === 0">
                    <td colspan="8" class="text-center py-8 text-base-content/60">
                        ไม่พบข้อมูล
                    </td>
                </tr>
                <tr v-for="item in data" :key="item._id" class="hover">
                    <td class="text-center">{{ item.userid }}</td>
                    <td class="text-center">
                        <div v-if="item.picture" class="avatar cursor-pointer inline-flex"
                            @click="openImage(item.picture)">
                            <div class="w-10 h-10 rounded">
                                <img :src="`${imgProBaseUrl}${item.picture}`" alt="profile"
                                    @error="item.picture = null" />
                            </div>
                        </div>
                        <div v-else class="avatar placeholder inline-flex">
                            <div
                                class="bg-neutral text-neutral-content w-10 h-10 rounded flex items-center justify-center">
                                <span class="text-base font-bold">{{ getInitials(item.name) }}</span>
                            </div>
                        </div>
                    </td>
                    <td>{{ item.name }}</td>
                    <td class="text-center">{{ item.position }}</td>
                    <td class="text-center">
                        <span v-if="item.department">{{ item.department }}</span>
                        <span v-else>{{ item.grade }}/{{ item.classroom }}</span>
                    </td>
                    <td class="text-center">
                        <span v-if="extractEntryExit(item).entry" class="badge badge-success badge-sm">{{
                            extractEntryExit(item).entry.time }}</span>
                        <span v-else class="badge badge-error badge-sm">ไม่มีเข้า</span>
                    </td>
                    <td class="text-center">
                        <span v-if="extractEntryExit(item).exit" class="badge badge-success badge-sm">{{
                            extractEntryExit(item).exit.time }}</span>
                        <span v-else class="badge badge-error badge-sm">ไม่มีออก</span>
                    </td>
                    <td class="text-center">
                        <button @click="$emit('viewDetail', item)" class="btn btn-sm btn-info btn-outline">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="lg:hidden space-y-4">
        <div v-if="data.length === 0" class="text-center py-8 text-base-content/60 bg-base-100 rounded-lg shadow-lg">
            ไม่พบข้อมูล
        </div>
        <div v-for="item in data" :key="item._id" class="bg-base-100 rounded-lg shadow-lg p-4 space-y-3">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="badge badge-primary badge-sm mb-2">{{ item.userid }}</div>
                    <h3 class="font-bold text-lg">{{ item.name }}</h3>
                    <p class="text-sm text-base-content/70">{{ item.position }}</p>
                </div>
                <div>
                    <div v-if="item.picture" class="avatar cursor-pointer" @click="openImage(item.picture)">
                        <div class="w-12 h-12 rounded">
                            <img :src="`${imgProBaseUrl}${item.picture}`" alt="profile" />
                        </div>
                    </div>
                    <div v-else class="avatar placeholder">
                        <div class="bg-neutral text-neutral-content w-12 h-12 rounded flex items-center justify-center">
                            <span class="text-base font-bold">{{ getInitials(item.name) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="divider my-2"></div>

            <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <span class="text-base-content/60">{{ item.department ? 'แผนก:' : 'ชั้นเรียน:' }}</span>
                    <p class="font-medium">{{ item.department || `${item.grade}/${item.classroom}` }}</p>
                </div>
            </div>

            <div class="divider my-2"></div>

            <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p class="text-xs text-base-content/60 mb-1">เข้า</p>
                    <span v-if="extractEntryExit(item).entry" class="badge badge-success badge-sm">{{
                        extractEntryExit(item).entry.time }}</span>
                    <span v-else class="badge badge-error badge-sm">ไม่มีเข้า</span>
                </div>
                <div>
                    <p class="text-xs text-base-content/60 mb-1">ออก</p>
                    <span v-if="extractEntryExit(item).exit" class="badge badge-success badge-sm">{{
                        extractEntryExit(item).exit.time }}</span>
                    <span v-else class="badge badge-error badge-sm">ไม่มีออก</span>
                </div>
            </div>

            <button @click="$emit('viewDetail', item)" class="btn btn-sm btn-info btn-outline w-full mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                ดูรายละเอียด
            </button>
        </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-4 text-xs">
        <div class="flex items-center gap-2">
            <span class="badge badge-success badge-xs">เวลา</span> แสดงเวลาที่เข้า/ออก
        </div>
        <div class="flex items-center gap-2">
            <span class="badge badge-error badge-xs">ไม่มี</span> ไม่มีข้อมูลเวลา
        </div>
    </div>

    <div v-if="pagination.total_pages > 1" class="flex justify-center mt-6">
        <div class="join">
            <button class="join-item btn btn-sm bg-transparent border-none"
                @click="$emit('page-change', pagination.page - 1)" :disabled="pagination.page === 1">
                «
            </button>
            <button v-for="page in displayedPages" :key="page" class="join-item btn btn-sm bg-transparent border-none"
                :class="page === pagination.page ? 'bg-base-content/20 font-bold' : ''"
                @click="$emit('page-change', page)">
                {{ page }}
            </button>
            <button class="join-item btn btn-sm bg-transparent border-none"
                @click="$emit('page-change', pagination.page + 1)"
                :disabled="pagination.page === pagination.total_pages">
                »
            </button>
        </div>
    </div>

    <div v-if="pagination.total_items > 0" class="text-center text-sm text-base-content/60 mt-4">
        แสดง {{ ((pagination.page - 1) * pagination.limit) + 1 }} - {{
            Math.min(pagination.page * pagination.limit, pagination.total_items)
        }} จาก {{ pagination.total_items }} รายการ
    </div>

    <dialog ref="imageModal" class="modal">
        <div class="modal-box max-w-7xl w-full p-0">
            <form method="dialog">
                <button
                    class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10 bg-white/80 hover:bg-white">✕</button>
            </form>
            <img v-if="selectedImage" :src="`${imgProBaseUrl}${selectedImage}`" alt="profile-large"
                class="w-full h-auto max-h-[90vh] object-contain" />
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
    pagination: {
        type: Object,
        required: true
    }
})

defineEmits(['viewDetail', 'page-change'])

const imgProBaseUrl = import.meta.env.VITE_IMG_PROFILE_URL
const imageModal = ref(null)
const selectedImage = ref(null)

const openImage = (image) => {
    if (!image) return
    selectedImage.value = image
    imageModal.value?.showModal()
}

const visiblePages = computed(() => {
    const current = props.pagination.page
    const total = props.pagination.total_pages
    const delta = 2
    const pages = []

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        pages.push(i)
    }

    if (current - delta > 2) {
        pages.unshift('...')
    }
    if (current + delta < total - 1) {
        pages.push('...')
    }

    if (total > 0) {
        pages.unshift(1)
        if (total > 1) {
            pages.push(total)
        }
    }

    return pages.filter((p, idx, arr) => p !== '...' || arr[idx - 1] !== '...')
})

const displayedPages = computed(() => {
    const total = props.pagination.total_pages
    const current = props.pagination.page
    const maxVisible = 5
    let startPage = Math.max(1, current - Math.floor(maxVisible / 2))
    let endPage = Math.min(total, startPage + maxVisible - 1)
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1)
    }
    const pages = []
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }
    return pages
})

const extractEntryExit = (item) => {
    if (!item.attendances || item.attendances.length === 0) return { entry: null, exit: null }
    const attendance = item.attendances[0]
    if (!attendance.timeStamps || attendance.timeStamps.length === 0) return { entry: null, exit: null }

    const stamps = attendance.timeStamps.map(ts => ({
        raw: ts.timestamp,
        hour: parseInt(ts.timestamp.split(' ')[1].split(':')[0]),
        time: ts.timestamp.split(' ')[1],
        image: ts.image,
        location: ts.location
    }))

    const entry = stamps.filter(s => s.hour < 12).sort((a, b) => a.raw.localeCompare(b.raw))[0] || null
    const exit = stamps.filter(s => s.hour >= 12).sort((a, b) => a.raw.localeCompare(b.raw))[0] || null
    return { entry, exit }
}

const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 3) {
        return (parts[1][0] || '') + (parts[2][0] || '')
    }
    if (parts.length === 2) {
        return (parts[0][0] || '') + (parts[1][0] || '')
    }
    return parts[0][0] || '?'
}
</script>

<style scoped>
.join {
    border-radius: 1.5rem;
    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
    background: #f8fafc;
}

.btn.bg-transparent {
    background: transparent;
}

.bg-base-content\/20 {
    background-color: #e5e7eb !important;
}
</style>