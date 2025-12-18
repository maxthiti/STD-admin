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
                    <div class="flex items-center gap-2 w-full">
                        <div class="flex-1">
                            <input v-model.trim="form.password" :type="passwordVisible ? 'text' : 'password'"
                                placeholder="กรอก password" class="input input-bordered w-full"
                                :class="{ 'input-error': errors.password }" required />
                        </div>
                        <button type="button"
                            class="ml-2 text-primary bg-transparent border-none text-sm px-2 py-1 focus:outline-none"
                            tabindex="-1" @click="togglePassword" aria-label="แสดง/ซ่อนรหัสผ่าน">
                            <span>{{ passwordVisible ? 'ซ่อน' : 'แสดง' }}</span>
                        </button>
                    </div>
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

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">สิทธิ์ผู้ใช้ (Role) <span class="text-error">*</span></span>
                    </label>
                    <select v-model="form.role" class="select select-bordered w-full"
                        :class="{ 'select-error': errors.role }" required>
                        <option disabled value="">เลือกสิทธิ์ผู้ใช้</option>
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                    </select>
                    <label v-if="errors.role" class="label">
                        <span class="label-text-alt text-error">{{ errors.role }}</span>
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

const passwordVisible = ref(false)

const togglePassword = () => {
    passwordVisible.value = !passwordVisible.value
}

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
    name: '',
    role: ''
})

const errors = reactive({
    username: '',
    password: '',
    name: '',
    role: ''
})

const resetForm = () => {
    form.username = ''
    form.password = ''
    form.name = ''
    form.role = ''
    errors.username = ''
    errors.password = ''
    errors.name = ''
    errors.role = ''
    errorMessage.value = ''
}

const validateForm = () => {
    let isValid = true
    errors.username = ''
    errors.password = ''
    errors.name = ''
    errors.role = ''

    if (!form.username || form.username.length < 4) {
        errors.username = 'Username ต้องมีอย่างน้อย 4 ตัวอักษร'
        isValid = false
    }

    if (!form.password || form.password.length < 4) {
        errors.password = 'Password ต้องมีอย่างน้อย 4 ตัวอักษร'
        isValid = false
    }

    if (!form.name || form.name.length < 2) {
        errors.name = 'กรุณากรอกชื่อ-นามสกุล'
        isValid = false
    }

    if (!form.role || (form.role !== 'admin' && form.role !== 'viewer')) {
        errors.role = 'กรุณาเลือกสิทธิ์ผู้ใช้'
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
            name: form.name,
            role: form.role
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
