<template>
    <dialog ref="modalRef" class="modal">
        <div class="modal-box max-w-2xl">
            <h3 class="font-bold text-lg mb-4">แก้ไขข้อมูลอาจารย์</h3>
            <form @submit.prevent="handleSubmit">
                <!-- Current Image Preview -->
                <div v-if="currentImage || previewImage" class="flex justify-center mb-4">
                    <div class="relative">
                        <img :src="previewImage || currentImage" alt="Teacher Image"
                            class="w-32 h-32 object-cover rounded-lg shadow-md" />
                        <button v-if="previewImage" type="button" @click="removeNewImage"
                            class="absolute -top-2 -right-2 btn btn-circle btn-sm btn-error">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">รหัสอาจารย์</span>
                        </label>
                        <input v-model="formData.userid" type="text" class="input input-bordered" required />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">คำนำหน้า</span>
                        </label>
                        <select v-model="formData.pre_name" class="select select-bordered" required>
                            <option value="">เลือกคำนำหน้า</option>
                            <option value="นาย">นาย</option>
                            <option value="นาง">นาง</option>
                            <option value="นางสาว">นางสาว</option>
                        </select>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">ชื่อ</span>
                        </label>
                        <input v-model="formData.first_name" type="text" class="input input-bordered" required
                            @input="validateFirstName" :class="{ 'input-error': firstNameError }" autocomplete="off" />
                        <label v-if="firstNameError" class="label">
                            <span class="label-text-alt text-error">{{ firstNameError }}</span>
                        </label>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">นามสกุล</span>
                        </label>
                        <input v-model="formData.last_name" type="text" class="input input-bordered" required
                            @input="validateLastName" :class="{ 'input-error': lastNameError }" autocomplete="off" />
                        <label v-if="lastNameError" class="label">
                            <span class="label-text-alt text-error">{{ lastNameError }}</span>
                        </label>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">ตำแหน่ง</span>
                        </label>
                        <select v-model="formData.position" class="select select-bordered" required>
                            <option value="">เลือกตำแหน่ง</option>
                            <option v-for="pos in positions" :key="pos._id" :value="pos.name">{{ pos.name }}</option>
                        </select>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">แผนก</span>
                        </label>
                        <select v-model="formData.department" class="select select-bordered" required>
                            <option value="">เลือกแผนก</option>
                            <option v-for="dept in departments" :key="dept._id" :value="dept.name">{{ dept.name }}
                            </option>
                        </select>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">สถานะ</span>
                        </label>
                        <select v-model="formData.status" class="select select-bordered" required>
                            <option value="">เลือกสถานะ</option>
                            <option value="ปกติ">ปกติ</option>
                            <option value="พักงาน">พักงาน</option>
                        </select>
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">รูปภาพ (ถ้าต้องการเปลี่ยน)</span>
                        </label>
                        <input ref="fileInputRef" type="file" @change="handleFileChange" accept="image/jpeg,image/jpg"
                            class="file-input file-input-bordered" />
                        <label class="label">
                            <span class="label-text-alt text-gray-500">JPG only (สูงสุด 70KB)</span>
                        </label>
                        <div v-if="fileError" class="text-sm text-error mt-1">{{ fileError }}</div>
                    </div>
                </div>

                <div class="modal-action">
                    <button type="button" @click="closeModal" class="btn btn-ghost">ยกเลิก</button>
                    <button type="submit" class="btn btn-primary" :disabled="loading || !isFormValid">
                        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                        <span v-else>บันทึก</span>
                    </button>
                </div>
            </form>
        </div>
    </dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const modalRef = ref(null)
const loading = ref(false)
const teacherId = ref('')
const currentImage = ref('')
const previewImage = ref('')
const fileError = ref('')
const fileInputRef = ref(null)
const firstNameError = ref('')
const lastNameError = ref('')
const formData = ref({
    userid: '',
    pre_name: '',
    first_name: '',
    last_name: '',
    position: '',
    department: '',
    status: '',
    picture: null
})

const props = defineProps({
    departments: {
        type: Array,
        default: () => []
    },
    positions: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['success'])

const openModal = (teacher) => {
    teacherId.value = teacher.id
    currentImage.value = teacher.picture || ''
    previewImage.value = ''
    fileError.value = ''
    firstNameError.value = ''
    lastNameError.value = ''
    formData.value = {
        userid: teacher.userid,
        pre_name: teacher.name.split(' ')[0] || '',
        first_name: teacher.name.split(' ')[1] || '',
        last_name: teacher.name.split(' ').slice(2).join(' ') || '',
        position: teacher.position,
        department: teacher.department,
        status: 'ปกติ',
        picture: null
    }
    modalRef.value.showModal()
}

const closeModal = () => {
    modalRef.value.close()
    currentImage.value = ''
    previewImage.value = ''
    fileError.value = ''
    firstNameError.value = ''
    lastNameError.value = ''
    formData.value = {
        userid: '',
        pre_name: '',
        first_name: '',
        last_name: '',
        position: '',
        department: '',
        status: '',
        picture: null
    }
}

const handleFileChange = (event) => {
    const file = event.target.files[0]
    fileError.value = ''

    if (file) {
        // Validate file type (JPG only)
        if (!file.type.match('image/jpeg') && !file.type.match('image/jpg')) {
            fileError.value = 'กรุณาเลือกไฟล์ JPG เท่านั้น'
            event.target.value = ''
            return
        }

        // Validate file size (max 70KB)
        const maxSize = 70 * 1024 // 70KB in bytes
        if (file.size > maxSize) {
            fileError.value = `ขนาดไฟล์ใหญ่เกินไป (${(file.size / 1024).toFixed(2)}KB) กรุณาเลือกไฟล์ไม่เกิน 70KB`
            event.target.value = ''
            return
        }

        formData.value.picture = file

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            previewImage.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const nameRegex = /^[A-Za-z\u0E00-\u0E7F]+$/

const validateFirstName = () => {
    if (!formData.value.first_name) {
        firstNameError.value = 'กรุณากรอกชื่อ'
    } else if (!nameRegex.test(formData.value.first_name)) {
        firstNameError.value = 'ใส่ได้เฉพาะตัวอักษรภาษาไทยหรืออังกฤษเท่านั้น'
    } else {
        firstNameError.value = ''
    }
}

const validateLastName = () => {
    if (!formData.value.last_name) {
        lastNameError.value = 'กรุณากรอกนามสกุล'
    } else if (!nameRegex.test(formData.value.last_name)) {
        lastNameError.value = 'ใส่ได้เฉพาะตัวอักษรภาษาไทยหรืออังกฤษเท่านั้น'
    } else {
        lastNameError.value = ''
    }
}

const isFormValid = computed(() => {
    // both names required and valid; fileError must be empty
    return (
        !firstNameError.value &&
        !lastNameError.value &&
        formData.value.first_name &&
        formData.value.last_name &&
        !fileError.value
    )
})

const removeNewImage = () => {
    previewImage.value = ''
    fileError.value = ''
    formData.value.picture = null
    if (fileInputRef.value) {
        fileInputRef.value.value = ''
    }
}

const handleSubmit = async () => {
    // final validation before submit
    validateFirstName()
    validateLastName()
    if (!isFormValid.value) {
        const { default: Swal } = await import('sweetalert2')
        Swal.fire({
            icon: 'error',
            title: 'ข้อมูลไม่ถูกต้อง',
            text: 'กรุณากรอกชื่อและนามสกุลเป็นตัวอักษรเท่านั้น',
            confirmButtonColor: '#2563eb',
            didOpen: () => {
                document.getElementById('app')?.removeAttribute('aria-hidden')
            }
        })
        return
    }
    emit('success', teacherId.value, formData.value)
    closeModal()
}

defineExpose({
    openModal
})
</script>

<style scoped></style>
