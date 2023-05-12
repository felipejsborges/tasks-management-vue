<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';

import api from '@/api'

const router = useRouter()
const { params } = useRoute()

const title = ref('')
const description = ref('')
const effort = ref(0)

async function createTask() {
	await api.post('/tasks', {
		title: title.value,
		description: description.value,
		effort: effort.value,
	}, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	})
}

async function updateTask() {
	await api.put(`/tasks/${params.id}`, {
		title: title.value,
		description: description.value,
		effort: effort.value,
	}, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	})
}

async function handleSubmit() {
	if (!params.id) {
		await createTask()
	} else {
		await updateTask()
	}

	router.push({ name: 'home' })
}

onMounted(async () => {
	if (!params.id) return

	const { data } = await api.get(`/tasks/${params.id}`, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	})

	title.value = data.title
	description.value = data.description
	effort.value = data.effort
})

</script>

<template>
	<div class="container">
		<form @submit.prevent="handleSubmit">
			<input type="text" v-model="title" />
			<input type="text" v-model="description" />
			<input type="number" v-model="effort" />
			<button>Save</button>
		</form>
	</div>
</template>

<style scoped>
.container {
	max-width: 1400px;
	width: 100%;
}

form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
</style>