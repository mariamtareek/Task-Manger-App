<template>
    <div class="p-6 flex flex-col gap-5 flex-1">
        <div class="flex justify-between items-center px-2 pb-4">
            <div class="flex items-center gap-3">
                <button @click="$emit('toggleSidebar')" class="md:hidden p-2 rounded-md hover:bg-gray-100">
                    <Menu class="w-6 h-6" />
                </button>
                <h1 class="text-xl font-semibold">All Tasks</h1>
            </div>
            <button @click="showAddForm = true"
                class="px-4 py-2 rounded-lg cursor-pointer border border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-100">
                + Add Task
            </button>
        </div>
        <div class="flex flex-col gap-2">
            <label class="block text-sm font-medium text-gray-700">Filter by Category </label>
            <select v-model="selectedCategory"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-transparent focus:border-transparent">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
        </div>

        <div v-if="initialLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div class="w-full h-32" v-for="n in 10" :key="n">
                <Skeleton />
            </div>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <TaskCard v-for="task in tasksStore.tasks" :key="task.id" :task="task" @showTaskDetails="handleShowTaskDetails" />
        </div>
        <InfiniteLoading @infinite="tasksStore.fetchTasks">
            <template #spinner>
                <div class="flex justify-center py-4">
                    <span class="loader"></span>
                </div>
            </template>
        </InfiniteLoading>
    </div>
    <TaskForm v-if="showAddForm" @back="showAddForm = false" />
    <TaskDetails v-if="selectedTask" :selectedTask="selectedTask" @back="selectedTask = null"/>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { useTasksStore } from '../stores/useTasksStore';
import TaskCard from '../components/tasks/TaskCard.vue';
import Skeleton from '../components/shared/Skeleton.vue';
import TaskForm from '../components/tasks/TaskForm.vue';
import TaskDetails from '../components/tasks/TaskDetails.vue';
import { Menu } from "lucide-vue-next";

const tasksStore = useTasksStore();
const showAddForm = ref(false)
const selectedCategory = ref('')
const selectedTask = ref(null)

defineProps({
    sidebarOpen: Boolean
})

const emit = defineEmits(["toggleSidebar"]);

const initialLoading = computed(() => tasksStore.loading && tasksStore.tasks.length === 0)
const categories = computed(() => tasksStore.categories)

const handleShowTaskDetails = (task) => {
    if(task){
        selectedTask.value = {...task}
    }
}

onMounted(async () => {
    await tasksStore.fetchCategories();
});

watch(() => selectedCategory.value, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
        tasksStore.resetTasks();
        const filters = newVal ? { category_id: newVal } : {};
        await tasksStore.fetchTasks(null, filters);
    }
})
</script>

<style scoped>
.loader {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: block;
    margin: 15px auto;
    position: relative;
    color: #3c3636;
    box-sizing: border-box;
    animation: animloader 1s linear infinite alternate;
}

@keyframes animloader {
    0% {
        box-shadow: -38px -12px, -14px 0, 14px 0, 38px 0;
    }

    33% {
        box-shadow: -38px 0px, -14px -12px, 14px 0, 38px 0;
    }

    66% {
        box-shadow: -38px 0px, -14px 0, 14px -12px, 38px 0;
    }

    100% {
        box-shadow: -38px 0, -14px 0, 14px 0, 38px -12px;
    }
}
</style>