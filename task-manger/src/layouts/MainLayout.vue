<!-- Main Layout Component -->
<template>
    <div class="w-full flex min-h-screen relative">
        <div v-if="sidebarOpen" class="fixed inset-0 bg-gray-100/50 bg-opacity-50 z-40 md:hidden"
            @click="sidebarOpen = false"></div>

        <SideBar v-model:open="sidebarOpen" @toggleSidebar="sidebarOpen = false" class="w-64 md:w-1/5 lg:w-1/6" />

        <div class="flex-1 md:ml-0">
            <router-view :sidebar-open="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import SideBar from '../components/layout/SideBar.vue'

const sidebarOpen = ref(false)
</script>