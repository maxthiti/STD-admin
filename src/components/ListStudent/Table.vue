<template>
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <div class="block md:hidden">
                <div v-if="loading" class="flex justify-center py-8">
                    <span class="loading loading-spinner loading-lg text-primary"></span>
                </div>
                <div v-else-if="students.length === 0" class="text-center py-8 text-base-content/50">
                    ไม่มีข้อมูลนักเรียน
                </div>
                <div v-else class="space-y-4">
                    <div v-for="student in students" :key="student.id"
                        class="bg-base-200 rounded-lg p-4 flex flex-col gap-2 shadow hover:bg-base-300">
                        <div class="flex items-center gap-3">
                            <div class="avatar">
                                <div class="w-10 h-10 rounded-full">
                                    <img v-if="student.picture" :src="student.picture" :alt="student.name"
                                        class="w-full h-full object-cover" />
                                    <div v-else
                                        class="w-full h-full bg-secondary text-secondary-content flex items-center justify-center">
                                        <span class="text-sm font-semibold">{{ getInitials(student.name) }}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span class="font-medium">{{ student.name }}</span>
                                <div class="text-xs text-base-content/70">รหัส: {{ student.code }}</div>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 text-sm mt-2">
                            <span class="badge badge-primary badge-sm">{{ student.grade }}</span>
                            <span class="badge badge-outline badge-sm">ห้อง {{ student.room }}</span>
                        </div>
                        <div class="flex items-center justify-between mt-2">
                            <button class="btn btn-ghost btn-xs"
                                :title="student.has_password ? 'มีรหัสผ่าน' : 'ยังไม่มีรหัสผ่าน'"
                                @click="emitReset(student)">
                                <span :class="student.has_password ? 'bg-green-500' : 'bg-red-500'"
                                    class="inline-block w-3 h-3 rounded-full"></span>
                                <span class="ml-2 text-xs">{{ student.has_password ? 'มีรหัสผ่าน' : 'ยังไม่มีรหัสผ่าน'
                                }}</span>
                            </button>
                            <div class="flex gap-2">
                                <button class="btn btn-sm btn-warning btn-outline" @click="emitEdit(student)"
                                    title="แก้ไข">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button class="btn btn-sm btn-error btn-outline" @click="emitDelete(student)"
                                    title="ลบ">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hidden md:block overflow-x-auto">
                <table class="table table-zebra table-xs sm:table-sm md:table-md">
                    <thead>
                        <tr>
                            <th class="bg-primary text-primary-content hidden lg:table-cell">#</th>
                            <th class="bg-primary text-primary-content">ชื่อ-นามสกุล</th>
                            <th class="bg-primary text-primary-content hidden sm:table-cell">รหัสนักเรียน</th>
                            <th class="bg-primary text-primary-content">ระดับชั้น</th>
                            <th class="bg-primary text-primary-content hidden md:table-cell">ห้อง</th>
                            <th class="bg-primary text-primary-content text-center">สถานะ</th>
                            <th class="bg-primary text-primary-content text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="7" class="text-center py-8">
                                <span class="loading loading-spinner loading-lg text-primary"></span>
                            </td>
                        </tr>
                        <tr v-else-if="students.length === 0">
                            <td colspan="7" class="text-center py-8 text-base-content/50">
                                ไม่มีข้อมูลนักเรียน
                            </td>
                        </tr>
                        <tr v-else v-for="(student, index) in students" :key="student.id" class="hover">
                            <td class="hidden lg:table-cell">{{ getRowNumber(index) }}</td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="avatar">
                                        <div class="w-10 h-10 rounded-full">
                                            <img v-if="student.picture" :src="student.picture" :alt="student.name"
                                                class="w-full h-full object-cover" @error="student.picture = null" />
                                            <div v-else
                                                class="w-full h-full bg-secondary text-secondary-content flex items-center justify-center">
                                                <span class="text-sm font-semibold">{{ getInitials(student.name)
                                                    }}</span>
                                                <svg class="ml-1 w-4 h-4 text-base-content/50" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M5.121 17.804A9.001 9.001 0 0112 15c2.21 0 4.21.805 5.879 2.146M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <span class="font-medium">{{ student.name }}</span>
                                </div>
                            </td>
                            <td class="hidden sm:table-cell">{{ student.code }}</td>
                            <td>
                                <span class="badge badge-primary badge-sm">{{ student.grade }}</span>
                            </td>
                            <td class="hidden md:table-cell">{{ student.room }}</td>
                            <td class="text-center">
                                <button class="btn btn-ghost btn-xs"
                                    :title="student.has_password ? 'มีรหัสผ่าน' : 'ยังไม่มีรหัสผ่าน'"
                                    @click="emitReset(student)">
                                    <span :class="student.has_password ? 'bg-green-500' : 'bg-red-500'"
                                        class="inline-block w-3 h-3 rounded-full"></span>
                                </button>
                            </td>
                            <td>
                                <div class="flex gap-2 justify-center">
                                    <button class="btn btn-sm btn-warning btn-outline" @click="emitEdit(student)"
                                        title="แก้ไข">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button class="btn btn-sm btn-error btn-outline" @click="emitDelete(student)"
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
import axios from 'axios'
import { ref } from 'vue'
const props = defineProps({
    students: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    currentPage: {
        type: Number,
        default: 1
    },
    itemsPerPage: {
        type: Number,
        default: 5
    }
})

const emit = defineEmits(['edit', 'delete', 'reset'])

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

const getRowNumber = (index) => {
    return (props.currentPage - 1) * props.itemsPerPage + index + 1
}

const emitEdit = (student) => {
    emit('edit', student)
}

const emitDelete = (student) => {
    emit('delete', student)
}

const emitReset = (student) => {
    emit('reset', student)
}
</script>

<style scoped></style>
