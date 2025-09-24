import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../utils/api";

export const useTasksStore = defineStore("tasksStore", () => {
    //states
    const tasks = ref([]);
    const categories = ref([]);
    const loading = ref(false);
    const limit = 20;
    const offset = ref(0);
    const hasMore = ref(true);

    //actions
    const fetchTasks = async ($state = null, filters = {}) => {
        try {
            loading.value = true;
            const params = {
                order: "created_at.desc",
                limit,
                offset: offset.value,
            };

            if (filters.category_id) {
                params.category_id = `eq.${filters.category_id}`;
            }
            const response = await api.get("/tasks", { params });
            if (response.data.length) {
                tasks.value.push(...response.data);
                offset.value += limit;
                if ($state) $state.loaded();
            } else {
                hasMore.value = false;
                if ($state) $state.complete();
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            loading.value = false;
        }
    };
    const fetchCategories = async () => {
        try {
            loading.value = true;
            const response = await api.get("/categories");
            categories.value = response.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            loading.value = false;
        }
    };

    const setTasks = (newTasks) => {
        tasks.value = [...newTasks];
    };

    const resetTasks = () => {
        tasks.value = [];
        offset.value = 0;
        hasMore.value = true;
    };

    return {
        //states
        tasks,
        categories,
        loading,
        limit,
        offset,
        hasMore,

        //actions
        fetchCategories,
        fetchTasks,
        setTasks,
        resetTasks,
    };
});
