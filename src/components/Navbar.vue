<template>
    <header class="navbar bg-base-100 shadow-md px-6">
        <button @click="toggleMobileMenu" class="btn btn-ghost btn-circle mr-2 max-[570px]:flex hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>

        <div class="flex-1">
            <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
        </div>

        <div class="flex-none gap-4">
            <!-- <button class="btn btn-ghost btn-circle">
                <div class="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span class="badge badge-xs badge-secondary indicator-item"></span>
                </div>
            </button> -->

            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                    <div
                        class="w-10 rounded-full bg-secondary text-secondary-content flex items-center justify-center shadow-md overflow-hidden">
                        <img v-if="profilePicture" :src="profilePictureUrl" alt="profile"
                            class="w-full h-full object-cover" />
                        <span v-else class="text-lg font-semibold">{{ profileInitial }}</span>
                    </div>
                </div>
                <ul tabindex="0"
                    class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-72">
                    <li>
                        <a class="justify-between">
                            {{ profileName || 'โปรไฟล์' }}
                            <span class="badge">{{ residentRole }}</span>
                        </a>
                    </li>
                    <li><a @click="goToUpdatePassword">ตั้งค่ารหัสผ่าน</a></li>
                    <li><a @click="handleLogout">ออกจากระบบ</a></li>
                </ul>
            </div>
        </div>
    </header>
</template>

<script setup>
const goToUpdatePassword = () => {
    router.push('/update-password')
}
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const emit = defineEmits(['toggleMobileMenu'])

const pageTitle = computed(() => {
    const titles = {
        'Dashboard': 'แดชบอร์ด',
        'Teacher': 'จัดการบุคลากร',
        'Student': 'จัดการนักเรียน',
        'Account': 'จัดการผู้ดูแล'
    }
    return titles[route.name] || 'ระบบจัดการ'
})

const toggleMobileMenu = () => {
    emit('toggleMobileMenu')
}

const handleLogout = async () => {
    const result = await Swal.fire({
        title: 'ยืนยันการออกจากระบบ',
        text: 'คุณต้องการออกจากระบบใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ออกจากระบบ',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
    })
    if (result.isConfirmed) {
        authStore.logout()
        localStorage.removeItem('profileName')
        localStorage.removeItem('profilePicture')
        localStorage.removeItem('residentRole')
        localStorage.removeItem('classroom')
        localStorage.removeItem('grade')
        router.push('/')
    }
}

const profileName = ref(localStorage.getItem('profileName') || '')
const profilePicture = ref(localStorage.getItem('profilePicture') || '')
const residentRole = ref(localStorage.getItem('residentRole') || '')

const profilePictureUrl = computed(() => {
    if (!profilePicture.value) return ''
    const baseUrl = import.meta.env.VITE_IMG_PROFILE_URL || ''
    return profilePicture.value.startsWith('http')
        ? profilePicture.value
        : baseUrl + profilePicture.value
})

const profileInitial = computed(() => {
    if (!profileName.value) return 'A'
    return profileName.value.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
})
</script>

<style scoped></style>
