<template>
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <div class="overflow-x-auto" style="overflow: visible;">
                <table class="table table-zebra table-xs sm:table-sm md:table-md">
                    <thead>
                        <tr>
                            <th class="bg-primary text-primary-content hidden lg:table-cell">#</th>
                            <th class="bg-primary text-primary-content">ชื่อ-นามสกุล</th>
                            <th class="bg-primary text-primary-content hidden sm:table-cell">รหัสบุคลากร</th>
                            <th class="bg-primary text-primary-content hidden md:table-cell">
                                <div class="dropdown dropdown-end">
                                    <label tabindex="0"
                                        class="btn btn-ghost btn-xs text-primary-content hover:bg-primary-focus">
                                        แผนก
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </label>
                                    <ul tabindex="0"
                                        class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 text-black border border-base-300 max-h-96 overflow-y-auto"
                                        style="z-index: 1000;">
                                        <li><a @click.prevent="handleDepartmentFilter('')">ทั้งหมด</a></li>
                                        <li v-for="dept in departments" :key="dept._id">
                                            <a @click.prevent="handleDepartmentFilter(dept.name)">
                                                {{ getShortDepartmentName(dept.name) }}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </th>
                            <th class="bg-primary text-primary-content hidden lg:table-cell">
                                <div class="dropdown dropdown-end">
                                    <label tabindex="0"
                                        class="btn btn-ghost btn-xs text-primary-content hover:bg-primary-focus">
                                        ตำแหน่ง
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </label>
                                    <ul tabindex="0"
                                        class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-64 text-black border border-base-300 max-h-96 overflow-y-auto"
                                        style="z-index: 1000;">
                                        <li><a @click.prevent="handlePositionFilter('')">ทั้งหมด</a></li>
                                        <li v-for="pos in positions" :key="pos._id">
                                            <a @click.prevent="handlePositionFilter(pos.name)">{{ pos.name }}</a>
                                        </li>
                                    </ul>
                                </div>
                            </th>
                            <th class="bg-primary text-primary-content text-center">สถานะ</th>
                            <th v-if="auth.user?.role !== 'teacher'"
                                class="bg-primary text-primary-content w-24 text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="8" class="text-center py-8">
                                <span class="loading loading-spinner loading-lg text-primary"></span>
                            </td>
                        </tr>
                        <tr v-else-if="teachers.length === 0">
                            <td colspan="8" class="text-center py-8 text-base-content/50">
                                ไม่มีข้อมูลบุคลากร
                            </td>
                        </tr>
                        <tr v-else v-for="(teacher, index) in teachers" :key="teacher.id" class="hover">
                            <td class="hidden lg:table-cell">{{ getRowNumber(index) }}</td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="avatar">
                                        <div class="w-10 h-10 rounded-full">
                                            <img v-if="teacher.picture" :src="teacher.picture" :alt="teacher.name"
                                                class="w-full h-full object-cover" @error="teacher.picture = null"/>
                                            <div v-else
                                                class="w-full h-full bg-primary text-primary-content flex items-center justify-center">
                                                <span class="text-sm font-semibold">{{ getInitials(teacher.name)
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
                                    <span class="font-medium">{{ teacher.name }}</span>
                                </div>
                            </td>
                            <td class="hidden sm:table-cell">{{ teacher.code }}</td>
                            <td class="hidden md:table-cell">
                                <span class="badge badge-ghost badge-sm">{{ teacher.department }}</span>
                            </td>
                            <td class="hidden lg:table-cell text-xs">{{ teacher.position }}</td>
                            <td class="text-center">
                                <button class="btn btn-ghost btn-xs"
                                    :title="teacher.has_password ? 'มีรหัสผ่าน' : 'ยังไม่มีรหัสผ่าน'"
                                    @click="emitReset(teacher)">
                                    <span :class="teacher.has_password ? 'bg-green-500' : 'bg-red-500'"
                                        class="inline-block w-3 h-3 rounded-full"></span>
                                </button>
                            </td>
                            <td v-if="auth.user?.role !== 'teacher'">
                                <div class="flex gap-2 justify-center">
                                    <button @click="$emit('edit', teacher)" class="btn btn-sm btn-warning btn-outline"
                                        title="แก้ไข">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button @click="$emit('delete', teacher)" class="btn btn-sm btn-error btn-outline"
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
import { ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'
const auth = useAuthStore()

const emit = defineEmits(['filterDepartment', 'filterPosition', 'edit', 'reset'])

const props = defineProps({
    teachers: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    departmentFilter: {
        type: String,
        default: ''
    },
    positionFilter: {
        type: String,
        default: ''
    },
    departments: {
        type: Array,
        default: () => []
    },
    positions: {
        type: Array,
        default: () => []
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

const localDepartmentFilter = ref(props.departmentFilter)
const localPositionFilter = ref(props.positionFilter)

watch(() => props.departmentFilter, (newVal) => {
    localDepartmentFilter.value = newVal
})

watch(() => props.positionFilter, (newVal) => {
    localPositionFilter.value = newVal
})

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

const getShortDepartmentName = (name) => {
    if (!name) return ''

    if (name.startsWith('กลุ่มสาระการเรียนรู้')) {
        const shortName = name.replace('กลุ่มสาระการเรียนรู้', 'กลุ่ม')
        return shortName.replace(' และ', '')
    }

    return name
}

const getRowNumber = (index) => {
    return (props.currentPage - 1) * props.itemsPerPage + index + 1
}

const handleDepartmentFilter = (value) => {
    localDepartmentFilter.value = value
    emit('filterDepartment', value)
}

const handlePositionFilter = (value) => {
    localPositionFilter.value = value
    emit('filterPosition', value)
}

const emitReset = (teacher) => {
    emit('reset', teacher)
}
</script>

<style scoped></style>
