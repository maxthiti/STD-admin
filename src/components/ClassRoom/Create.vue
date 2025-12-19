<template>
    <dialog ref="modalRef" class="modal">
        <div class="modal-box overflow-visible">
            <h3 class="font-bold text-lg mb-4">เพิ่มห้องเรียน</h3>
            <form @submit.prevent="handleSubmit" class="space-y-4">

                <div class="flex flex-row gap-4">
                    <div class="form-control flex-1">
                        <label class="label">
                            <span class="label-text">ชั้นปี</span>
                        </label>
                        <select v-model="formData.grade" class="select select-bordered w-full" required
                            @change="handleGradeChange">
                            <option value="">เลือกชั้นปี</option>
                            <option v-for="grade in availableGrades" :key="grade.value" :value="grade.value">{{
                                grade.label }}</option>
                        </select>
                    </div>
                    <div class="form-control flex-1">
                        <label class="label">
                            <span class="label-text">ห้อง</span>
                        </label>
                        <input v-model.number="formData.classroom" type="number" min="1" max="99"
                            class="input input-bordered w-full" :placeholder="nextClassroomNumberText" required />
                    </div>
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">ครูประจำชั้น (คนที่ 1)</span>
                    </label>
                    <div class="relative z-[50]" ref="adviserBoxRef">
                        <input ref="adviserInputRef" v-model="adviserQuery" type="text"
                            class="input input-bordered w-full" placeholder="พิมพ์เพื่อค้นหาและเลือกครู..."
                            @focus="adviserOpen = true" @input="adviserOpen = true" />
                        <button v-if="formData.adviser" type="button"
                            class="btn btn-ghost btn-xs absolute right-2 top-2" @click="clearAdviser">ลบ</button>
                        <ul v-if="adviserOpen"
                            class="bg-base-100 rounded-box shadow border absolute z-[50] bottom-full left-0 mb-2 w-full max-h-[50vh] overflow-y-auto overflow-x-hidden flex flex-col columns-1">
                            <li v-if="!filteredTeachersByAdviserQuery.length" class="px-3 py-2 text-sm opacity-70">
                                ไม่พบครูที่ตรงกับคำค้นหา
                            </li>
                            <li v-for="teacher in filteredTeachersByAdviserQuery" :key="teacher._id || teacher.id">
                                <button type="button" class="w-full text-left px-3 py-2 hover:bg-base-200"
                                    @click="selectAdviser(teacher)">
                                    {{ teacher.name }} ({{ teacher.position }})
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text">ครูประจำชั้น (คนที่ 2)</span>
                    </label>
                    <div class="relative z-[50]" ref="adviser2BoxRef">
                        <input ref="adviser2InputRef" v-model="adviser2Query" type="text"
                            class="input input-bordered w-full" placeholder="พิมพ์เพื่อค้นหาและเลือกครู..."
                            @focus="adviser2Open = true" @input="adviser2Open = true" />
                        <button v-if="formData.adviser2" type="button"
                            class="btn btn-ghost btn-xs absolute right-2 top-2" @click="clearAdviser2">ลบ</button>
                        <ul v-if="adviser2Open"
                            class="bg-base-100 rounded-box shadow border absolute z-[50] bottom-full left-0 mb-2 w-full max-h-[50vh] overflow-y-auto overflow-x-hidden flex flex-col columns-1">
                            <li v-if="!filteredTeachersByAdviser2Query.length" class="px-3 py-2 text-sm opacity-70">
                                ไม่พบครูที่ตรงกับคำค้นหา
                            </li>
                            <li v-for="teacher in filteredTeachersByAdviser2Query" :key="teacher._id || teacher.id">
                                <button type="button" class="w-full text-left px-3 py-2 hover:bg-base-200"
                                    @click="selectAdviser2(teacher)">
                                    {{ teacher.name }} ({{ teacher.position }})
                                </button>
                            </li>
                        </ul>
                    </div>
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

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
    adviser: '',
    adviser2: ''
})

const adviserQuery = ref('')
const adviserOpen = ref(false)
const adviserBoxRef = ref(null)
const adviserInputRef = ref(null)

const adviser2Query = ref('')
const adviser2Open = ref(false)
const adviser2BoxRef = ref(null)
const adviser2InputRef = ref(null)

const emit = defineEmits(['success'])

const filteredTeachers = computed(() => {
    const allowedPositions = [
        'หัวหน้ากลุ่มสาระการเรียนรู้',
        'รองหัวหน้ากลุ่มสาระการเรียนรู้',
        'ครู'
    ]
    return props.teachers.filter(t => allowedPositions.includes(t.position))
})

const filteredTeachersByAdviserQuery = computed(() => {
    const q = adviserQuery.value.trim().toLowerCase()
    if (!q) return filteredTeachers.value
    return filteredTeachers.value.filter(t => {
        const name = (t.name || '').toLowerCase()
        const position = (t.position || '').toLowerCase()
        return name.includes(q) || position.includes(q)
    })
})

const filteredTeachersByAdviser2Query = computed(() => {
    const q = adviser2Query.value.trim().toLowerCase()
    if (!q) return filteredTeachers.value
    return filteredTeachers.value.filter(t => {
        const name = (t.name || '').toLowerCase()
        const position = (t.position || '').toLowerCase()
        return name.includes(q) || position.includes(q)
    })
})

const selectAdviser = (teacher) => {
    formData.value.adviser = teacher._id || teacher.id
    adviserQuery.value = `${teacher.name} (${teacher.position})`
    adviserOpen.value = false
    if (formData.value.adviser2 === formData.value.adviser) {
        formData.value.adviser2 = ''
        adviser2Query.value = ''
    }
}

const clearAdviser = () => {
    formData.value.adviser = ''
    adviserQuery.value = ''
}

const selectAdviser2 = (teacher) => {
    formData.value.adviser2 = teacher._id || teacher.id
    adviser2Query.value = `${teacher.name} (${teacher.position})`
    adviser2Open.value = false
    if (formData.value.adviser2 === formData.value.adviser) {
        formData.value.adviser = ''
        adviserQuery.value = ''
    }
}

const clearAdviser2 = () => {
    formData.value.adviser2 = ''
    adviser2Query.value = ''
}

let _onDocClick = null
onMounted(() => {
    _onDocClick = (e) => {
        if (adviserOpen.value) {
            const box = adviserBoxRef.value
            if (box && !box.contains(e.target)) {
                adviserOpen.value = false
            }
        }
        if (adviser2Open.value) {
            const box2 = adviser2BoxRef.value
            if (box2 && !box2.contains(e.target)) {
                adviser2Open.value = false
            }
        }
    }
    document.addEventListener('click', _onDocClick)
})

onBeforeUnmount(() => {
    if (_onDocClick) document.removeEventListener('click', _onDocClick)
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
        adviser: '',
        adviser2: ''
    }
    adviserQuery.value = ''
    adviserOpen.value = false
    adviser2Query.value = ''
    adviser2Open.value = false
    modalRef.value.showModal()
}

const closeModal = () => {
    modalRef.value.close()
    formData.value = {
        grade: '',
        classroom: '',
        adviser: '',
        adviser2: ''
    }
    adviserQuery.value = ''
    adviserOpen.value = false
    adviser2Query.value = ''
    adviser2Open.value = false
}

const handleSubmit = async () => {
    if (!formData.value.adviser && !formData.value.adviser2) {
        alert('กรุณาเลือกครูประจำชั้นอย่างน้อย 1 คน')
        return
    }
    if (formData.value.adviser && formData.value.adviser2 && formData.value.adviser === formData.value.adviser2) {
        alert('ไม่สามารถเลือกครูคนเดียวกันซ้ำได้')
        return
    }
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
