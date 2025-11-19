<template>
    <div v-if="isMobileMenuOpen" @click="closeMobileMenu"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"></div>

    <aside @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" :class="[
        'min-h-screen bg-base-100 shadow-lg transition-all duration-300 ease-in-out relative',
        isExpanded ? 'w-64' : 'w-20',
        'max-[570px]:fixed max-[570px]:top-0 max-[570px]:left-0 max-[570px]:h-full max-[570px]:z-50',
        isMobileMenuOpen ? 'max-[570px]:translate-x-0' : 'max-[570px]:-translate-x-full'
    ]">

        <button @click="toggleSidebar"
            class="absolute -right-3 top-6 bg-secondary text-secondary-content rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform z-10 max-[570px]:hidden">
            <svg xmlns="http://www.w3.org/2000/svg"
                :class="['h-4 w-4 transition-transform', isExpanded ? '' : 'rotate-180']" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <div class="p-4 border-b overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    <span class="text-secondary-content font-bold text-lg">C</span>
                </div>
                <div v-show="isExpanded" class="transition-opacity duration-300">
                    <h2 class="text-xl font-bold text-primary whitespace-nowrap">CKK School</h2>
                    <p class="text-sm text-secondary font-medium whitespace-nowrap">ระบบจัดการ</p>
                </div>
            </div>
        </div>

        <nav class="menu p-4">
            <ul class="space-y-2">
                <li>
                    <router-link to="/home/dashboard"
                        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-200 transition-colors relative group"
                        :class="{ 'bg-primary text-primary-content': isActive('/home/dashboard') }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span v-show="isExpanded" class="font-medium whitespace-nowrap">หน้าหลัก</span>

                        <div v-show="!isExpanded"
                            class="absolute left-full ml-2 px-3 py-2 bg-base-300 text-base-content rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            หน้าหลัก
                        </div>
                    </router-link>
                </li>

                <li>
                    <div @click="togglePersonnel"
                        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-200 transition-colors cursor-pointer relative group"
                        :class="{ 'bg-primary text-primary-content': isPersonnelActive }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span v-show="isExpanded" class="font-medium whitespace-nowrap">จัดการบุคลากร</span>
                        <svg v-show="isExpanded" xmlns="http://www.w3.org/2000/svg"
                            :class="['h-4 w-4 ml-auto transition-transform', isPersonnelOpen ? 'rotate-180' : '']"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>

                        <div v-show="!isExpanded"
                            class="absolute left-full ml-2 px-3 py-2 bg-base-300 text-base-content rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            จัดการบุคลากร
                        </div>
                    </div>

                    <ul v-show="isExpanded && isPersonnelOpen" class="ml-4 mt-2 space-y-2">
                        <li>
                            <router-link to="/home/teacher"
                                class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-base-200 transition-colors"
                                :class="{ 'bg-primary/20 text-primary': isActive('/home/teacher') }">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span class="text-sm">จัดการอาจารย์</span>
                            </router-link>
                        </li>

                        <li>
                            <router-link to="/home/student"
                                class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-base-200 transition-colors"
                                :class="{ 'bg-primary/20 text-primary': isActive('/home/student') }">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span class="text-sm">จัดการนักเรียน</span>
                            </router-link>
                        </li>
                    </ul>
                </li>

                <li>
                    <div @click="toggleStructure"
                        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-200 transition-colors cursor-pointer relative group"
                        :class="{ 'bg-primary text-primary-content': isStructureActive }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span v-show="isExpanded" class="font-medium whitespace-nowrap">จัดการโครงสร้าง</span>
                        <svg v-show="isExpanded" xmlns="http://www.w3.org/2000/svg"
                            :class="['h-4 w-4 ml-auto transition-transform', isStructureOpen ? 'rotate-180' : '']"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>

                        <div v-show="!isExpanded"
                            class="absolute left-full ml-2 px-3 py-2 bg-base-300 text-base-content rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            จัดการโครงสร้าง
                        </div>
                    </div>

                    <ul v-show="isExpanded && isStructureOpen" class="ml-4 mt-2 space-y-2">
                        <li>
                            <router-link to="/home/department"
                                class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-base-200 transition-colors"
                                :class="{ 'bg-primary/20 text-primary': isActive('/home/department') }">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                <span class="text-sm">จัดการแผนก</span>
                            </router-link>
                        </li>

                        <li>
                            <router-link to="/home/position"
                                class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-base-200 transition-colors"
                                :class="{ 'bg-primary/20 text-primary': isActive('/home/position') }">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span class="text-sm">จัดการตำแหน่ง</span>
                            </router-link>
                        </li>

                        <li>
                            <router-link to="/home/classroom"
                                class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-base-200 transition-colors"
                                :class="{ 'bg-primary/20 text-primary': isActive('/home/classroom') }">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span class="text-sm">จัดการห้องเรียน</span>
                            </router-link>
                        </li>
                    </ul>
                </li>

                <li>
                    <router-link to="/home/account"
                        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-200 transition-colors relative group"
                        :class="{ 'bg-primary text-primary-content': isActive('/home/account') }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span v-show="isExpanded" class="font-medium whitespace-nowrap">จัดการผู้ดูแล</span>

                        <div v-show="!isExpanded"
                            class="absolute left-full ml-2 px-3 py-2 bg-base-300 text-base-content rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            จัดการผู้ดูแล
                        </div>
                    </router-link>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'

const route = useRoute()
const isExpanded = ref(true)
const isPinned = ref(true)
const isPersonnelOpen = ref(false)
const isStructureOpen = ref(false)
const isMobileMenuOpen = ref(false)

const isActive = (path) => {
    return computed(() => route.path === path).value
}

const isPersonnelActive = computed(() => {
    return route.path === '/home/teacher' || route.path === '/home/student'
})

const isStructureActive = computed(() => {
    return route.path === '/home/department' || route.path === '/home/position' || route.path === '/home/classroom'
})

const toggleSidebar = () => {
    isPinned.value = !isPinned.value
    isExpanded.value = isPinned.value
}

const togglePersonnel = () => {
    isPersonnelOpen.value = !isPersonnelOpen.value
}

const toggleStructure = () => {
    isStructureOpen.value = !isStructureOpen.value
}

const openMobileMenu = () => {
    isMobileMenuOpen.value = true
}

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
}

const handleMouseEnter = () => {
    isExpanded.value = true
}

const handleMouseLeave = () => {
    if (!isPinned.value) {
        isExpanded.value = false
    }
}

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

defineExpose({
    openMobileMenu,
    toggleMobileMenu
})
</script>

<style scoped></style>
