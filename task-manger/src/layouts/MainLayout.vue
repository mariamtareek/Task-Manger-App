<!-- Main Layout Component -->
<template>
    <div class="w-full flex min-h-screen relative">
        <div v-if="sidebarOpen" class="fixed inset-0 bg-gray-100/50 bg-opacity-50 z-40 md:hidden"
            @click="sidebarOpen = false"></div>

        <SideBar v-model:open="sidebarOpen" @toggleSidebar="sidebarOpen = false" class="w-64 md:w-1/5 lg:w-1/6" />

        <div class="flex-1 md:ml-0">
          <div class="flex items-center gap-2 px-7 pt-4">
            <button @click="sidebarOpen = !sidebarOpen" class="md:hidden p-2 rounded-md hover:bg-gray-100">
                <Menu class="w-6 h-6" />
            </button>
            <h1 class="text-xl font-semibold">{{ route.meta.title }}</h1>
          </div>
          <router-view :sidebar-open="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import SideBar from '../components/layout/SideBar.vue'
import { Menu } from "lucide-vue-next";
import { useRoute } from 'vue-router'

const sidebarOpen = ref(false)
const route = useRoute()

</script>