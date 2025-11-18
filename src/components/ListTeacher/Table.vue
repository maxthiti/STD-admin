<template>
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <div class="overflow-x-auto" style="overflow: visible;">
                <table class="table table-zebra table-xs sm:table-sm md:table-md">
                    <thead>
                        <tr>
                            <th class="bg-primary text-primary-content hidden lg:table-cell">#</th>
                            <th class="bg-primary text-primary-content">ชื่อ-นามสกุล</th>
                            <th class="bg-primary text-primary-content hidden sm:table-cell">รหัสอาจารย์</th>
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
                            <th class="bg-primary text-primary-content hidden xl:table-cell">อีเมล</th>
                            <!-- <th class="bg-primary text-primary-content hidden xl:table-cell">เบอร์โทร</th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="7" class="text-center py-8">
                                <span class="loading loading-spinner loading-lg text-primary"></span>
                            </td>
                        </tr>
                        <tr v-else-if="teachers.length === 0">
                            <td colspan="7" class="text-center py-8 text-base-content/50">
                                ไม่มีข้อมูลอาจารย์
                            </td>
                        </tr>
                        <tr v-else v-for="(teacher, index) in teachers" :key="teacher.id" class="hover">
                            <td class="hidden lg:table-cell">{{ index + 1 }}</td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="avatar">
                                        <div class="w-10 h-10 rounded-full">
                                            <img v-if="teacher.picture" :src="teacher.picture" :alt="teacher.name"
                                                class="w-full h-full object-cover" />
                                            <div v-else
                                                class="w-full h-full bg-primary text-primary-content flex items-center justify-center">
                                                <span class="text-sm font-semibold">{{ getInitials(teacher.name)
                                                    }}</span>
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
                            <td class="hidden xl:table-cell text-xs">{{ teacher.email }}</td>
                            <!-- <td class="hidden xl:table-cell">{{ teacher.phone }}</td> -->
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['filterDepartment', 'filterPosition'])

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
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

const getShortDepartmentName = (name) => {
    if (!name) return ''

    if (name.startsWith('กลุ่มสาระการเรียนรู้')) {
        const shortName = name.replace('กลุ่มสาระการเรียนรู้', 'กลุ่ม')
        return shortName.replace(' และ', '')
    }

    return name
}

const handleDepartmentFilter = (value) => {
    localDepartmentFilter.value = value
    emit('filterDepartment', value)
}

const handlePositionFilter = (value) => {
    localPositionFilter.value = value
    emit('filterPosition', value)
}
</script>

<style scoped></style>
