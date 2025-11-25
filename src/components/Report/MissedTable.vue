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
                    <h3 class="font-bold text-lg">{{ item.name }}</h3>
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

    <!-- <div class="mt-4 flex items-center gap-2 text-xs">
        <span class="badge badge-error badge-xs">ขาด</span> รายชื่อที่ไม่มาทั้งวัน
    </div> -->
</template>

<script setup>
defineProps({
    data: {
        type: Array,
        required: true,
    }
})

const emit = defineEmits(['viewImage'])

const imgProBaseUrl = import.meta.env.VITE_IMG_PROFILE_URL

const viewImage = (image) => {
    emit('viewImage', image)
}
</script>

<style scoped></style>