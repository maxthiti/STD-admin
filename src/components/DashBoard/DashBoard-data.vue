<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="stats shadow bg-base-100" @mouseenter="playAnimation" @mouseleave="stopAnimation">
            <div class="stat">
                <div class="stat-figure">
                    <Vue3Lottie ref="lottieRef" :animationData="avatarAnimation" :height="80" :width="80" :loop="false"
                        :autoPlay="false" />
                </div>
                <div class="stat-title">ทั้งหมด</div>
                <div class="stat-value text-purple-500">{{ stats.total }}</div>
                <div class="stat-desc">จำนวนทั้งหมดในระบบ</div>
            </div>
        </div>

        <div class="stats shadow bg-base-100">
            <div class="stat">
                <div class="stat-figure text-success">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="inline-block w-8 h-8 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                </div>
                <div class="stat-title">เข้า</div>
                <div class="stat-value text-success">{{ stats.checkIn }}</div>
                <div class="stat-desc">↗︎ เข้าวันนี้</div>
            </div>
        </div>

        <div class="stats shadow bg-base-100">
            <div class="stat">
                <div class="stat-figure text-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="inline-block w-8 h-8 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </div>
                <div class="stat-title">ออก</div>
                <div class="stat-value text-warning">{{ stats.checkOut }}</div>
                <div class="stat-desc">↘︎ ออกวันนี้</div>
            </div>
        </div>

        <div class="stats shadow bg-base-100">
            <div class="stat">
                <div class="stat-figure text-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="inline-block w-8 h-8 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                </div>
                <div class="stat-title">คงเหลือ</div>
                <div class="stat-value text-info">{{ stats.remaining }}</div>
                <div class="stat-desc">อยู่ในพื้นที่</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
import avatarAnimation from '../../assets/wired-gradient-21-avatar-morph-group.json'

const props = defineProps({
    centerDate: {
        type: Date,
        default: () => new Date()
    }
})

const lottieRef = ref(null)

const stats = ref({
    total: 0,
    checkIn: 0,
    checkOut: 0,
    remaining: 0
})

const playAnimation = () => {
    if (lottieRef.value) {
        lottieRef.value.play()
    }
}

const stopAnimation = () => {
    if (lottieRef.value) {
        lottieRef.value.stop()
    }
}

onMounted(() => {
    stats.value = {
        total: 1250,
        checkIn: 342,
        checkOut: 287,
        remaining: 55
    }
})
</script>

<style scoped></style>
