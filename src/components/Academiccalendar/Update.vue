<template>
    <dialog ref="modalRef" :id="modalId" class="modal">
        <div class="modal-box max-w-4xl">
            <h3 class="font-bold text-lg mb-2 text-primary">แก้ไขปฏิทินการศึกษา ปี {{ year }}</h3>
            <p class="text-sm text-base-content/70 mb-4">แก้ไขหรือเพิ่มรายการทั้งหมดของปีนี้ แล้วกดบันทึกครั้งเดียว
            </p>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="max-h-[60vh] overflow-y-auto pr-1 space-y-3">
                    <div v-for="(term, index) in formTerms" :key="index" class="rounded-lg border border-base-300 p-3">
                        <div class="flex items-center justify-between mb-3">
                            <p class="font-semibold">รายการที่ {{ index + 1 }}</p>
                            <button type="button" class="btn btn-xs btn-outline btn-error"
                                :disabled="loading || formTerms.length <= 1" @click="removeTerm(index)">
                                ลบรายการนี้
                            </button>
                        </div>

                        <div class="form-control mb-2">
                            <label class="label">
                                <span class="label-text">รายการ <span class="text-error">*</span></span>
                            </label>
                            <input v-model.trim="term.term" type="text" placeholder="เช่น เทอมที่ 1"
                                class="input input-bordered" :class="{ 'input-error': fieldErrors[index]?.term }" />
                            <label v-if="fieldErrors[index]?.term" class="label">
                                <span class="label-text-alt text-error">{{ fieldErrors[index].term }}</span>
                            </label>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">วันเริ่มต้น <span class="text-error">*</span></span>
                                </label>
                                <input v-model="term.start_date" type="date" class="input input-bordered"
                                    :class="{ 'input-error': fieldErrors[index]?.start_date }" />
                                <label v-if="fieldErrors[index]?.start_date" class="label">
                                    <span class="label-text-alt text-error">{{ fieldErrors[index].start_date }}</span>
                                </label>
                            </div>

                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">วันสิ้นสุด <span class="text-error">*</span></span>
                                </label>
                                <input v-model="term.end_date" type="date" class="input input-bordered"
                                    :class="{ 'input-error': fieldErrors[index]?.end_date }" />
                                <label v-if="fieldErrors[index]?.end_date" class="label">
                                    <span class="label-text-alt text-error">{{ fieldErrors[index].end_date }}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" class="btn btn-outline btn-primary btn-sm" @click="addTerm" :disabled="loading">
                    + เพิ่มรายการ
                </button>

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
                        <span v-else>บันทึกทั้งหมด</span>
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
    terms: {
        type: Array,
        default: () => []
    },
    modalId: {
        type: String,
        default: 'update_academic_calendar_modal'
    }
})

const emit = defineEmits(['close', 'success'])

const modalRef = ref(null)
const academicCalendarService = new AcademicCalendarService()
const loading = ref(false)
const errorMessage = ref('')
const formTerms = ref([])
const fieldErrors = ref([])

const normalizeDateInput = (value) => {
    if (!value) return ''
    return String(value).substring(0, 10)
}

const emptyTerm = () => ({
    term: '',
    start_date: '',
    end_date: ''
})

const resetForm = () => {
    const mappedTerms = (props.terms || []).map((term) => ({
        term: term.term ?? '',
        start_date: normalizeDateInput(term.start_date),
        end_date: normalizeDateInput(term.end_date)
    }))

    formTerms.value = mappedTerms.length ? mappedTerms : [emptyTerm()]
    fieldErrors.value = formTerms.value.map(() => ({ term: '', start_date: '', end_date: '' }))
    errorMessage.value = ''
}

const addTerm = () => {
    formTerms.value.push(emptyTerm())
    fieldErrors.value.push({ term: '', start_date: '', end_date: '' })
}

const removeTerm = (index) => {
    if (formTerms.value.length <= 1) return
    formTerms.value.splice(index, 1)
    fieldErrors.value.splice(index, 1)
}

const applyDuplicateTermError = (duplicateTermName) => {
    const target = (duplicateTermName || '').trim().toLowerCase()
    if (!target) return false

    let found = false
    formTerms.value.forEach((term, index) => {
        if ((term.term || '').trim().toLowerCase() === target) {
            fieldErrors.value[index].term = 'ชื่อซ้ำกันในรายการ'
            found = true
        }
    })

    return found
}

const validateForm = () => {
    let isValid = true
    fieldErrors.value = formTerms.value.map(() => ({ term: '', start_date: '', end_date: '' }))

    formTerms.value.forEach((term, index) => {
        if (!term.term || !term.term.trim()) {
            fieldErrors.value[index].term = 'กรุณากรอกชื่อ'
            isValid = false
        }

        if (!term.start_date) {
            fieldErrors.value[index].start_date = 'กรุณาเลือกวันเริ่มต้น'
            isValid = false
        }

        if (!term.end_date) {
            fieldErrors.value[index].end_date = 'กรุณาเลือกวันสิ้นสุด'
            isValid = false
        }

        if (term.start_date && term.end_date && term.start_date >= term.end_date) {
            fieldErrors.value[index].end_date = 'วันสิ้นสุดต้องหลังจากวันเริ่มต้น'
            isValid = false
        }
    })

    const firstIndexByTerm = new Map()
    formTerms.value.forEach((term, index) => {
        const key = (term.term || '').trim().toLowerCase()
        if (!key) return

        if (firstIndexByTerm.has(key)) {
            const firstIndex = firstIndexByTerm.get(key)
            fieldErrors.value[firstIndex].term = 'ชื่อซ้ำกันในรายการ'
            fieldErrors.value[index].term = 'ชื่อซ้ำกันในรายการ'
            isValid = false
            return
        }

        firstIndexByTerm.set(key, index)
    })

    return isValid
}

const handleSubmit = async () => {
    if (!validateForm()) return

    loading.value = true
    errorMessage.value = ''

    try {
        const payloadTerms = formTerms.value.map((term) => ({
            term: term.term.trim(),
            start_date: term.start_date,
            end_date: term.end_date
        }))

        await academicCalendarService.updateAcademicCalendar(props.year, { terms: payloadTerms })
        emit('success')
        handleClose()
    } catch (error) {
        console.error('Update academic calendar error:', error)
        const backendError = error.response?.data?.error || ''
        const duplicateTermName = backendError.startsWith('duplicate term in request:')
            ? backendError.split(':').slice(1).join(':').trim()
            : ''

        if (duplicateTermName) {
            applyDuplicateTermError(duplicateTermName)
            errorMessage.value = `ชื่อซ้ำกัน: ${duplicateTermName}`
            return
        }

        errorMessage.value = error.response?.data?.error || error.response?.data?.message || 'เกิดข้อผิดพลาดในการแก้ไขปฏิทินการศึกษา'
    } finally {
        loading.value = false
    }
}

const handleClose = () => {
    resetForm()
    emit('close')
    if (modalRef.value) {
        modalRef.value.close()
    }
}

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        resetForm()
        if (modalRef.value) {
            modalRef.value.showModal()
        }
    } else {
        if (modalRef.value) {
            modalRef.value.close()
        }
    }
})

watch(() => props.terms, () => {
    if (props.isOpen) {
        resetForm()
    }
}, { deep: true })
</script>

<style scoped></style>
