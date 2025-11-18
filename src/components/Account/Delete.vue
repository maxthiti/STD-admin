<template>
    <dialog ref="modalRef" :id="modalId" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4 text-error">ยืนยันการลบผู้ดูแลระบบ</h3>

            <div class="py-4">
                <p class="mb-2">คุณต้องการลบผู้ดูแลระบบนี้หรือไม่?</p>
                <div v-if="admin" class="bg-base-200 p-4 rounded-lg space-y-2">
                    <p><strong>User ID:</strong> {{ admin.userid }}</p>
                    <p><strong>Role:</strong> <span class="badge badge-secondary">{{ admin.role }}</span></p>
                    <p><strong>ชื่อ:</strong> {{ admin.name }}</p>
                </div>
                <p class="text-error text-sm mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="inline h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    การดำเนินการนี้ไม่สามารถย้อนกลับได้
                </p>
            </div>

            <div v-if="errorMessage" class="alert alert-error mb-4">
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
                <button type="button" class="btn btn-error text-white" @click="handleDelete" :disabled="loading">
                    <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                    <span v-else>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        ลบ
                    </span>
                </button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button type="button" @click="handleClose" tabindex="-1" aria-label="Close modal">close</button>
        </form>
    </dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { AccountService } from '../../api/account'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    modalId: {
        type: String,
        default: 'delete_admin_modal'
    },
    admin: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close', 'success'])

const modalRef = ref(null)
const accountService = new AccountService()
const loading = ref(false)
const errorMessage = ref('')

const handleDelete = async () => {
    if (!props.admin || !props.admin._id) return

    loading.value = true
    errorMessage.value = ''

    try {
        await accountService.deleteAdmin(props.admin._id)
        emit('success')
        handleClose()
    } catch (error) {
        console.error('Delete admin error:', error)
        errorMessage.value = error.response?.data?.message || 'เกิดข้อผิดพลาดในการลบผู้ดูแลระบบ'
    } finally {
        loading.value = false
    }
}

const handleClose = () => {
    if (!loading.value) {
        errorMessage.value = ''
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
        errorMessage.value = ''
    }
})
</script>

<style scoped></style>
