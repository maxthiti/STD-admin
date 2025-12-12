<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-sm relative animate-fade-in">
            <h2 class="text-lg font-bold mb-4">ยืนยันการลบวันหยุด</h2>
            <div class="mb-4">
                <div>ชื่อวันหยุด: <span class="font-semibold">{{ holiday?.summary }}</span></div>
                <div>วันที่: <span class="font-semibold">{{ formatDisplayDate(holiday?.date) }}</span></div>
            </div>
            <div class="flex justify-end gap-2">
                <button class="btn btn-outline" @click="$emit('cancel')">ยกเลิก</button>
                <button class="btn btn-error" @click="$emit('confirm')">ลบ</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    holiday: Object
})
function formatDisplayDate(date) {
    if (!date) return ''
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [y, m, d] = date.split('-')
        return `${d}/${m}/${y}`
    }
    if (typeof date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        return date
    }
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
}
</script>

<style scoped>
.animate-fade-in {
    animation: fade-in 0.2s ease;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
