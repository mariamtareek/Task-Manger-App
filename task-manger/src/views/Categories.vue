<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-6">Task Categories</h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="cat in categories" :key="cat.id"
                class="rounded-xl shadow-md overflow-hidden transition transform hover:scale-[1.02]">
                <!-- Category Color Header -->
                <div class="h-28 flex items-center justify-center relative" :style="{ backgroundColor: cat.color }">
                    <img :src="cat.icon_url" alt="icon" class="w-12 h-12 object-contain" />
                </div>

                <!-- Content -->
                <div class="p-4 flex flex-col gap-2">
                    <h2 class="font-semibold text-lg">{{ cat.name }}</h2>
                    <p class="text-sm text-gray-500">Created: {{ formatDate(cat.created_at) }}</p>

                    <!-- Color Tag -->
                    <div class="flex items-center gap-2 mt-2">
                        <span class="inline-block w-4 h-4 rounded-full border"
                            :style="{ backgroundColor: cat.color }"></span>
                        <span class="text-sm text-gray-600">{{ cat.color }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTasksStore } from '../stores/useTasksStore';

const tasksStore = useTasksStore()
const categories = computed(() => tasksStore.categories)

const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

onMounted(async () => {
    if (tasksStore.categories.length == 0) {
        await tasksStore.fetchCategories()
    }
})
</script>