<template>
    <dialog ref="modalRef" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">เพิ่มห้องเรียน</h3>
            <form @submit.prevent="handleSubmit" class="space-y-4">

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">ชั้นปี</span>
                    </label>
                    <select v-model="formData.grade" class="select select-bordered" required
                        @change="handleGradeChange">
                        <option value="">เลือกชั้นปี</option>
                        <option v-for="grade in availableGrades" :key="grade.value" :value="grade.value">{{ grade.label
                            }}</option>
                    </select>
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">ห้อง</span>
                    </label>
                    <input v-model.number="formData.classroom" type="number" min="1" max="99"
                        class="input input-bordered" :placeholder="nextClassroomNumberText" required />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">ครูประจำห้อง</span>
                    </label>
                    <select v-model="formData.adviser" class="select select-bordered" required>
                        <option value="">เลือกครูประจำห้อง</option>
                        <option v-for="teacher in filteredTeachers" :key="teacher.id" :value="teacher.id">
                            {{ teacher.name }} ({{ teacher.position }})
                        </option>
                    </select>
                </div>

                <div class="modal-action">
                    <button type="button" @click="closeModal" class="btn btn-ghost">ยกเลิก</button>
                    <button type="submit" class="btn btn-primary" :disabled="loading">
                        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                        <span v-else>บันทึก</span>
                    </button>
                </div>
            </form>
        </div>
    </dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    classrooms: {
        type: Array,
        default: () => []
    },
    teachers: {
        type: Array,
        default: () => []
    },
    availableGrades: {
        type: Array,
        default: () => []
    }
})

const modalRef = ref(null)
const loading = ref(false)
const formData = ref({
    grade: '',
    classroom: '',
    adviser: ''
})

const emit = defineEmits(['success'])

const filteredTeachers = computed(() => {
    const allowedPositions = [
        'หัวหน้ากลุ่มสาระการเรียนรู้',
        'รองหัวหน้ากลุ่มสาระการเรียนรู้',
        'ครู'
    ]
    return props.teachers.filter(t => allowedPositions.includes(t.position))
})

const nextClassroomNumber = computed(() => {
    if (!formData.value.grade) return 1
    const rooms = props.classrooms.filter(c => c.grade === formData.value.grade).map(c => c.classroom)
    for (let i = 1; i <= 99; i++) {
        if (!rooms.includes(i)) return i
    }
    return rooms.length + 1
})

const nextClassroomNumberText = computed(() => {
    return `ห้องถัดไป: ${nextClassroomNumber.value}`
})

const handleGradeChange = () => {
    formData.value.classroom = nextClassroomNumber.value
}

const openModal = () => {
    formData.value = {
        grade: '',
        classroom: '',
        adviser: ''
    }
    modalRef.value.showModal()
}

const closeModal = () => {
    modalRef.value.close()
    formData.value = {
        grade: '',
        classroom: '',
        adviser: ''
    }
}

const handleSubmit = async () => {
    emit('success', formData.value)
    closeModal()
}

watch(() => formData.value.grade, (newVal) => {
    if (newVal) {
        formData.value.classroom = nextClassroomNumber.value
    }
})

defineExpose({
    openModal
})
</script>

<style scoped></style>
