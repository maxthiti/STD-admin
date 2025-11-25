<template>
    <div class="hidden lg:block bg-base-100 rounded-lg shadow-lg overflow-x-auto">
        <table class="table table-zebra w-full">
            <thead>
                <tr class="bg-primary text-primary-content">
                    <th class="text-center">รหัส</th>
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
                    <td colspan="6" class="text-center py-8 text-base-content/60">
                        ไม่พบข้อมูล
                    </td>
                </tr>
                <tr v-for="item in data" :key="item._id" class="hover">
                    <td class="text-center">{{ item.userid }}</td>
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
</template>

<script setup>
defineProps({
    data: {
        type: Array,
        required: true,
    }
})

defineEmits(['viewDetail'])

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
    const exit = stamps.filter(s => s.hour >= 12).sort((a, b) => b.raw.localeCompare(a.raw))[0] || null
    return { entry, exit }
}
</script>

<style scoped></style>
