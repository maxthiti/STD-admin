<template>
    <div class="flex min-h-screen bg-base-200">
        <Sidebar ref="sidebarRef" />
        <div class="flex-1 flex flex-col">
            <Navbar @toggleMobileMenu="handleToggleMobileMenu" />
            <main class="flex-1 p-6">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'

const sidebarRef = ref(null)

const handleToggleMobileMenu = () => {
    if (sidebarRef.value) {
        sidebarRef.value.toggleMobileMenu()
    }
}
</script>

<style scoped></style>
