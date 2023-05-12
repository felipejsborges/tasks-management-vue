<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';

import api from '@/api'

const router = useRouter()

const title = ref('')
const description = ref('')
const effort = ref(0)

async function handleSubmit() {
	await api.post('/tasks', {
		title: title.value,
		description: description.value,
		effort: effort.value,
	}, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	})

	router.push({ name: 'home' })
}

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