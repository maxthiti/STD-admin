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
                    <th class="text-center">เวลา</th>
                    <th class="text-center">เวลาสาย</th>
                    <th class="text-center">รูปภาพ</th>
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
                        <img v-if="item.picture" :src="`${imgProBaseUrl}${item.picture}`" alt="profile"
                            class="w-10 h-10 rounded-full object-cover inline-block cursor-pointer"
                            @click="viewImage(item.picture, true)" />
                        <div v-else class="w-10 h-10 rounded-full bg-base-200 inline-block"></div>
                    </td>
                    <td>{{ item.name }}</td>
                    <td class="text-center">{{ item.position }}</td>
                    <td class="text-center">
                        <span v-if="item.position === 'นักเรียน'">{{ item.grade }}/{{ item.classroom }}</span>
                        <span v-else>-</span>
                    </td>
                    <td class="text-center">
                        <span v-if="item.comming_time" class="badge badge-info badge-sm">{{
                            formatTime(item.comming_time) }}</span>
                        <span v-else class="text-base-content/50">-</span>
                    </td>
                    <td class="text-center">
                        <span v-if="computeLateTime(item.comming_time)" class="badge badge-warning badge-sm">{{
                            computeLateTime(item.comming_time) }}</span>
                        <span v-else class="text-base-content/50">-</span>
                    </td>
                    <td class="text-center">
                        <img v-if="item.image_snap" :src="`${imgBaseUrl}${item.image_snap}`" alt="late snapshot"
                            class="w-16 h-16 object-cover rounded-md cursor-pointer inline-block"
                            @click="viewImage(item.image_snap)" />
                        <span v-else class="text-base-content/50">-</span>
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
                    class="w-10 h-10 rounded-full object-cover cursor-pointer" @click="viewImage(item.picture, true)" />
                <div class="flex-1">
                    <div class="badge badge-primary badge-sm mb-2">{{ item.userid }}</div>
                    <h3 class="font-bold text-lg">{{ item.name }}</h3>
                    <p class="text-sm text-base-content/70">{{ item.position }}</p>
                </div>
            </div>

            <div class="divider my-2"></div>

            <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <span class="text-base-content/60">ชั้นเรียน:</span>
                    <p class="font-medium" v-if="item.position === 'นักเรียน'">{{ item.grade }}/{{ item.classroom }}</p>
                    <p class="font-medium" v-else>-</p>
                </div>
                <div>
                    <span class="text-base-content/60">เวลา:</span>
                    <p class="font-medium" v-if="item.comming_time">{{ formatTime(item.comming_time) }}</p>
                    <p class="font-medium" v-else>-</p>
                </div>
            </div>

            <div class="text-sm">
                <span class="text-base-content/60">เวลาสาย:</span>
                <p class="font-medium text-warning inline" v-if="computeLateTime(item.comming_time)">{{
                    computeLateTime(item.comming_time) }}</p>
                <p class="font-medium inline" v-else>-</p>
            </div>

            <img v-if="item.image_snap" :src="`${imgBaseUrl}${item.image_snap}`" alt="late snapshot"
                class="w-full h-40 object-cover rounded-md cursor-pointer" @click="viewImage(item.image_snap)" />
        </div>
    </div>

    <!-- <div class="mt-4 flex items-center gap-2 text-xs">
        <span class="badge badge-warning badge-xs">เวลาสาย</span> แสดง HH:MM:SS หลัง 08:00:00
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

const imgBaseUrl = import.meta.env.VITE_APP_IMG_URL
const imgProBaseUrl = import.meta.env.VITE_IMG_PROFILE_URL

const formatTime = (timestamp) => {
    return timestamp.split(' ')[1] || timestamp
}

const computeLateTime = (timestamp) => {
    if (!timestamp) return ''
    const parts = timestamp.split(' ')
    if (parts.length < 2) return ''
    const timePart = parts[1] // HH:MM:SS
    const [hStr, mStr, sStr] = timePart.split(':')
    const h = parseInt(hStr, 10)
    const m = parseInt(mStr, 10)
    const s = parseInt(sStr, 10)
    if ([h, m, s].some(v => isNaN(v))) return ''
    const totalSeconds = h * 3600 + m * 60 + s
    const baseSeconds = 8 * 3600 // 08:00:00
    const diff = totalSeconds - baseSeconds
    if (diff <= 0) return ''
    const dh = Math.floor(diff / 3600)
    const dm = Math.floor((diff % 3600) / 60)
    const ds = diff % 60
    return `${String(dh).padStart(2, '0')}:${String(dm).padStart(2, '0')}:${String(ds).padStart(2, '0')}`
}

const viewImage = (image, isProfile = false) => {
    emit('viewImage', { path: image, type: isProfile ? 'profile' : 'snap' })
}
</script>

<style scoped></style>