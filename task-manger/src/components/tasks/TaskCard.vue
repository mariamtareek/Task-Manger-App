<template>
    <div
        @click="$emit('showTaskDetails',task)"
        class="border-1 rounded-lg border-gray-200 p-5 flex flex-col justify-between gap-2 hover:shadow-sm transition-shadow duration-200 cursor-pointer">
        <div class="flex items-center justify-between gap-2">
            <div class="w-2/3 flex flex-col gap-2">
                <div class="flex-1 space-y-4">
                    <!-- Category Badge -->
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-sm" :style="{ backgroundColor: taskCategory.color || '#6B7280' }">
                        </div>
                        <span class="px-2 py-1 text-xs font-medium rounded-lg border" :style="{
                            backgroundColor: taskCategory.color + '20' || '#F3F4F620',
                            color: taskCategory.color || '#6B7280',
                            borderColor: taskCategory.color + '40' || '#6B7280'
                        }">
                            {{ taskCategory.name }}
                        </span>
                    </div>
                    <!-- Task Content -->
                    <h1 class="text-md font-bold text-gray-900 capitalize leading-tight">
                        {{ task.title }}
                    </h1>
                    <!-- <p class="text-gray-600 text-sm leading-relaxed">
                        {{ task.description }}
                    </p> -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-nowrap">
                        <div class="flex items-center gap-2">
                            <Calendar class="w-4 h-4 text-gray-400" />
                            <span class="text-sm text-gray-600">Due :</span>
                            <span :class="`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'
                                }`">
                                {{ formattedDueDate }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Task Image -->
            <img v-if="task.image_url" :src="task.image_url" :alt="task.title" class="w-1/3 h-28 object-cover rounded-lg" />
            <div v-else class="w-1/3 h-28 bg-gray-100 flex items-center justify-center rounded-lg">
                <FileImage />
            </div>
        </div>
        <!-- Task Status and Priority -->
        <div class="flex items-center gap-2 pt-4">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium"
                :class="task.completed ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'">
                <component :is="task.completed ? CircleCheck : CircleEllipsis" class="w-4 h-4" />
                {{ task.completed ? 'Completed' : 'Pending' }}
            </span>
            <span v-if="!task.completed"
                :class="`capitalize px-2 py-1 text-xs font-medium rounded-lg border ${priorityColor}`">
                {{ task.priority }} Priority
            </span>
        </div>
    </div>
</template>

<script setup>
import { Calendar, CircleCheck, CircleEllipsis, FileImage } from 'lucide-vue-next';
import { useTasksStore } from '../../stores/useTasksStore';
import { computed } from 'vue';
import getPriorityColor from '../../utils/getPriorityColor';

const props = defineProps({
    task: {
        type: Object,
        required: true
    }
});

defineEmits(['showTaskDetails'])

const tasksStore = useTasksStore();

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const isOverdue = computed(() => {
    const today = new Date();
    const dueDate = new Date(props.task.due_date);
    return dueDate < today && !props.task.completed;
});

const priorityColor = computed(() => getPriorityColor(props.task.priority));

const formattedDueDate = computed(() => formatDate(props.task.due_date));

const taskCategory = computed(() => {
    const categories = tasksStore.categories;
    return categories.find(cat => cat.id === props.task.category_id) || {
        name: 'Uncategorized',
        color: '#6B7280'
    };
});
</script>