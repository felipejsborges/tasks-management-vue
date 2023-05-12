<script setup lang="ts">
import { watchEffect, ref } from 'vue';

import api from '@/api'
import { debounce } from '@/utils/debounce'

interface Task {
  id: number
  title: string
  description: string
  effort: number
  completed_at: Date
}

const tasks = ref<Task[]>([])
const totalTasks = ref<number>(0)
const nextPage = ref<string | null>(null)
const previousPage = ref<string | null>(null)

const search = ref('')

async function fetch(search = "", pageUrl: string | null) {
  let routePath = `/tasks?search=${search}`

  if (pageUrl && pageUrl.includes("page=")) {
    const page = pageUrl.split("page=")[1].split("&")[0]
    routePath += `&page=${page}`
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
  fetch(search, null)
}, 500);

watchEffect(() => {
  debouncedFetch(search.value)
})
</script>

<template>
  <div class="container">
    <header>
      <input id="search" placeholder="Search for a task title..." v-model="search" />
      <label for="search">Search</label>
      <button>Create</button>
    </header>

    <main>
      <table>
        <thead>
          <tr>
            <th>Completed</th>
            <th>Title</th>
            <th>Effort</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item) in tasks" :key="item.id">
            <td>
              <input type="checkbox" :checked="!!item.completed_at" />
            </td>
            <td>{{ item.title }}</td>
            <td>{{ item.effort }}</td>
            <td>
              <div class="options">
                <button>Edit</button>
                <button>Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </main>

    <footer>
      <button :disabled="!previousPage" @click="fetch(search, previousPage)">Previous</button>
      <button :disabled="!nextPage" @click="fetch(search, nextPage)">Next</button>
      <span>Total: {{ totalTasks }}</span>
    </footer>
  </div>
</template>

<style>
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
