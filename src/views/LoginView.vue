<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/api'

const router = useRouter()

const email = ref('')
const password = ref('')

async function login() {
	const { data } = await api.post('/token/', {
		email: email.value,
		password: password.value,
	})

	localStorage.setItem('token', data.access)

	router.push({ name: 'home' })
}

</script>

<template>
	<form @submit.prevent="login">
		<input type="text" v-model="email" />
		<input type="password" v-model="password" />
		<button>Login</button>
	</form>
</template>

<style scoped></style>