<template>
    <dialog ref="modalRef" :id="modalId" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4 text-error">ลบปฏิทินการศึกษา</h3>

            <div class="py-4">
                <p class="text-base-content mb-4">
                    คุณต้องการลบปฏิทินการศึกษา <span class="font-bold text-error">ปี {{ year }}</span> ใช่หรือไม่?
                </p>
                <p class="text-sm text-base-content/70">
                    ข้อมูลทั้งหมดจะถูกลบออกและไม่สามารถกู้คืนได้
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
                    <span v-else>ลบ</span>
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
import { AcademicCalendarService } from '../../api/academiccalendar'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    year: {
        type: [Number, String],
        default: () => new Date().getFullYear()
    },
    modalId: {
        type: String,
        default: 'delete_academic_calendar_modal'
    }
})

const emit = defineEmits(['close', 'success'])

const modalRef = ref(null)
const academicCalendarService = new AcademicCalendarService()
const loading = ref(false)
const errorMessage = ref('')

const handleDelete = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
        await academicCalendarService.deleteAcademicCalendar(props.year)
        emit('success')
        handleClose()
    } catch (error) {
        console.error('Delete academic calendar error:', error)
        errorMessage.value = error.response?.data?.message || 'เกิดข้อผิดพลาดในการลบปฏิทินการศึกษา'
    } finally {
        loading.value = false
    }
}

const handleClose = () => {
    errorMessage.value = ''
    emit('close')
    if (modalRef.value) {
        modalRef.value.close()
    }
}

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        errorMessage.value = ''
        if (modalRef.value) {
            modalRef.value.showModal()
        }
    } else {
        if (modalRef.value) {
            modalRef.value.close()
        }
    }
})
</script>

<style scoped></style>
