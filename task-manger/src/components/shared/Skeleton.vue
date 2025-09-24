<template>
        <div class="bg-gray-200 rounded-md w-full h-full animatePulse"></div>
</template>

<style scoped>
@keyframes pulse {
    0% {
        background-color: #e0e0e0;
    }
    50% {
        background-color: #f0f0f0;
    }
    100% {
        background-color: #e0e0e0;
    }
}

.animatePulse {
    animation: pulse 1.5s infinite ease-in-out;
}
</style>