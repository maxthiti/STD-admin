<template>
    <div class="card bg-base-100 shadow-md">
        <div class="card-body">
            <div v-if="loading" class="flex justify-center py-8">
                <span class="loading loading-spinner loading-lg text-primary"></span>
            </div>

            <div v-else-if="positions.length === 0" class="text-center py-8 text-base-content/60">
                ไม่มีข้อมูลตำแหน่ง
            </div>

            <div v-else class="overflow-x-auto">
                <table class="table table-zebra">
                    <thead>
                        <tr>
                            <th class="w-20">#</th>
                            <th>ชื่อตำแหน่ง</th>
                            <th class="w-24 text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(position, index) in positions" :key="position._id">
                            <td>{{ index + 1 }}</td>
                            <td class="font-medium">{{ position.name }}</td>
                            <td>
                                <div class="flex gap-2 justify-center">
                                    <button @click="$emit('delete', position)" class="btn btn-ghost btn-sm btn-square"
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
    positions: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

defineEmits(['delete'])
</script>

<style scoped></style>
