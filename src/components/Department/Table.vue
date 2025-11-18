<template>
    <div class="card bg-base-100 shadow-md">
        <div class="card-body">
            <div v-if="loading" class="flex justify-center py-8">
                <span class="loading loading-spinner loading-lg text-primary"></span>
            </div>

            <div v-else-if="departments.length === 0" class="text-center py-8 text-base-content/60">
                ไม่มีข้อมูลแผนก
            </div>

            <div v-else class="overflow-x-auto">
                <table class="table table-zebra">
                    <thead>
                        <tr>
                            <th class="w-20">#</th>
                            <th>ชื่อแผนก</th>
                            <th class="w-32 text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(dept, index) in departments" :key="dept._id">
                            <td>{{ index + 1 }}</td>
                            <td class="font-medium">{{ dept.name }}</td>
                            <td>
                                <div class="flex gap-2 justify-center">
                                    <button @click="$emit('edit', dept)" class="btn btn-ghost btn-sm btn-square"
                                        title="แก้ไข">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button @click="$emit('delete', dept)" class="btn btn-ghost btn-sm btn-square"
                                        title="ลบ">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-error" fill="none"
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
defineProps({
    departments: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

defineEmits(['edit', 'delete'])
</script>

<style scoped></style>
