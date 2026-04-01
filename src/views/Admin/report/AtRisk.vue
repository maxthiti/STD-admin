<template>
    <div class="p-0 md:p-6 space-y-6 max-[570px]:pt-14">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center text-white gap-2">
            <h1 class="text-lg md:text-3xl font-bold">ตารางนักเรียนกลุ่มเสี่ยง</h1>
        </div>

        <AtRiskStudent />
    </div>
</template>

<script setup>
import AtRiskStudent from "../../../components/Report/AtRiskStudent.vue";
</script>
