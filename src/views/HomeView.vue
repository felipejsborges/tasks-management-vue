<script setup lang="ts">
import { watchEffect, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import api from '@/api'
import { debounce } from '@/utils/debounce'

interface Task {
  id: number
  title: string
  description: string
  effort: number
  completed_at: Date
}

const router = useRouter()

const tasks = ref<Task[]>([])
const totalTasks = ref<number>(0)
const nextPage = ref<string | null>(null)
const previousPage = ref<string | null>(null)

const currentPage = ref<number>(1)
const fieldToOrderBy = ref<string | null>(null)

const search = ref('')

const showConfirmDeletionDialog = ref(false)
const taskToDelete = ref<number | null>(null)

async function fetch(search = "") {
  let routePath = `/tasks?search=${search}&page=${currentPage.value}`

  if (fieldToOrderBy.value) {
    routePath += `&ordering=${fieldToOrderBy.value}`
  }

  const { data } = await api.get(routePath, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  tasks.value = data.results
  totalTasks.value = data.count
  nextPage.value = data.next
  previousPage.value = data.previous
}

const debouncedFetch = debounce((search: string) => {
  fetch(search)
}, 500);

function changePage(pageUrl: string | null) {
  if (pageUrl && pageUrl.includes("page=")) {
    currentPage.value = Number(pageUrl.split("page=")[1].split("&")[0])
    return
  }
  currentPage.value = 1
}

function orderBy(field: string) {
  if (fieldToOrderBy.value === field) {
    fieldToOrderBy.value = `-${field}`
    return
  }
  fieldToOrderBy.value = field
}

function goToCreateTask() {
  router.push({ name: 'tasks-form' })
}

async function handleCompleteTask(taskId: number) {
  await api.patch(`/tasks/${taskId}/complete`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  await fetch(search.value)
}

function handleEditTask(taskId: number) {
  router.push({ name: 'tasks-form', params: { id: taskId } })
}

function handleDeleteTask(taskId: number) {
  taskToDelete.value = taskId
  showConfirmDeletionDialog.value = true
}

async function handleConfirmDeletion() {
  await api.delete(`/tasks/${taskToDelete.value}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  await fetch(search.value)
  showConfirmDeletionDialog.value = false
  taskToDelete.value = null
}

watchEffect(() => {
  debouncedFetch(search.value)
})

watch([currentPage, fieldToOrderBy], async () => {
  fetch(search.value)
})
</script>

<template>
  <div class="container">
    <header>
      <input id="search" placeholder="Search for a task title..." v-model="search" />
      <label for="search">Search</label>
      <button @click="goToCreateTask">Create</button>
    </header>

    <main>
      <table>
        <thead>
          <tr>
            <th @click="orderBy('completed_at')">Completed</th>
            <th @click="orderBy('title')">Title</th>
            <th @click="orderBy('effort')">Effort</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item) in tasks" :key="item.id">
            <td>
              <input type="checkbox" :checked="!!item.completed_at" @click="handleCompleteTask(item.id)" />
            </td>
            <td>{{ item.title }}</td>
            <td>{{ item.effort }}</td>
            <td>
              <div class="options">
                <button @click="handleEditTask(item.id)">Edit</button>
                <button @click="handleDeleteTask(item.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </main>

    <footer>
      <button :disabled="!previousPage" @click="changePage(previousPage)">Previous</button>
      <button :disabled="!nextPage" @click="changePage(nextPage)">Next</button>
      <span>Total: {{ totalTasks }}</span>
    </footer>

    <v-dialog v-model="showConfirmDeletionDialog" width="auto">
      <v-card>
        <v-card-text>
          Are you sure you want to delete this task?
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="handleConfirmDeletion">Yes</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn color="primary" block @click="showConfirmDeletionDialog = false">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
  width: 100%;
  position: relative;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

input {
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #333;
}

label {
  position: absolute;
  left: 0;
  top: -1.5rem;
}

button {
  margin-left: 1rem;
  width: 5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

table {
  margin-top: 5rem;
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: center;
}

th:first-child,
td:first-child {
  text-align: left;
}

th:last-child,
td:last-child {
  text-align: right;
}

td {
  padding-top: 1rem;
}

.options {
  display: flex;
  justify-content: flex-end;
}

footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
</style>
