<script setup lang="ts">
import { watchEffect, ref } from 'vue';

interface Task {
  id: number
  title: string
  description: string
  effort: number
  completed_at: Date
}

const taskList = ref<Task[]>([])

watchEffect(async () => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/tasks`
  )
  const responseJson = await response.json()
  taskList.value = responseJson.results
})
</script>

<template>
  <div class="container">
    <header>
      <input id="search" placeholder="Search for a task title..." />
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
          <tr>
            <td>
              <input type="checkbox" checked />
            </td>
            <td>Task 1</td>
            <td>2</td>
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
      TODO: pagination
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
</style>
