<template>
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <div class="overflow-x-auto">
                <table class="table table-zebra table-xs sm:table-sm md:table-md">
                    <thead>
                        <tr>
                            <th class="bg-primary text-primary-content hidden lg:table-cell">#</th>
                            <th class="bg-primary text-primary-content">ชื่อ-นามสกุล</th>
                            <th class="bg-primary text-primary-content hidden sm:table-cell">รหัสนักเรียน</th>
                            <th class="bg-primary text-primary-content">ระดับชั้น</th>
                            <th class="bg-primary text-primary-content hidden md:table-cell">ห้อง</th>
                            <th class="bg-primary text-primary-content hidden lg:table-cell">อีเมล</th>
                            <!-- <th class="bg-primary text-primary-content hidden xl:table-cell">เบอร์โทร</th> -->
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
                            <td class="hidden lg:table-cell">{{ index + 1 }}</td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="avatar">
                                        <div class="w-10 h-10 rounded-full">
                                            <img v-if="student.picture" :src="student.picture" :alt="student.name"
                                                class="w-full h-full object-cover" />
                                            <div v-else
                                                class="w-full h-full bg-secondary text-secondary-content flex items-center justify-center">
                                                <span class="text-sm font-semibold">{{ getInitials(student.name)
                                                    }}</span>
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
                            <td class="hidden lg:table-cell text-xs">{{ student.email }}</td>
                            <!-- <td class="hidden xl:table-cell">{{ student.phone }}</td> -->
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
    students: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}
</script>

<style scoped></style>
