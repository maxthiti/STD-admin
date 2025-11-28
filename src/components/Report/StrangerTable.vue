<template>
    <div class="hidden lg:block bg-base-100 rounded-lg shadow-lg overflow-x-auto">
        <table class="table table-zebra w-full">
            <thead>
                <tr class="bg-primary text-primary-content">
                    <th class="text-center">ลำดับ</th>
                    <th class="text-center">รหัส</th>
                    <th class="text-center">วันที่</th>
                    <th class="text-center">เวลา</th>
                    <th class="text-center">สถานที่</th>
                    <th class="text-center">รูปภาพ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="data.length === 0">
                    <td colspan="6" class="text-center py-8 text-base-content/60">
                        ไม่พบข้อมูล
                    </td>
                </tr>
                <tr v-for="(item, index) in data" :key="item._id" class="hover">
                    <td class="text-center">{{ startIndex + index + 1 }}</td>
                    <td class="text-center">{{ item.enrollid }}</td>
                    <td class="text-center">{{ formatDate(item.date) }}</td>
                    <td class="text-center">{{ formatTime(item.timeStamp) }}</td>
                    <td class="text-center">{{ item.device_location }}</td>
                    <td class="text-center">
                        <img v-if="item.imageUrl" :src="`${imgBaseUrl}${item.imageUrl}`" alt="snapshot"
                            class="w-16 h-16 object-cover inline-block cursor-pointer rounded"
                            @click="viewImage(item.imageUrl)" />
                        <div v-else class="w-16 h-16 bg-base-200 inline-block rounded"></div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="lg:hidden space-y-4">
        <div v-if="data.length === 0" class="text-center py-8 text-base-content/60 bg-base-100 rounded-lg shadow-lg">
            ไม่พบข้อมูล
        </div>
        <div v-for="(item, index) in data" :key="item._id" class="bg-base-100 rounded-lg shadow-lg p-4 space-y-3">
            <div class="flex items-start gap-3">
                <div class="badge badge-primary">{{ startIndex + index + 1 }}</div>
                <div class="flex-1">
                    <div class="badge badge-neutral badge-sm mb-2">{{ item.enrollid }}</div>
                    <p class="text-sm text-base-content/70">{{ formatDate(item.date) }} {{ formatTime(item.timeStamp) }}
                    </p>
                    <p class="text-sm font-medium mt-1">{{ item.device_location }}</p>
                </div>
            </div>

            <div v-if="item.imageUrl" class="flex justify-center">
                <img :src="`${imgBaseUrl}${item.imageUrl}`" alt="snapshot"
                    class="w-24 h-24 object-cover rounded-lg cursor-pointer" @click="viewImage(item.imageUrl)" />
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
    startIndex: {
        type: Number,
        default: 0,
    }
})

const emit = defineEmits(['viewImage'])

const imgBaseUrl = import.meta.env.VITE_APP_IMG_URL

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
}

const formatTime = (timestamp) => {
    if (!timestamp) return '-'
    const parts = timestamp.split(' ')
    return parts.length > 1 ? parts[1] : timestamp
}

const viewImage = (image) => {
    emit('viewImage', image)
}
</script>

<style scoped></style>