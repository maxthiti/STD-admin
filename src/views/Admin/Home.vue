<template>
    <div class="space-y-6">
        <DashBoardData :centerDate="startDate" />
        <DashBoardGraph :centerDate="startDate" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DashBoardData from '../../components/DashBoard/DashBoard-data.vue'
import DashBoardGraph from '../../components/DashBoard/DashBoard-graph.vue'

const startDate = ref(new Date())
</script>

<style scoped></style>
