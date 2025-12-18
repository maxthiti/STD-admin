<template>
    <div class="flex justify-end mb-2">
        <button v-if="role === 'teacher'" class="btn btn-sm btn-primary" :disabled="loadingExportDoc"
            @click="exportDocxLeaveReport">
            ส่งออกสรุปการออกงาน
        </button>
    </div>
    <div class="hidden lg:block bg-base-100 rounded-lg shadow-lg overflow-x-auto">
        <table class="table table-zebra w-full">
            <thead>
                <tr class="bg-primary text-primary-content">
                    <th class="text-center">รหัส</th>
                    <th class="text-center">รูป</th>
                    <th>ชื่อ-สกุล</th>
                    <th class="text-center">ตำแหน่ง</th>
                    <th class="text-center">ชั้นเรียน/แผนก</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="data.length === 0">
                    <td colspan="5" class="text-center py-8 text-base-content/60">
                        ไม่พบข้อมูล
                    </td>
                </tr>
                <tr v-for="item in data" :key="item._id" class="hover">
                    <td class="text-center">{{ item.userid }}</td>
                    <td class="text-center">
                        <img v-if="item.picture" :src="`${imgProBaseUrl}${item.picture}`" alt="profile"
                            class="w-10 h-10 rounded-full object-cover inline-block cursor-pointer"
                            @click="viewImage(item.picture)" @error="item.picture = null" />
                        <div v-else
                            class="w-10 h-10 rounded-full bg-base-200 inline-block flex items-center justify-center">
                            <span class="text-base font-bold">{{ getInitials(item.name) }}</span>
                        </div>
                    </td>
                    <td>{{ item.name }}</td>
                    <td class="text-center">{{ item.position }}</td>
                    <td class="text-center">
                        <span v-if="item.position === 'นักเรียน'">{{ item.grade }}/{{ item.classroom }}</span>
                        <span v-else>-</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="lg:hidden space-y-4">
        <div v-if="data.length === 0" class="text-center py-8 text-base-content/60 bg-base-100 rounded-lg shadow-lg">
            ไม่พบข้อมูล
        </div>
        <div v-for="item in data" :key="item._id" class="bg-base-100 rounded-lg shadow-lg p-4 space-y-3">
            <div class="flex items-start gap-3">
                <img v-if="item.picture" :src="`${imgProBaseUrl}${item.picture}`" alt="profile"
                    class="w-10 h-10 rounded-full object-cover cursor-pointer" @click="viewImage(item.picture)" />
                <div class="flex-1">
                    <div class="badge badge-primary badge-sm mb-2">{{ item.userid }}</div>
                    <h3 class="font-bold text-md">{{ item.name }}</h3>
                    <p class="text-sm text-base-content/70">{{ item.position }}</p>
                </div>
            </div>

            <div class="divider my-2"></div>

            <div class="text-sm">
                <span class="text-base-content/60">ชั้นเรียน:</span>
                <p class="font-medium inline ml-2" v-if="item.position === 'นักเรียน'">{{ item.grade }}/{{
                    item.classroom }}</p>
                <p class="font-medium inline ml-2" v-else>-</p>
            </div>
        </div>
    </div>

    <div v-if="pagination.total_pages > 1" class="flex justify-center mt-6">
        <div class="join shadow-lg">
            <button @click="$emit('page-change', 1)" class="join-item btn btn-sm" :disabled="pagination.page === 1">
                «
            </button>

            <button v-for="page in visiblePages" :key="page" @click="$emit('page-change', page)"
                :class="['join-item btn btn-sm', page === pagination.page ? 'btn-active' : '']">
                {{ page }}
            </button>

            <button @click="$emit('page-change', pagination.total_pages)" class="join-item btn btn-sm"
                :disabled="pagination.page === pagination.total_pages">
                »
            </button>
        </div>
    </div>

    <div v-if="pagination.total_items > 0" class="text-center text-sm text-base-content/60 mt-4 text-white">
        แสดง {{ ((pagination.page - 1) * pagination.limit) + 1 }} - {{
            Math.min(pagination.page * pagination.limit, pagination.total_items)
        }} จาก {{ pagination.total_items }} รายการ
    </div>

    <dialog ref="imageModal" class="modal">
        <div class="modal-box max-w-7xl w-full p-0">
            <form method="dialog">
                <button
                    class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10 bg-white/80 hover:bg-white">✕</button>
            </form>
            <img v-if="selectedImage" :src="`${imgProBaseUrl}${selectedImage}`" alt="profile image"
                class="w-full h-auto max-h-[90vh] object-contain" />
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, WidthType, BorderStyle, ImageRun } from 'docx'
import { saveAs } from 'file-saver'
import reportApi from '../../api/report.js'
const loadingExportDoc = ref(false)

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
    pagination: {
        type: Object,
        required: true
    },
    dateRange: {
        type: Object,
        required: true
    },
    role: {
        type: String,
        required: false,
        default: 'student'
    }
})

const emit = defineEmits(['page-change'])

const imgProBaseUrl = import.meta.env.VITE_IMG_PROFILE_URL

const imageModal = ref(null)
const selectedImage = ref(null)

const MAX_VISIBLE_PAGES = 3

const visiblePages = computed(() => {
    const current = props.pagination.page
    const total = props.pagination.total_pages
    const maxPagesToShow = MAX_VISIBLE_PAGES

    if (total <= 1) {
        return []
    }

    if (total <= maxPagesToShow) {
        const pages = []
        for (let i = 1; i <= total; i++) {
            pages.push(i)
        }
        return pages
    }

    let startPage = current - Math.floor(maxPagesToShow / 2)
    let endPage = current + Math.floor(maxPagesToShow / 2)

    if (startPage < 1) {
        startPage = 1
        endPage = Math.min(total, maxPagesToShow)
    }

    if (endPage > total) {
        endPage = total
        startPage = Math.max(1, total - maxPagesToShow + 1)
    }

    const pages = []
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    return pages
})

const viewImage = (image) => {
    selectedImage.value = image
    imageModal.value?.showModal()
}

const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 3) {
        return (parts[1][0] || '') + (parts[2][0] || '')
    }
    if (parts.length === 2) {
        return (parts[0][0] || '') + (parts[1][0] || '')
    }
    return parts[0][0] || '?'
}

async function exportDocxLeaveReport() {
    if (loadingExportDoc.value) return
    loadingExportDoc.value = true
    try {
        let pictureBuffer = null;
        try {
            const res = await fetch('/brand.jpg');
            if (res.ok) pictureBuffer = await res.arrayBuffer();
        } catch (e) { pictureBuffer = null; }

        const [stats, missed] = await Promise.all([
            reportApi.getDailyStats(props.dateRange.start, props.dateRange.end),
            reportApi.getMissedReport({ date: props.dateRange.end, role: 'teacher' }),
        ]);
        const totalTeachers = stats?.data?.total_teachers || 0;
        const notCheckOut = missed?.data?.length || 0;

        const font = { name: 'TH SarabunPSK' };
        const leaveTable = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({
                                children: [new TextRun({ text: `ข้าราชการครู ครูอัตราจ้าง จำนวน ${totalTeachers} คน`, font, size: 32 })],
                            })],
                            columnSpan: 3,
                            borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } }
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({
                                children: [new TextRun({ text: `ไม่ลงเวลากลับ ${notCheckOut} คน`, font, size: 32 })],
                            })],
                            columnSpan: 3,
                            borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } }
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: 'ไม่ลงเวลากลับ', font, size: 32 })], alignment: AlignmentType.CENTER })],
                            verticalAlign: 'center',
                            borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } }
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: `ข้าราชการครู ${notCheckOut} คน`, font, size: 32 })], alignment: AlignmentType.CENTER })],
                            verticalAlign: 'center',
                            borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } }
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: '', font, size: 32 })] })],
                            borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } }
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: 'ขออนุญาตออกนอกบริเวณ', font, size: 32 })], alignment: AlignmentType.CENTER })],
                            rowSpan: 2,
                            verticalAlign: 'center',
                            borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } }
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: `ไม่กลับมาลงเวลา ${notCheckOut} คน`, font, size: 32 })], alignment: AlignmentType.CENTER })],
                            verticalAlign: 'center',
                            borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } }
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: '', font, size: 32 })], alignment: AlignmentType.CENTER })],
                            verticalAlign: 'center',
                            borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } }
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: `กลับมาลงเวลา ${totalTeachers - notCheckOut} คน`, font, size: 32 })], alignment: AlignmentType.CENTER })],
                            rowSpan: 2,
                            verticalAlign: 'center',
                            borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } }
                        }),
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: '', font, size: 32 })], alignment: AlignmentType.CENTER })],
                            verticalAlign: 'center',
                            borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } }
                        }),
                    ]
                })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            layout: 'fixed',
            margins: { top: 113, bottom: 113, left: 113, right: 113 },
            columnWidths: [1650, 1800, 6000],
        });

        const doc = new Document({
            styles: {
                default: {
                    document: {
                        run: font
                    }
                }
            },
            sections: [{
                properties: {},
                children: [
                    new Table({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [
                                            new Paragraph({
                                                children: pictureBuffer ? [
                                                    new ImageRun({ data: pictureBuffer, transformation: { width: 100, height: 100 } })
                                                ] : [new TextRun({ text: '', font })]
                                            })
                                        ],
                                        width: { size: 15, type: WidthType.PERCENTAGE },
                                        height: { value: 500, rule: 'atLeast' },
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: 'บันทึกข้อความ', font, bold: true, size: 48 })], alignment: AlignmentType.CENTER })],
                                        columnSpan: 3,
                                        width: { size: 85, type: WidthType.PERCENTAGE },
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: 'ส่วนราชการ', font, bold: true, size: 32 })] })],
                                        width: { size: 15, type: WidthType.PERCENTAGE },
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: 'กลุ่มบริหารงานบุคคล โรงเรียนจักษุศิลปะคณะการ จังหวัดลำพูน', font, size: 32 })] })],
                                        columnSpan: 3,
                                        width: { size: 85, type: WidthType.PERCENTAGE },
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: 'ที่', font, bold: true, size: 32 })] })],
                                        width: { size: 15, type: WidthType.PERCENTAGE },
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: '.....................................', font, size: 32 })] })],
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: 'วันที่', font, bold: true, size: 32 })] })],
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: '.....................................', font, size: 32 })] })],
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                                    }),
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: 'เรื่อง', font, bold: true, size: 32 })] })],
                                        width: { size: 15, type: WidthType.PERCENTAGE },
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: 'สรุปรายงานการลงเวลากลับของลูกจ้างประจำและบุคลากรทางการศึกษา', font, size: 32 })] })],
                                        columnSpan: 3,
                                        width: { size: 85, type: WidthType.PERCENTAGE },
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: 'เรียน', font, bold: true, size: 32 })] })],
                                        width: { size: 15, type: WidthType.PERCENTAGE },
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph({ children: [new TextRun({ text: 'ผู้อำนวยการโรงเรียนจักษุศิลปะคณะการ จังหวัดลำพูน', font, size: 32 })] })],
                                        columnSpan: 3,
                                        width: { size: 85, type: WidthType.PERCENTAGE },
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph({
                                            children: [new TextRun({ text: `  ด้วยงานปฏิบัติราชการของบุคลากรทางการศึกษา ได้จัดทำสรุปรายงานการลงเวลากลับของข้าราชการครู ประจำวันที่ ${props.dateRange ? formatDateRangeTH(props.dateRange.start, props.dateRange.end) : ''} ดังนี้`, font, size: 32 })],
                                        })],
                                        columnSpan: 4,
                                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                                    }),
                                ]
                            })
                        ],
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        margins: { top: 113, bottom: 113, left: 113, right: 113 },
                        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } }
                    }),
                    new Paragraph({ text: '', spacing: { after: 200 } }),
                    leaveTable,
                    new Paragraph({ text: '', spacing: { after: 200 } }),
                    new Paragraph({ children: [new TextRun({ text: '   จึงเรียนมาเพื่อโปรดทราบ', font, size: 32 })] }),
                    new Paragraph({ text: '', spacing: { after: 200 } }),
                    new Paragraph({ children: [new TextRun({ text: '(.............................................)', font, size: 32 })], alignment: AlignmentType.RIGHT }),
                    new Paragraph({ children: [new TextRun({ text: 'ผู้บันทึกข้อมูล', font, size: 32 })], alignment: AlignmentType.RIGHT }),
                    new Paragraph({ text: '', spacing: { after: 200 } }),
                    new Paragraph({ children: [new TextRun({ text: '(.............................................)', font, size: 32 })], alignment: AlignmentType.RIGHT }),
                    new Paragraph({ children: [new TextRun({ text: 'ผู้อำนวยการโรงเรียนจักรคำคณาทร จังหวัดลำพูน', font, size: 32 })], alignment: AlignmentType.RIGHT }),
                ]
            }]
        });
        const blob = await Packer.toBlob(doc)
        saveAs(blob, `รายงานการออกงาน_${new Date().toISOString().slice(0, 10)}.docx`)
    } catch (e) {
        alert('เกิดข้อผิดพลาดในการส่งออก Word')
        console.error(e)
    } finally {
        loadingExportDoc.value = false
    }
}
function formatDateTHFull(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear() + 543;
    return `${day} ${month} พ.ศ.${year}`;
}

function formatDateRangeTH(start, end) {
    if (!start || !end) return '-';
    if (start === end) {
        return formatDateTHFull(start);
    } else {
        return `${formatDateTHFull(start)} ถึง ${formatDateTHFull(end)}`;
    }
}

</script>

<style scoped></style>