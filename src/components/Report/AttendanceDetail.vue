<template>
    <dialog ref="detailModal" class="modal">
        <div class="modal-box max-w-3xl">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>

            <div class="border-b-2 border-blue-200 pb-4 mb-6">
                <h3 class="text-xl font-bold text-blue-900">รายละเอียดการเข้า-ออก</h3>
            </div>

            <div v-if="selectedItem">
                <div class="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
                    <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p class="text-xs text-blue-600 mb-1">รหัส</p>
                        <p class="font-semibold text-blue-900">{{ selectedItem.userid }}</p>
                    </div>
                    <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <p class="text-xs text-yellow-600 mb-1">ชื่อ-สกุล</p>
                        <p class="font-semibold text-yellow-900">{{ selectedItem.name }}</p>
                    </div>
                    <div class="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p class="text-xs text-blue-600 mb-1">ตำแหน่ง</p>
                        <p class="font-semibold text-blue-900">{{ selectedItem.position }}</p>
                    </div>
                    <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <p class="text-xs text-yellow-600 mb-1">{{ selectedItem.department ? 'แผนก' : 'ชั้นเรียน' }}</p>
                        <p class="font-semibold text-yellow-900">
                            {{ selectedItem.department || `${selectedItem.grade}/${selectedItem.classroom}` }}
                        </p>
                    </div>
                </div>

                <div v-if="selectedAttendance">
                    <div class="mb-4">
                        <h4 class="font-semibold text-gray-700">บันทึกเวลา - {{
                            formatDate(selectedAttendance.date) }}</h4>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div v-for="(ts, idx) in selectedAttendance.timeStamps" :key="idx"
                            class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                            @click="openImageModal(ts.image)">
                            <img :src="`${imgBaseUrl}${ts.image}`" alt="attendance image"
                                class="w-full h-36 object-cover rounded-t-lg" />
                            <div class="p-3">
                                <p class="text-sm font-semibold text-blue-700 text-center mb-1">{{
                                    formatTime(ts.timestamp) }}</p>
                                <p class="text-xs text-gray-600 text-center">{{ ts.location }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                    ไม่มีข้อมูลการเข้า-ออก
                </div>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>

    <dialog ref="imageModal" class="modal">
        <div class="modal-box max-w-7xl w-full p-0">
            <form method="dialog">
                <button
                    class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10 bg-white/80 hover:bg-white">✕</button>
            </form>
            <img v-if="selectedImage" :src="`${imgBaseUrl}${selectedImage}`" alt="attendance image"
                class="w-full h-auto max-h-[90vh] object-contain" />
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<script setup>
import { ref } from 'vue'

// const imgBaseUrl = import.meta.env.VITE_APP_IMG_URL
const imgBaseUrl = import.meta.env.VITE_IMG_PROFILE_URL

const detailModal = ref(null)
const imageModal = ref(null)
const selectedItem = ref(null)
const selectedAttendance = ref(null)
const selectedImage = ref(null)

const openModal = (item, attendance = null) => {
    selectedItem.value = item
    selectedAttendance.value = attendance
    detailModal.value.showModal()
}

const openImageModal = (image) => {
    selectedImage.value = image
    imageModal.value.showModal()
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const formatTime = (timestamp) => {
    return timestamp.split(' ')[1] || timestamp
}

defineExpose({
    openModal
})
</script>

<style scoped></style>