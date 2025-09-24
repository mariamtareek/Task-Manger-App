<template>
    <aside
        class="border-r border-gray-300 p-4 bg-white fixed top-0 bottom-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto"
        :class="{
            'translate-x-0': open,
            '-translate-x-full': !open
        }">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Task Manager</h2>
            <button @click="$emit('toggleSidebar')" class="md:hidden p-1 rounded-md hover:bg-gray-100">
                <X class="w-5 h-5" />
            </button>
        </div>

        <nav class="flex-1 space-y-2">
            <RouterLink v-for="link in links" :key="link.to" :to="link.to" @click="$emit('update:open', false)"
                class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                :class="{ 'bg-gray-100': isActive(link.to) }">
                <component :is="link.icon" class="w-5 h-5" />
                {{ link.label }}
            </RouterLink>
        </nav>
    </aside>
</template>

<script setup>
import { useRoute } from "vue-router"
import { ClipboardList, FolderOpen, X } from "lucide-vue-next"

const route = useRoute()
const open = defineModel("open", { default: false })

const emit = defineEmits(['update:open', 'toggleSidebar'])

const links = [
    { to: "/", label: "All Tasks", icon: ClipboardList },
    { to: "/categories", label: "Categories", icon: FolderOpen },
]

const isActive = (path) => route.path === path
</script>