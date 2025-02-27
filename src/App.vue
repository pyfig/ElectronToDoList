<template>
  <div class="container">
    <h1>Todo List</h1>
    
    <div class="add-todo">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="Add a new todo..."
        type="text"
      />
      <button @click="addTodo">Add</button>
    </div>

    <div class="todo-list">
      <div v-for="todo in todos" :key="todo.id" class="todo-item">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(todo)"
        />
        <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
        <button @click="deleteTodo(todo.id)" class="delete-btn">×</button>
      </div>
    </div>

    <div class="telegram-setup" v-if="!isTelegramConfigured">
      <h3>Setup Telegram Notifications</h3>
      <input
        v-model="telegramToken"
        placeholder="Enter Telegram Bot Token"
        type="text"
      />
      <input
        v-model="telegramChatId"
        placeholder="Enter Chat ID"
        type="text"
      />
      <button @click="setupTelegram">Save</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
const database = window.require('./electron/database.js')
const telegram = window.require('./electron/telegram.js')

export default {
  setup() {
    const todos = ref([])
    const newTodo = ref('')
    const telegramToken = ref('')
    const telegramChatId = ref('')
    const isTelegramConfigured = ref(false)

    const loadTodos = async () => {
      todos.value = await database.getAllTodos()
    }

    const addTodo = async () => {
      if (!newTodo.value.trim()) return
      await database.addTodo(newTodo.value)
      newTodo.value = ''
      loadTodos()
    }

    const toggleTodo = async (todo) => {
      await database.toggleTodo(todo.id)
      if (!todo.completed) { // If it's being marked as completed
        await telegram.notifyTaskCompleted(todo.title)
      }
      loadTodos()
    }

    const deleteTodo = async (id) => {
      await database.deleteTodo(id)
      loadTodos()
    }

    const setupTelegram = () => {
      if (telegramToken.value && telegramChatId.value) {
        telegram.initialize(telegramToken.value, telegramChatId.value)
        isTelegramConfigured.value = true
        telegramToken.value = ''
        telegramChatId.value = ''
      }
    }

    onMounted(() => {
      loadTodos()
    })

    return {
      todos,
      newTodo,
      telegramToken,
      telegramChatId,
      isTelegramConfigured,
      addTodo,
      toggleTodo,
      deleteTodo,
      setupTelegram
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
}

.add-todo {
  display: flex;
  margin-bottom: 20px;
}

input[type="text"] {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 14px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #45a049;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 8px;
}

.todo-item input[type="checkbox"] {
  margin-right: 10px;
}

.todo-item span {
  flex: 1;
}

.todo-item .completed {
  text-decoration: line-through;
  color: #888;
}

.delete-btn {
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  padding: 0;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #cc0000;
}

.telegram-setup {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.telegram-setup h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
}

.telegram-setup input {
  width: 100%;
  margin-bottom: 10px;
}
</style>
