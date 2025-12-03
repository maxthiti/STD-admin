<template>
    <main class="min-h-screen grid place-items-center bg-base-200 p-2 sm:p-4">
        <section class="w-full max-w-md sm:max-w-md mx-auto">
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body p-4 sm:p-6">
                    <h2 class="card-title justify-center text-2xl">เข้าสู่ระบบ</h2>

                    <form @submit.prevent="onSubmit" class="space-y-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">อีเมลหรือชื่อผู้ใช้</span>
                            </label>
                            <input v-model.trim="form.username" type="text" class="input input-bordered"
                                placeholder="you@example.com" autocomplete="username" />
                            <p v-if="errors.username" class="mt-1 text-error text-sm">{{ errors.username }}</p>
                        </div>

                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">รหัสผ่าน</span>
                            </label>
                            <label class="input input-bordered flex items-center gap-2">
                                <input :type="showPassword ? 'text' : 'password'" v-model.trim="form.password"
                                    class="grow" placeholder="••••••••" autocomplete="current-password" />
                                <button type="button" class="btn btn-ghost btn-sm"
                                    @click="showPassword = !showPassword">
                                    <span v-if="showPassword">ซ่อน</span>
                                    <span v-else>แสดง</span>
                                </button>
                            </label>
                            <p v-if="errors.password" class="mt-1 text-error text-sm">{{ errors.password }}</p>
                        </div>

                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <label class="label cursor-pointer gap-2">
                                <input type="checkbox" v-model="remember" class="checkbox checkbox-sm" />
                                <span class="label-text">จดจำฉัน</span>
                            </label>
                        </div>


                        <div class="flex flex-wrap gap-2 items-center w-full">
                            <button type="submit"
                                class="btn btn-primary flex-1 min-w-[140px] sm:min-w-[180px] text-base sm:text-lg py-3"
                                :disabled="loading">
                                <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                                <span v-else>เข้าสู่ระบบ</span>
                            </button>
                            <button v-if="deferredPrompt" type="button"
                                class="btn btn-circle btn-accent min-w-[44px] w-11 h-11 sm:min-w-[48px] sm:w-12 sm:h-12"
                                @click="installPWA" :title="'ติดตั้งแอป'">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6 mx-auto">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4v12m0 0l-4-4m4 4l4-4m-8 8h8" />
                                </svg>
                            </button>
                        </div>

                        <p v-if="formError" class="text-error text-sm text-center">{{ formError }}</p>
                        <p v-if="success" class="text-success text-sm text-center">เข้าสู่ระบบสำเร็จ กำลังนำทาง...</p>
                    </form>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { UserService } from '../api/user'

const router = useRouter()
const auth = useAuthStore()
const userService = new UserService()


const form = reactive({ username: '', password: '' })
const errors = reactive({ username: '', password: '' })
const remember = ref(true)
const loading = ref(false)
const formError = ref('')
const success = ref(false)
const showPassword = ref(false)

const deferredPrompt = ref(null)

function installPWA() {
    if (deferredPrompt.value) {
        deferredPrompt.value.prompt()
        deferredPrompt.value.userChoice.then((choiceResult) => {
            deferredPrompt.value = null
        })
    }
}

function handleBeforeInstallPrompt(e) {
    e.preventDefault()
    deferredPrompt.value = e
}

onMounted(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})

onBeforeUnmount(() => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})

function validate() {
    errors.username = form.username ? '' : 'กรุณากรอกอีเมลหรือชื่อผู้ใช้'
    errors.password = form.password ? '' : 'กรุณากรอกรหัสผ่าน'
    return !errors.username && !errors.password
}

async function onSubmit() {
    formError.value = ''
    success.value = false
    if (!validate()) return
    loading.value = true
    try {
        const response = await userService.SignIn({
            username: form.username,
            password: form.password,
        })

        if (response && response.message === 'Success') {
            const token = response.data?.access_token
            const refreshToken = response.data?.data?.refresh_token

            if (!token) throw new Error('ไม่พบโทเค็น')

            let role = '';
            let profileName = '';
            let profilePicture = '';
            let classroom = '';
            let grade = '';
            try {
                const payloadBase64 = token.split('.')[1]
                    .replace(/-/g, '+')
                    .replace(/_/g, '/');
                const paddedPayload = payloadBase64 + '==='.slice(0, (4 - payloadBase64.length % 4) % 4);

                function base64UrlDecodeUnicode(str) {
                    const binary = atob(str);
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i++) {
                        bytes[i] = binary.charCodeAt(i);
                    }
                    return new TextDecoder().decode(bytes);
                }
                const payloadJson = base64UrlDecodeUnicode(paddedPayload);
                const payload = JSON.parse(payloadJson);

                role = payload.role;
                profileName = payload.name || '';
                profilePicture = payload.picture || '';
                classroom = payload.classroom || '';
                grade = payload.grade || '';

                if (role) {
                    localStorage.setItem('residentRole', role);
                }
                if (profileName) {
                    localStorage.setItem('profileName', profileName);
                }
                if (profilePicture) {
                    localStorage.setItem('profilePicture', profilePicture);
                }
                localStorage.setItem('classroom', classroom);
                localStorage.setItem('grade', grade);
            } catch (e) {
                role = '';
                profileName = '';
                profilePicture = '';
                classroom = '';
                grade = '';
                console.error("Failed to decode token:", e);
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            if (remember.value && refreshToken) {
                localStorage.setItem('refresh_token', refreshToken);
            } else {
                localStorage.removeItem('refresh_token');
            }
            await auth.initializeAuth()
            success.value = true
            setTimeout(() => router.push('/home'), 600)
        } else {
            throw new Error('เข้าสู่ระบบไม่สำเร็จ')
        }
    } catch (e) {
        console.error('Login error:', e)

        let errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'

        if (e.response?.data) {
            const errorData = e.response.data

            if (errorData.message === 'Authentication failed') {
                if (errorData.error === 'Wrong password') {
                    errorMessage = 'รหัสผ่านไม่ถูกต้อง'
                } else if (errorData.error === 'User not found') {
                    errorMessage = 'ไม่พบผู้ใช้งานนี้'
                } else {
                    errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
                }
            } else if (errorData.message === 'Data not found') {
                errorMessage = 'ไม่มีข้อมูลบัญชีนี้'
            } else if (errorData.message) {
                errorMessage = errorData.message
            }
        }

        formError.value = errorMessage
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
@media (max-width: 640px) {
    .card-body {
        padding: 1rem !important;
    }

    .card-title {
        font-size: 1.25rem !important;
    }

    .input,
    .input-bordered {
        font-size: 1rem !important;
        padding: 0.75rem !important;
    }

    .btn-primary {
        font-size: 1rem !important;
        padding-top: 0.75rem !important;
        padding-bottom: 0.75rem !important;
    }
}
</style>
