# 📌 Task Manager Web Application  

A responsive and interactive **Task Manager Web App** built as part of the **Osolutions Frontend Developer Technical Assessment**.  
This application allows users to manage tasks efficiently with features like task creation, editing, deletion, category-based filtering, and responsive design.  
---

## Tech Stack  

- **Framework**: Vue.js (Vite)  
-  **Styling**: TailwindCSS  
-  **State Management**: Pinia  
-  **HTTP Client**: Axios  

---

## ⚡ Features  
- Handeled List loading state by making Loading skeleton
- Handeled pagination by making Infinite scroll behaveior

### ✅ Core Features  
- **Task List View** 
  - Display tasks in card/list format with title, description, category, completion status  
  - Task images with loading & error fallback  
  - Category-based filtering (dropdown/tabs)  
  - Loading states during data fetching  
  - “Add Task” button  

- **Add/Edit Task Form**  
  - Required fields: Title, Category (fetched from API)  
  - Optional fields: Description, Priority, Due Date  
  - Client-side validation with error messages  
  - Save & Cancel functionality  
  - Loading states during submission  

- **Task Detail View**  
  - Display full task information  
  - Toggle completion status  
  - Edit & Delete actions  
  - Image handling with fallback  
  - Navigate back to list  

- **Category Integration**  
  - Fetch categories from API  
  - Category colors for distinction  
  - Category icons where appropriate  

## Demo  
Deployed version with Netlify -> https://task-manger-appp.netlify.app/

## App Images
<img width="1470" height="802" alt="Screenshot 2025-09-25 at 3 06 44 AM" src="https://github.com/user-attachments/assets/2187e5a8-a588-4444-bd43-7d08ba7fc29e" />
<img width="1470" height="802" alt="Screenshot 2025-09-25 at 3 07 05 AM" src="https://github.com/user-attachments/assets/85d11ab2-ea2e-4993-8fcc-79ff6faf02ad" />
<img width="1000" height="506" alt="Screenshot 2025-09-18 at 11 57 02 AM" src="https://github.com/user-attachments/assets/c90f2114-4229-4bff-ad8a-0a736d1a8e5e" />
<img width="1470" height="802" alt="Screenshot 2025-09-25 at 3 11 06 AM" src="https://github.com/user-attachments/assets/fa3020fe-93a1-4a10-8855-4d5f9da303e3" />
<img width="1470" height="802" alt="Screenshot 2025-09-25 at 3 10 39 AM" src="https://github.com/user-attachments/assets/6bd9b340-f871-4cc7-8b8e-d343d369f9d3" />
<img width="1470" height="802" alt="Screenshot 2025-09-25 at 3 11 33 AM" src="https://github.com/user-attachments/assets/53b31ac8-3b58-4670-b384-60860d39ba89" />
