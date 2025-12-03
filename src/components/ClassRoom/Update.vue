<template>
    <dialog ref="modalRef" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">แก้ไขห้องเรียน</h3>
            <form @submit.prevent="handleSubmit" class="space-y-4">

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">ชั้นปี</span>
                    </label>
                    <input type="text" :value="formData.grade" class="input input-bordered" disabled />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">ห้อง</span>
                    </label>
                    <input type="text" :value="formData.classroom" class="input input-bordered" disabled />
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">ครูประจำห้อง</span>
                    </label>
                    <div v-if="currentTeacherName" class="mb-2 p-2 bg-base-200 rounded-lg">
                        <span class="text-sm text-base-content/70">ครูประจำชั้นปัจจุบัน: </span>
                        <span @click="goToTeacherPage" class="text-sm font-semibold text-primary">{{ currentTeacherName
                            }}</span>
                    </div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
    teachers: {
        type: Array,
        default: () => []
    }
})

const modalRef = ref(null)
const loading = ref(false)
const formData = ref({
    id: '',
    grade: '',
    classroom: '',
    adviser: ''
})
const currentTeacherName = ref('')
const goToTeacherPage = () => {
    if (currentTeacherName.value && currentTeacherName.value !== 'ไม่มีข้อมูล') {
        router.push({
            name: 'Teacher',
            query: { search: currentTeacherName.value }
        })
    }
}

const emit = defineEmits(['success'])

const filteredTeachers = computed(() => {
    const allowedPositions = [
        'หัวหน้ากลุ่มสาระการเรียนรู้',
        'รองหัวหน้ากลุ่มสาระการเรียนรู้',
        'ครู'
    ]
    return props.teachers.filter(t => allowedPositions.includes(t.position))
})

const openModal = (classroom) => {
    formData.value = {
        id: classroom._id,
        grade: classroom.grade,
        classroom: classroom.classroom,
        adviser: classroom.adviser?.id || classroom.adviser?._id || ''
    }
    currentTeacherName.value = classroom.adviser?.name || 'ไม่มีข้อมูล'
    modalRef.value.showModal()
}
const closeModal = () => {
    modalRef.value.close()
    formData.value = {
        id: '',
        grade: '',
        classroom: '',
        adviser: ''
    }
    currentTeacherName.value = ''
}

const handleSubmit = async () => {
    emit('success', formData.value)
    closeModal()
}

defineExpose({
    openModal
})
</script>

<style scoped></style>
