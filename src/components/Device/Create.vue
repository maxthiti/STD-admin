<template>
    <dialog ref="createModal" class="modal">
        <div class="modal-box w-11/12 max-w-2xl">
            <h3 class="font-bold text-lg mb-4 text-primary">เพิ่มอุปกรณ์ใหม่</h3>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Serial Number <span class="text-error">*</span></span>
                    </label>
                    <input v-model="formData.serial_number" type="text" placeholder="กรอก Serial Number"
                        class="input input-bordered w-full" required />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">สถานที่ <span class="text-error">*</span></span>
                    </label>
                    <input v-model="formData.location" type="text" placeholder="กรอกสถานที่ติดตั้ง"
                        class="input input-bordered w-full" required />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">ประเภทประตู <span class="text-error">*</span></span>
                    </label>
                    <select v-model="formData.gate_type" class="select select-bordered w-full" required>
                        <option value="" disabled>เลือกประเภทประตู</option>
                        <option value="in">ทางเข้า (In)</option>
                        <option value="out">ทางออก (Out)</option>
                    </select>
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">ประเภทอุปกรณ์ <span class="text-error">*</span></span>
                    </label>
                    <select v-model="formData.device_type" class="select select-bordered w-full" required>
                        <option value="" disabled>เลือกประเภทอุปกรณ์</option>
                        <option value="ipcam">IP Camera</option>
                        <option value="Aifacescan">AI Face CC</option>
                    </select>
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Device Key</span>
                        <span class="label-text-alt text-base-content/60">(ไม่บังคับ)</span>
                    </label>
                    <input v-model="formData.device_key" type="text" placeholder="กรอก Device Key (ถ้าม)"
                        class="input input-bordered w-full" />
                </div>

                <div class="modal-action">
                    <button type="button" @click="closeModal" class="btn btn-ghost">ยกเลิก</button>
                    <button type="submit" class="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        เพิ่มอุปกรณ์
                    </button>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="closeModal">close</button>
        </form>
    </dialog>
</template>

<script setup>
import { ref } from 'vue'

const createModal = ref(null)
const emit = defineEmits(['success'])

const formData = ref({
    serial_number: '',
    location: '',
    gate_type: '',
    device_type: '',
    device_key: ''
})

const openModal = () => {
    if (createModal.value) {
        createModal.value.showModal()
    }
}

const closeModal = () => {
    if (createModal.value) {
        createModal.value.close()
        resetForm()
    }
}

const resetForm = () => {
    formData.value = {
        serial_number: '',
        location: '',
        gate_type: '',
        device_type: '',
        device_key: ''
    }
}

const handleSubmit = () => {
    emit('success', { ...formData.value })
}

defineExpose({
    openModal,
    closeModal
})
</script>

<style scoped></style>
