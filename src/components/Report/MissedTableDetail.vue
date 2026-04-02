<template>
    <dialog ref="detailModal" class="modal">
        <div class="max-w-3xl w-full p-6">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <component :is="detailComponent" v-bind="detailProps" @close="closeModal" />
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import AttendanceInfo from '../AttendanceInfo.vue'
import StudentDetail from '../ListStudent/Detail.vue'
import TeacherDetail from '../ListTeacher/Detail.vue'
const props = defineProps({
    student: { type: Object, required: true },
    role: { type: String, default: 'student' }
})

watch(() => props.student, (val) => {
    if (val) detailModal.value?.showModal()
})

const detailModal = ref(null)
const emit = defineEmits(['close'])

const detailComponent = computed(() => {
    if (props.useAttendanceInfo) return AttendanceInfo
    if (props.role === 'teacher') return TeacherDetail
    return StudentDetail
})

const detailProps = computed(() => {
    if (detailComponent.value === AttendanceInfo) {
        return {
            user: props.student,
            attendance: props.student.attendance || null,
            type: props.role || 'student',
        }
    }
    if (detailComponent.value === TeacherDetail) {
        return { teacher: props.student, visible: true }
    }
    return { student: props.student, visible: true }
})

function openModal(student, role = 'student') {
    detailModal.value?.showModal()
}

function closeModal() {
    detailModal.value?.close()
    emit('close')
}
defineExpose({ openModal })
</script>
