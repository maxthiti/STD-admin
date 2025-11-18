<template>
    <dialog ref="modalRef" class="modal">
        <div class="modal-box max-w-2xl">
            <h3 class="font-bold text-lg mb-4">เพิ่มอาจารย์</h3>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">ชื่อ</span>
                        </label>
                        <input v-model="form.firstName" type="text" class="input input-bordered" required />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">นามสกุล</span>
                        </label>
                        <input v-model="form.lastName" type="text" class="input input-bordered" required />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">รหัสอาจารย์</span>
                        </label>
                        <input v-model="form.code" type="text" class="input input-bordered" required />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">แผนก</span>
                        </label>
                        <select v-model="form.department" class="select select-bordered" required>
                            <option value="">เลือกแผนก</option>
                            <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="สังคมศึกษา">สังคมศึกษา</option>
                        </select>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">อีเมล</span>
                        </label>
                        <input v-model="form.email" type="email" class="input input-bordered" required />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">เบอร์โทร</span>
                        </label>
                        <input v-model="form.phone" type="tel" class="input input-bordered" required />
                    </div>
                </div>

                <div class="modal-action">
                    <button type="button" class="btn" @click="handleClose">ยกเลิก</button>
                    <button type="submit" class="btn btn-primary" :disabled="loading">
                        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                        <span v-else>บันทึก</span>
                    </button>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button type="button" @click="handleClose" tabindex="-1" aria-label="Close modal">close</button>
        </form>
    </dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
    show: Boolean
})

const emit = defineEmits(['close', 'created'])

const modalRef = ref(null)
const form = reactive({
    firstName: '',
    lastName: '',
    code: '',
    department: '',
    email: '',
    phone: ''
})

const loading = ref(false)

const resetForm = () => {
    Object.keys(form).forEach(key => form[key] = '')
}

const handleClose = () => {
    if (!loading.value) {
        resetForm()
        if (modalRef.value) {
            modalRef.value.close()
        }
        emit('close')
    }
}

watch(() => props.show, (newVal) => {
    if (modalRef.value) {
        if (newVal) {
            modalRef.value.showModal()
        } else {
            modalRef.value.close()
        }
    }
    if (!newVal) {
        resetForm()
    }
})

const handleSubmit = async () => {
    loading.value = true
    try {
        console.log('Creating teacher:', form)

        await new Promise(resolve => setTimeout(resolve, 1000))

        emit('created')
        handleClose()
    } catch (error) {
        console.error('Error creating teacher:', error)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped></style>
