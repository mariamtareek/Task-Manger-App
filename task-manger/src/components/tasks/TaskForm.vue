<template>
    <div class="fixed inset-0 bg-gray-100/70 flex justify-center items-center z-20" @click="emit('back')">
        <div class="bg-white border border-gray-200 min-w-xs h-[85%] overflow-auto md:min-w-md md:h-auto px-5 py-3 flex flex-col gap-6 rounded-lg" @click.stop>
            <div class="flex items-center gap-3">
                <ArrowLeft @click="emit('back')" class="cursor-pointer" />
                <div class="flex flex-col">
                    <h2 class="font-semibold text-base">{{ selectedTask? 'Update Your Task ' : 'Add New Task ' }}</h2>
                    <p class=" font-light text-base">Fill in the details for your new task </p>
                </div>
            </div>
            <hr class="-mx-5" />
            <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-1">
                    <label class="block text-sm font-medium text-gray-700">Task Title *</label>
                    <input type="text" v-model="formData.title" :class="`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-transparent focus:border-transparent 
                        ${formErrors.title ? 'border-red-300 focus:border-red-300' : 'border-gray-300'}`"
                        placeholder="Enter task title" />
                    <p v-if="formErrors.title" class="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size="14" />
                        {{ formErrors.title }}
                    </p>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="block text-sm font-medium text-gray-700">Category *</label>
                    <select v-model="formData.category" :class="`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-transparent focus:border-transparent ${formErrors.category ? 'border-red-300 focus:border-red-300' : 'border-gray-300'
                        }`">
                        <option value="">Select a category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                    <p v-if="formErrors.category" class="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size="14" />
                        {{ formErrors.category }}
                    </p>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="block text-sm font-medium text-gray-700">Description </label>
                    <textarea type="text" v-model="formData.description" rows="3"
                        class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-transparent focus:border-transparent border-gray-300"
                        placeholder="Enter task description (optional)"></textarea>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="block text-sm font-medium text-gray-700">Priority </label>
                    <select v-model="formData.priority"
                        class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-transparent focus:border-transparent border-gray-300">
                        <option value="">Select a priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="block text-sm font-medium text-gray-700">
                        Due Date
                    </label>
                    <input type="date" v-model="formData.due_date"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-transparent focus:border-transparent" />
                </div>
            </div>
            <div class="flex gap-3 pt-3">
                <button @click="emit('back')" type="button"
                    class="flex-1 bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                    Cancel
                </button>
                <button type="button" :disabled="!validateForm" @click="handleSubmit"
                    class="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <div v-if="submitting" class="flex gap-2 items-center">
                        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin">
                        </div>
                        {{ selectedTask ? 'Updating Task...' : 'Creating Task...' }}
                    </div>
                    <div v-else>
                        {{ selectedTask ? 'Update Task' : 'Create Task' }}
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ArrowLeft, AlertCircle } from 'lucide-vue-next';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useTasksStore } from '../../stores/useTasksStore';
import api from '../../utils/api';

const tasksStore = useTasksStore()

const props = defineProps({
    selectedTask: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['back'])

const formData = reactive({
    title: '',
    category: '',
    description: '',
    priority: '',
    due_date: ''
})

const formErrors = reactive({
    title: '',
    category: '',
})

const submitting = ref(false)

const categories = computed(() => tasksStore.categories)

const validators = {
    title: (v) => !!v || 'Task Title is required',
    category: (v) => !!v || 'Task Category is required'
}

const validateField = (field) => {
    const valid = validators[field](formData[field])
    formErrors[field] = valid === true ? '' : valid
    return valid === true
}

Object.keys(validators).forEach((field) => {
    watch(() => formData[field], () => validateField(field))
})

const validateForm = computed(() => {
    return Object.keys(validators).every((f) => validateField(f))
})

const handleSubmit = async () => {
    if (!validateForm.value)
        return
    try {
        submitting.value = true
        if (!props.selectedTask) { // Create task
            const response = await api.post('/tasks', {
                title: formData.title,
                category_id: formData.category,
                description: formData.description,
                due_date: formData.due_date,
                priority: formData.priority,
            })
            if (response?.data)
                tasksStore.setTasks([...tasksStore.tasks, response.data])
        } else { //update task
            const response = await api.patch('/tasks', {
                title: formData.title,
                category_id: formData.category,
                description: formData.description,
                due_date: formData.due_date,
                priority: formData.priority
            },
                {
                    params: {
                        id: `eq.${props.selectedTask.id}`
                    },
                })
            const updatedTask = response.data
            const updatedTasks = tasksStore.tasks.map(t =>
                t.id === props.selectedTask.id ? { ...t, ...updatedTask } : t
            )
            tasksStore.setTasks(updatedTasks)
        }
    } catch (error) {
        console.log(error)
    } finally {
        submitting.value = false
        emit('back')
    }
}


watch(() => props.selectedTask, () => {
    if (props.selectedTask) {
        formData.title = props.selectedTask.title
        formData.category = props.selectedTask.category_id
        formData.description = props.selectedTask.description
        formData.due_date = props.selectedTask.due_date
        formData.priority = props.selectedTask.priority
        formData.id = props.selectedTask.id
    }
}, { deep: true, immediate: true })


onMounted(async () => {
    if (tasksStore.categories.length == 0)
        await tasksStore.fetchCategories()
})

</script>