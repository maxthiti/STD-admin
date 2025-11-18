<template>
    <dialog ref="modalRef" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">ยืนยันการลบ</h3>
            <p class="py-4">คุณต้องการลบตำแหน่ง <span class="font-bold text-error">{{ position?.name }}</span>
                ใช่หรือไม่?</p>
            <div class="modal-action">
                <button @click="closeModal" class="btn btn-ghost">ยกเลิก</button>
                <button @click="handleDelete" class="btn btn-error" :disabled="loading">
                    <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                    <span v-else>ลบ</span>
                </button>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { ref } from 'vue'

const modalRef = ref(null)
const loading = ref(false)
const position = ref(null)

const emit = defineEmits(['success'])

const openModal = (pos) => {
    position.value = pos
    modalRef.value.showModal()
}

const closeModal = () => {
    modalRef.value.close()
    position.value = null
}

const handleDelete = async () => {
    emit('success', position.value._id)
    closeModal()
}

defineExpose({
    openModal
})
</script>

<style scoped></style>