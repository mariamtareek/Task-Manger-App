<template>
    <div class="fixed inset-0 bg-gray-100/70 flex justify-center items-center z-20" @click="emit('back')">
        <div class="bg-white border border-gray-200 max-w-2xl w-full mx-4 p-6 flex flex-col gap-6 rounded-lg max-h-[90vh] overflow-y-auto"
            @click.stop>
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <ArrowLeft @click="emit('back')" class="cursor-pointer" />
                    <div class="flex flex-col">
                        <h2 class="font-semibold text-base">Task Details</h2>
                        <p class="font-light text-sm text-gray-600">View and manage task information</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button @click="handleEdit"
                        class="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors">
                        <Edit3 :size="18" />
                    </button>
                    <button @click="handleDelete" :disabled="submitting"
                        class="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors disabled:opacity-50">
                        <Trash2 :size="18" />
                    </button>
                </div>
            </div>

            <hr class="-mx-5" />

            <div class="flex flex-col gap-6">
                <div v-if="taskDetails?.image" class="relative h-64 rounded-lg overflow-hidden">
                    <div v-if="imageLoadState !== 'loaded'"
                        class="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <div class="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                    <div v-if="imageLoadState === 'error'" class="h-full bg-gray-100 flex items-center justify-center">
                        <Image :size="48" class="text-gray-400" />
                        <p class="text-gray-500 ml-3">Failed to load image</p>
                    </div>
                    <img v-else :src="taskDetails.image" :alt="taskDetails.title" class="w-full h-full object-cover"
                        @load="handleImageLoad" @error="handleImageError" />
                </div>

                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h2 :class="[
                            'text-2xl font-bold mb-3',
                            taskDetails?.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        ]">
                            {{ taskDetails?.title }}
                        </h2>
                        <div class="flex items-center gap-3 flex-wrap">
                            <span v-if="category" class="px-3 py-1 rounded-full text-sm font-medium flex items-center"
                                :style="{
                                    backgroundColor: category.color + '20',
                                    color: category.color
                                }">
                                <Tag :size="14" class="mr-1" />
                                {{ category.name }}
                            </span>
                            <span :class="[
                                'px-2 py-1 rounded-full text-xs font-medium border flex items-center',
                                getPriorityColor(taskDetails?.priority)
                            ]">
                                <Star :size="12" class="mr-1" />
                                {{ taskDetails?.priority }} priority
                            </span>
                        </div>
                    </div>
                    <button @click="toggleTaskCompletion" :disabled="submitting" :class="[
                        'px-4 py-2 rounded-lg font-medium transition-colors flex items-center ml-4',
                        taskDetails?.completed
                            ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                            : 'bg-green-100 hover:bg-green-200 text-green-700',
                        'disabled:opacity-50'
                    ]">
                        <div v-if="submitting"
                            class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin">
                        </div>
                        <template v-else-if="taskDetails?.completed">
                            <X :size="16" class="mr-1" />
                            Mark Incomplete
                        </template>
                        <template v-else>
                            <Check :size="16" class="mr-1" />
                            Mark Complete
                        </template>
                    </button>
                </div>

                <div v-if="taskDetails?.description">
                    <h3 class="font-semibold text-gray-900 mb-2">Description</h3>
                    <p class="text-gray-700 leading-relaxed">{{ taskDetails.description }}</p>
                </div>

                <div v-if="taskDetails?.due_date">
                    <h3 class="font-semibold text-gray-900 mb-2">Due Date</h3>
                    <div class="flex items-center text-gray-700">
                        <Calendar :size="18" class="mr-2" />
                        {{ formatDate(taskDetails.due_date) }}
                    </div>
                </div>

                <!-- Completion Status -->
                <div>
                    <h3 class="font-semibold text-gray-900 mb-2">Status</h3>
                    <div :class="[
                        'inline-flex items-center px-3 py-2 rounded-lg',
                        taskDetails?.completed
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                    ]">
                        <Check v-if="taskDetails?.completed" :size="16" class="mr-2" />
                        <Clock v-else :size="16" class="mr-2" />
                        {{ taskDetails ? 'Completed' : 'In Progress' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <TaskForm v-if="editing" :selectedTask="taskDetails" @back="editing = false" />
</template>

<script setup>
import { ArrowLeft, Edit3, Trash2, Tag, Star, Check, X, Clock, Calendar, Image } from 'lucide-vue-next';
import { computed, onMounted, ref, watch } from 'vue';
import { useTasksStore } from '../../stores/useTasksStore';
import api from '../../utils/api';
import getPriorityColor from '../../utils/getPriorityColor';
import TaskForm from './TaskForm.vue';

const tasksStore = useTasksStore();

const props = defineProps({
    selectedTask: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['back', 'edit', 'delete', 'update']);
const submitting = ref(false);
const editing = ref(false);
const imageLoadState = ref('loading');

const taskDetails = computed(() => tasksStore.tasks.find(t => t.id == props.selectedTask.id))

const category = computed(() => {
    if (!taskDetails.value.category_id) return null;
    return tasksStore.categories.find(cat => cat.id === taskDetails.value.category_id);
});

const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const handleImageLoad = () => {
    imageLoadState.value = 'loaded';
};

const handleImageError = () => {
    imageLoadState.value = 'error';
};

const handleEdit = () => {
    editing.value = true
    // emit('edit', props.selectedTask);
};

const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        submitting.value = true;

        await api.delete(`/tasks?id=eq.${taskDetails.value.id}`);  

        const updatedTasks = tasksStore.tasks.filter(task => task.id !== taskDetails.value.id);
        tasksStore.setTasks(updatedTasks)
        emit('back');
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
    } finally {
        submitting.value = false;
    }
};

const toggleTaskCompletion = async () => {
    try {
        submitting.value = true;
        const updatedTask = {
            ...taskDetails.value,
            completed: !taskDetails.value.completed
        };        

        await api.patch(`/tasks?id=eq.${taskDetails.value.id}`, {
            completed: updatedTask.completed
        });

        // Update task in store
        const updatedTasks = tasksStore.tasks.map(t =>
            t.id === updatedTask.id ? { ...t, ...updatedTask } : t
        )
        tasksStore.setTasks(updatedTasks)

        emit('update', updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
    } finally {
        submitting.value = false;
    }
};

onMounted(async () => {
    if (tasksStore.categories.length == 0) {
        await tasksStore.fetchCategories();

        imageLoadState.value = taskDetails.value.image ? 'loading' : 'loaded';
    }
});
</script>