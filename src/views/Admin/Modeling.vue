<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-lg md:text-3xl font-bold text-white">จัดการโมเดล</h1>
            <CreateModeling v-if="auth.user?.role !== 'teacher'" @created="fetchData"
                @selectModeChanged="selectMode = $event" :selected-ids="selectedIds" />
        </div>

        <div class="bg-base-100 rounded-lg shadow-lg p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div v-if="auth.user?.role !== 'teacher'" class="form-control">
                    <label class="label py-1">
                        <span class="label-text text-sm font-medium">ประเภท</span>
                    </label>
                    <select v-model="filters.role" @change="fetchData" class="select select-bordered select-sm w-full">
                        <option value="student">นักเรียน</option>
                        <option value="teacher">อาจารย์</option>
                    </select>
                </div>

                <div class="form-control">
                    <label class="label py-1">
                        <span class="label-text text-sm font-medium">ชื่อ</span>
                    </label>
                    <input v-model="filters.name" type="text" placeholder="ค้นหาชื่อ..."
                        class="input input-bordered input-sm w-full" @keyup.enter="searchByNameOrUserid" />
                </div>

                <div class="form-control">
                    <label class="label py-1">
                        <span class="label-text text-sm font-medium">รหัส</span>
                    </label>
                    <input v-model="filters.userid" type="text" placeholder="ค้นหารหัส..."
                        class="input input-bordered input-sm w-full" @keyup.enter="searchByNameOrUserid" />
                </div>

                <div class="form-control">
                    <label class="label py-1">
                        <span class="label-text text-sm font-medium">สถานะ</span>
                    </label>
                    <select v-model="filters.status" @change="fetchData"
                        class="select select-bordered select-sm w-full">
                        <option value="all">ทั้งหมด</option>
                        <option value="fail">ไม่สำเร็จ</option>
                    </select>
                </div>
            </div>

            <div class="flex justify-end gap-2 mt-3">
                <button @click="resetFilters" class="btn btn-ghost btn-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    รีเซ็ต
                </button>
                <button @click="searchByNameOrUserid" class="btn btn-primary btn-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    ค้นหา
                </button>
            </div>
        </div>

        <div v-if="loading" class="flex justify-center py-12">
            <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>

        <div v-else>
            <ModelingTable :data="modelings" :page="currentPage" :limit="filters.limit" :selectMode="selectMode"
                :selected-ids="selectedIds" @updated="fetchData" @selectedIds="handleSelectedIds" />

            <div v-if="totalPages > 1" class="flex justify-center mt-6">
                <div class="join">
                    <button class="join-item btn btn-sm bg-transparent border-none" @click="changePage(currentPage - 1)"
                        :disabled="currentPage === 1">
                        «
                    </button>
                    <button v-for="page in visiblePages" :key="page"
                        class="join-item btn btn-sm bg-transparent border-none"
                        :class="page === currentPage ? 'bg-base-content/20 font-bold' : ''" @click="changePage(page)">
                        {{ page }}
                    </button>
                    <button class="join-item btn btn-sm bg-transparent border-none" @click="changePage(currentPage + 1)"
                        :disabled="currentPage === totalPages">
                        »
                    </button>
                </div>
            </div>
            <div class="flex flex-col items-center gap-4 mt-6">
                <div class="text-sm text-base-content/60 text-white">
                    ทั้งหมด {{ totalItems }} รายการ (หน้า {{ currentPage }} / {{ totalPages }})
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ModelingTable from "../../components/Modeling/Table.vue";
import CreateModeling from "../../components/Modeling/Create.vue";
import ModelingService from "../../api/modeling.js";
import Swal from "sweetalert2";
import { useAuthStore } from "../../stores/auth";

const auth = useAuthStore();

const loading = ref(false);
const modelings = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const selectMode = ref(false);
const selectedIds = ref([]);

const filters = ref({
    role: "student",
    name: "",
    department: "",
    userid: "",
    status: "all",
    limit: 10,
});

const visiblePages = computed(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages.value, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return pages;
});

const fetchData = async () => {
    loading.value = true;
    try {
        const response = await ModelingService.getModelings({
            ...filters.value,
            page: currentPage.value,
        });

        if (response.message === "Success") {
            modelings.value = response.data;
            totalItems.value = response.total_items || response.data.length;
            totalPages.value = response.total_pages || 1;
        }
    } catch (error) {
        console.error("Error fetching modelings:", error);
        Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถโหลดข้อมูลได้",
        });
    } finally {
        loading.value = false;
    }
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchData();
    }
};

const resetFilters = () => {
    filters.value = {
        role: "student",
        name: "",
        department: "",
        userid: "",
        status: "all",
        limit: 10,
    };
    currentPage.value = 1;
    fetchData();
};

function handleSelectedIds(ids) {
    selectedIds.value = ids;
}

function searchByNameOrUserid() {
    currentPage.value = 1;
    fetchData();
}

onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.join {
    border-radius: 1.5rem;
    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
    background: #f8fafc;
}

.btn.bg-transparent {
    background: transparent;
}

.bg-base-content\/20 {
    background-color: #e5e7eb !important;
}
</style>
