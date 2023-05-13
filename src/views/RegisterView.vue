<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/api'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

async function login() {
	await api.post('/users', {
		name: name.value,
		email: email.value,
		password: password.value,
	})

	router.push({ name: 'login' })
}
</script>

<template>
	<div class="container">
		<form @submit.prevent="login">
			<input type="text" v-model="name" />
			<input type="text" v-model="email" />
			<input type="password" v-model="password" />
			<button>Register</button>
		</form>
	</div>
</template>

<style lang="scss" scoped>
.container {
	max-width: 1400px;
	width: 100%;

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		input {
			background: gray;
		}
	}
}
</style>