<template>
    <dialog ref="modalRef" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">เพิ่มตำแหน่ง</h3>
            <form @submit.prevent="handleSubmit">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">ชื่อตำแหน่ง</span>
                    </label>
                    <input v-model="formData.name" type="text" placeholder="กรอกชื่อตำแหน่ง"
                        class="input input-bordered" required />
                </div>
                <div class="modal-action">
                    <button type="button" @click="closeModal" class="btn btn-ghost">ยกเลิก</button>
                    <button type="submit" class="btn btn-primary" :disabled="loading">
                        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                        <span v-else>เพิ่ม</span>
                    </button>
                </div>
            </form>
        </div>
    </dialog>
</template>

<script setup>
import { ref } from 'vue'

const modalRef = ref(null)
const loading = ref(false)
const formData = ref({
    name: ''
})

const emit = defineEmits(['success'])

const openModal = () => {
    formData.value.name = ''
    modalRef.value.showModal()
}

const closeModal = () => {
    modalRef.value.close()
    formData.value.name = ''
}

const handleSubmit = async () => {
    emit('success', formData.value.name)
    closeModal()
}

defineExpose({
    openModal
})
</script>

<style scoped></style>
