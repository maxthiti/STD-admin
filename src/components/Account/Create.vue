<template>
    <dialog ref="modalRef" :id="modalId" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4 text-primary">เพิ่มผู้ดูแลระบบ</h3>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Username <span class="text-error">*</span></span>
                    </label>
                    <input v-model.trim="form.username" type="text" placeholder="กรอก username"
                        class="input input-bordered" :class="{ 'input-error': errors.username }" required />
                    <label v-if="errors.username" class="label">
                        <span class="label-text-alt text-error">{{ errors.username }}</span>
                    </label>
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">Password <span class="text-error">*</span></span>
                    </label>
                    <input v-model.trim="form.password" type="password" placeholder="กรอก password"
                        class="input input-bordered" :class="{ 'input-error': errors.password }" required />
                    <label v-if="errors.password" class="label">
                        <span class="label-text-alt text-error">{{ errors.password }}</span>
                    </label>
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">ชื่อ-นามสกุล <span class="text-error">*</span></span>
                    </label>
                    <input v-model.trim="form.name" type="text" placeholder="กรอกชื่อ-นามสกุล"
                        class="input input-bordered" :class="{ 'input-error': errors.name }" required />
                    <label v-if="errors.name" class="label">
                        <span class="label-text-alt text-error">{{ errors.name }}</span>
                    </label>
                </div>

                <div v-if="errorMessage" class="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ errorMessage }}</span>
                </div>

                <div class="modal-action">
                    <button type="button" class="btn btn-ghost" @click="handleClose" :disabled="loading">
                        ยกเลิก
                    </button>
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
import { AccountService } from '../../api/account'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    modalId: {
        type: String,
        default: 'create_admin_modal'
    }
})

const emit = defineEmits(['close', 'success'])

const modalRef = ref(null)
const accountService = new AccountService()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
    username: '',
    password: '',
    name: ''
})

const errors = reactive({
    username: '',
    password: '',
    name: ''
})

const resetForm = () => {
    form.username = ''
    form.password = ''
    form.name = ''
    errors.username = ''
    errors.password = ''
    errors.name = ''
    errorMessage.value = ''
}

const validateForm = () => {
    let isValid = true
    errors.username = ''
    errors.password = ''
    errors.name = ''

    if (!form.username || form.username.length < 3) {
        errors.username = 'Username ต้องมีอย่างน้อย 3 ตัวอักษร'
        isValid = false
    }

    if (!form.password || form.password.length < 6) {
        errors.password = 'Password ต้องมีอย่างน้อย 6 ตัวอักษร'
        isValid = false
    }

    if (!form.name || form.name.length < 2) {
        errors.name = 'กรุณากรอกชื่อ-นามสกุล'
        isValid = false
    }

    return isValid
}

const handleSubmit = async () => {
    if (!validateForm()) return

    loading.value = true
    errorMessage.value = ''

    try {
        await accountService.createAdmin({
            username: form.username,
            password: form.password,
            name: form.name
        })

        emit('success')
        handleClose()
        resetForm()
    } catch (error) {
        console.error('Create admin error:', error)
        errorMessage.value = error.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มผู้ดูแลระบบ'
    } finally {
        loading.value = false
    }
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

watch(() => props.isOpen, (newVal) => {
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
</script>

<style scoped></style>
