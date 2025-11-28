<template>
    <div class="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table class="table table-zebra table-xs sm:table-sm md:table-md">
            <thead>
                <tr>
                    <th class="bg-primary text-primary-content hidden min-[808px]:table-cell">ลำดับ</th>
                    <th class="bg-primary text-primary-content">User ID</th>
                    <th class="bg-primary text-primary-content hidden sm:table-cell">Role</th>
                    <th class="bg-primary text-primary-content">ชื่อ</th>
                    <th class="bg-primary text-primary-content text-center">จัดการ</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="loading">
                    <td colspan="5" class="text-center py-8">
                        <span class="loading loading-spinner loading-lg text-primary"></span>
                    </td>
                </tr>
                <tr v-else-if="!admins || admins.length === 0">
                    <td colspan="5" class="text-center py-8 text-base-content/50">
                        ไม่มีข้อมูลผู้ดูแลระบบ
                    </td>
                </tr>
                <tr v-else v-for="(admin, index) in admins" :key="admin._id" class="hover">
                    <td class="hidden min-[808px]:table-cell">{{ index + 1 }}</td>
                    <td class="whitespace-nowrap">{{ admin.userid }}</td>
                    <td class="hidden sm:table-cell">
                        <span class="badge badge-secondary badge-sm">{{ admin.role }}</span>
                    </td>
                    <td>
                        <div class="flex flex-col">
                            <span>{{ admin.name }}</span>
                            <span class="badge badge-secondary badge-xs sm:hidden mt-1">{{ admin.role }}</span>
                        </div>
                    </td>
                    <td class="text-center">
                        <button @click="handleDelete(admin)" class="btn btn-error btn-xs sm:btn-sm text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span v-if="auth.user?.role !== 'admin'" class="hidden min-[808px]:inline ml-1">ลบ</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
const auth = useAuthStore()

const props = defineProps({
    admins: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['delete'])

const handleDelete = (admin) => {
    emit('delete', admin)
}
</script>

<style scoped></style>
