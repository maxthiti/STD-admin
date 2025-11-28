<template>
    <div class="hidden lg:block bg-base-100 rounded-lg shadow-lg overflow-x-auto">
        <table class="table table-zebra w-full">
            <thead>
                <tr class="bg-primary text-primary-content">
                    <th class="text-center">รหัส</th>
                    <th class="text-center">รูป</th>
                    <th>ชื่อ-สกุล</th>
                    <th class="text-center">ตำแหน่ง</th>
                    <th class="text-center">ชั้นเรียน/แผนก</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="data.length === 0">
                    <td colspan="5" class="text-center py-8 text-base-content/60">
                        ไม่พบข้อมูล
                    </td>
                </tr>
                <tr v-for="item in data" :key="item._id" class="hover">
                    <td class="text-center">{{ item.userid }}</td>
                    <td class="text-center">
                        <img v-if="item.picture" :src="`${imgProBaseUrl}${item.picture}`" alt="profile"
                            class="w-10 h-10 rounded-full object-cover inline-block cursor-pointer"
                            @click="viewImage(item.picture)" />
                        <div v-else class="w-10 h-10 rounded-full bg-base-200 inline-block"></div>
                    </td>
                    <td>{{ item.name }}</td>
                    <td class="text-center">{{ item.position }}</td>
                    <td class="text-center">
                        <span v-if="item.position === 'นักเรียน'">{{ item.grade }}/{{ item.classroom }}</span>
                        <span v-else>-</span>
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
            <div class="flex items-start gap-3">
                <img v-if="item.picture" :src="`${imgProBaseUrl}${item.picture}`" alt="profile"
                    class="w-10 h-10 rounded-full object-cover cursor-pointer" @click="viewImage(item.picture)" />
                <div class="flex-1">
                    <div class="badge badge-primary badge-sm mb-2">{{ item.userid }}</div>
                    <h3 class="font-bold text-md">{{ item.name }}</h3>
                    <p class="text-sm text-base-content/70">{{ item.position }}</p>
                </div>
            </div>

            <div class="divider my-2"></div>

            <div class="text-sm">
                <span class="text-base-content/60">ชั้นเรียน:</span>
                <p class="font-medium inline ml-2" v-if="item.position === 'นักเรียน'">{{ item.grade }}/{{
                    item.classroom }}</p>
                <p class="font-medium inline ml-2" v-else>-</p>
            </div>
        </div>
    </div>

    <div v-if="pagination.total_pages > 1" class="flex justify-center mt-6">
        <div class="join shadow-lg">
            <button @click="$emit('page-change', 1)" class="join-item btn btn-sm" :disabled="pagination.page === 1">
                «
            </button>

            <button v-for="page in visiblePages" :key="page" @click="$emit('page-change', page)"
                :class="['join-item btn btn-sm', page === pagination.page ? 'btn-active' : '']">
                {{ page }}
            </button>

            <button @click="$emit('page-change', pagination.total_pages)" class="join-item btn btn-sm"
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
            <img v-if="selectedImage" :src="`${imgProBaseUrl}${selectedImage}`" alt="profile image"
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

const emit = defineEmits(['page-change'])

const imgProBaseUrl = import.meta.env.VITE_IMG_PROFILE_URL

const imageModal = ref(null)
const selectedImage = ref(null)

const MAX_VISIBLE_PAGES = 3

const visiblePages = computed(() => {
    const current = props.pagination.page
    const total = props.pagination.total_pages
    const maxPagesToShow = MAX_VISIBLE_PAGES

    if (total <= 1) {
        return []
    }

    if (total <= maxPagesToShow) {
        const pages = []
        for (let i = 1; i <= total; i++) {
            pages.push(i)
        }
        return pages
    }

    let startPage = current - Math.floor(maxPagesToShow / 2)
    let endPage = current + Math.floor(maxPagesToShow / 2)

    if (startPage < 1) {
        startPage = 1
        endPage = Math.min(total, maxPagesToShow)
    }

    if (endPage > total) {
        endPage = total
        startPage = Math.max(1, total - maxPagesToShow + 1)
    }

    const pages = []
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    return pages
})

const viewImage = (image) => {
    selectedImage.value = image
    imageModal.value?.showModal()
}
</script>

<style scoped></style>