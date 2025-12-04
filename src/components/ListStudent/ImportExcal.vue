<template>
    <dialog ref="modalRef" class="modal">
        <div class="modal-box w-11/12 max-w-4xl">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-lg text-primary">นำเข้าข้อมูลนักเรียนจาก Excel 📝</h3>
                <button class="btn btn-sm btn-circle btn-ghost" @click="closeModal">✕</button>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 mb-4 p-4 border rounded-lg bg-base-200">
                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-medium">เลือกไฟล์ Excel (.xlsx, .xls)</span>
                    </label>
                    <input type="file" accept=".xlsx,.xls" @change="onExcelChange"
                        class="file-input file-input-bordered file-input-sm w-full max-w-xs" />
                    <p v-if="excelFile" class="text-xs text-success mt-1">ไฟล์ที่เลือก: {{ excelFile.name }}</p>
                    <div class="mt-2">
                        <a :href="exampleExcelUrl" download class="link link-primary text-xs">
                            ดาวน์โหลดไฟล์ตัวอย่าง Excel
                        </a>
                    </div>
                </div>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text font-medium">เลือกไฟล์รูปภาพ (หลายไฟล์ได้)</span>
                    </label>
                    <input type="file" accept="image/*" multiple @change="onImagesChange"
                        class="file-input file-input-bordered file-input-sm w-full max-w-xs" />
                    <p v-if="imageFiles.length" class="text-xs text-success mt-1">รูปภาพที่เลือก: {{ imageFiles.length
                    }} ไฟล์</p>
                    <p class="text-xs text-gray-500 mt-1">กรุณาตั้งชื่อไฟล์รูปภาพเป็นรหัสนักเรียน เช่น <b>6200.jpg</b>
                        เพื่อให้ระบบแมปข้อมูลอัตโนมัติ</p>
                </div>
            </div>

            <div class="flex gap-2">
                <button class="btn btn-warning" @click="previewExcel" :disabled="!excelFile || isPreviewing">
                    <span v-if="isPreviewing" class="loading loading-spinner"></span>
                    ดูตัวอย่าง
                </button>
            </div>

            <div v-if="previewData.length" class="mt-6">
                <h3 class="font-bold mb-2 text-secondary">ตัวอย่างข้อมูลนักเรียน ({{ previewData.length }} แถว)</h3>
                <div class="overflow-x-auto max-h-96">
                    <table class="table table-zebra w-full table-sm">
                        <thead>
                            <tr class="bg-base-300">
                                <th>รหัส</th>
                                <th>คำนำหน้า</th>
                                <th>ชื่อ</th>
                                <th>นามสกุล</th>
                                <th>ชั้นปี</th>
                                <th>ห้อง</th>
                                <th>ชื่อรูปภาพ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(student, idx) in previewData.slice(0, 10)" :key="idx">
                                <td>{{ student.userid }}</td>
                                <td>{{ student.pre_name }}</td>
                                <td>{{ student.first_name }}</td>
                                <td>{{ student.last_name }}</td>
                                <td>{{ student.grade }}</td>
                                <td>{{ student.classroom }}</td>
                                <td>{{ student.imageName || '-' }}</td>
                            </tr>
                            <tr v-if="previewData.length > 10">
                                <td colspan="7" class="text-center italic text-sm">... และอีก {{ previewData.length - 10
                                    }} รายการ</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button class="btn btn-success mt-4" @click="handleImport" :disabled="isImporting">
                    <span v-if="isImporting" class="loading loading-spinner"></span>
                    ✅ บันทึกและนำเข้าข้อมูล
                </button>
            </div>

            <div v-if="!excelFile && !previewData.length" class="text-center p-8 text-gray-500">
                กรุณาเลือกไฟล์ Excel เพื่อเริ่มต้นการนำเข้า
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="closeModal">close</button>
        </form>
    </dialog>
</template>

<script setup>
async function resizeImage(file, maxSizeKB = 70, maxWidth = 300, maxHeight = 300) {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const reader = new FileReader();
        reader.onload = (e) => {
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                if (width > maxWidth || height > maxHeight) {
                    const scale = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * scale);
                    height = Math.round(height * scale);
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                let quality = 0.85;
                function tryCompress() {
                    canvas.toBlob((b) => {
                        if (!b) return reject('บีบอัดรูปไม่สำเร็จ');
                        if (b.size / 1024 > maxSizeKB && quality > 0.4) {
                            quality -= 0.05;
                            tryCompress();
                        } else {
                            resolve(b);
                        }
                    }, 'image/jpeg', quality);
                }
                tryCompress();
            };
            img.onerror = () => reject('ไฟล์รูปไม่ถูกต้อง');
            img.src = e.target.result;
        };
        reader.onerror = () => reject('อ่านไฟล์รูปไม่สำเร็จ');
        reader.readAsDataURL(file);
    });
}
import { ref } from 'vue'
import { StudentService } from '../../api/student'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'

function mapHeader(header, row) {
    const keys = Object.keys(row)
    return keys.find(k => k.trim().toLowerCase() === header.trim().toLowerCase())
        ? row[keys.find(k => k.trim().toLowerCase() === header.trim().toLowerCase())]
        : undefined
}

const excelFile = ref(null)
const imageFiles = ref([])
const previewData = ref([])
const isPreviewing = ref(false)
const isImporting = ref(false)
const modalRef = ref(null)

const exampleExcelUrl = '/src/assets/Excel-Student.xlsx'

const emit = defineEmits(['success'])
const studentService = new StudentService()

const openModal = () => {
    modalRef.value?.showModal()
}

const closeModal = () => {
    modalRef.value?.close()
    excelFile.value = null
    imageFiles.value = []
    previewData.value = []
    isPreviewing.value = false
    isImporting.value = false
}

defineExpose({ openModal })

function onExcelChange(e) {
    excelFile.value = e.target.files[0]
    previewData.value = []
    e.target.value = null
}
function onImagesChange(e) {
    imageFiles.value = Array.from(e.target.files)
    e.target.value = null
    // รีเฟรช preview ถ้ามีข้อมูล Excel อยู่แล้ว
    if (excelFile.value) {
        previewExcel()
    }
}

function previewExcel() {
    if (!excelFile.value) {
        Swal.fire('ข้อผิดพลาด', 'กรุณาเลือกไฟล์ Excel ก่อน', 'warning')
        return
    }

    isPreviewing.value = true
    previewData.value = []

    // เตรียม imageFiles map สำหรับ preview
    const getImageName = (userid) => {
        userid = userid?.toString().trim();
        const found = imageFiles.value.find(file => file.name.split('.')[0].toString().trim() === userid);
        return found ? found.name : '';
    }

    const reader = new FileReader()
    reader.onload = (evt) => {
        try {
            const data = new Uint8Array(evt.target.result)
            const workbook = XLSX.read(data, { type: 'array' })
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]
            const json = XLSX.utils.sheet_to_json(sheet)

            if (!json || json.length === 0) {
                Swal.fire('ข้อมูลว่างเปล่า', 'ไม่พบข้อมูลในไฟล์ Excel ที่เลือก', 'warning')
            } else {
                previewData.value = json.map(row => {
                    const userid = (mapHeader('รหัส', row) || mapHeader('userid', row) || '').toString().trim();
                    return {
                        userid,
                        pre_name: mapHeader('คำนำหน้า', row) || mapHeader('pre_name', row) || '',
                        first_name: mapHeader('ชื่อ', row) || mapHeader('first_name', row) || '',
                        last_name: mapHeader('นามสกุล', row) || mapHeader('last_name', row) || '',
                        grade: mapHeader('ชั้นปี', row) || mapHeader('grade', row) || '',
                        classroom: mapHeader('ห้อง', row) || mapHeader('classroom', row) || '',
                        imageName: getImageName(userid)
                    }
                })
            }

        } catch (error) {
            console.error('Error reading Excel:', error)
            Swal.fire('ข้อผิดพลาด', 'ไม่สามารถอ่านไฟล์ Excel ได้ ลองตรวจสอบรูปแบบไฟล์', 'error')
            previewData.value = []
        } finally {
            isPreviewing.value = false
        }
    }
    reader.onerror = () => {
        isPreviewing.value = false
        Swal.fire('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการโหลดไฟล์', 'error')
    }
    reader.readAsArrayBuffer(excelFile.value)
}

async function handleImport() {
    if (!previewData.value.length || !excelFile.value) {
        Swal.fire('แจ้งเตือน', 'กรุณาดูตัวอย่างข้อมูลและตรวจสอบความถูกต้องก่อนบันทึก', 'warning')
        return
    }

    isImporting.value = true
    try {
        const imageMap = {};
        // รีไซส์รูปภาพทุกไฟล์ก่อน import
        for (const file of imageFiles.value) {
            const baseName = file.name.split('.')[0];
            if (file.type.match('image/jpeg') || file.type.match('image/jpg')) {
                try {
                    const resizedBlob = await resizeImage(file, 70, 300, 300);
                    if (resizedBlob.size > 70 * 1024) {
                        // ถ้าเกิน 70KB หลังรีไซส์ ไม่ใช้
                        continue;
                    }
                    imageMap[baseName] = new File([resizedBlob], file.name, { type: 'image/jpeg' });
                } catch (err) {
                    // ถ้ารีไซส์ไม่ได้ ไม่ใช้
                }
            }
        }

        const importedStudents = [];
        for (const student of previewData.value) {
            const formData = {
                userid: student.userid,
                pre_name: student.pre_name,
                first_name: student.first_name,
                last_name: student.last_name,
                grade: student.grade,
                classroom: student.classroom,
                picture: imageMap[student.userid] || null
            };
            try {
                const response = await studentService.createStudent(formData);
                if (response.message === 'Success') {
                    importedStudents.push(response.data);
                }
            } catch (err) {
                console.error(`Error importing student ${student.userid}:`, err);
            }
        }

        Swal.fire('สำเร็จ', `นำเข้าข้อมูลนักเรียนสำเร็จ ${importedStudents.length} รายการ`, 'success');
        emit('success', importedStudents);
        closeModal();
    } catch (e) {
        console.error('Import error:', e);
        const errorMessage = e.response?.data?.message || 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล';
        Swal.fire('เกิดข้อผิดพลาด', errorMessage, 'error');
    } finally {
        isImporting.value = false;
    }
}
</script>