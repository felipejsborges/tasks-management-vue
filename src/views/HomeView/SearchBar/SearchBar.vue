<script setup lang="ts">
import { ref, watch, type PropType } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
	onChangeSearchInput: {
		type: Function as PropType<(search: string) => void>,
		required: true
	}
})

const router = useRouter()

const search = ref('')

function goToCreateTask() {
	router.push({ name: 'tasks-form' })
}

watch(search, async () => {
	props.onChangeSearchInput(search.value)
})
</script>

<template>
	<div class="container">
		<input id="search" placeholder="Search for a task title..." v-model="search" />
		<label for="search">Search</label>
		<button @click="goToCreateTask">Create</button>
	</div>
</template>

<style lang="scss" scoped>
.container {
	display: flex;
	align-items: center;
	justify-content: space-between;

	label {
		position: absolute;
		left: 0;
		top: -1.5rem;
	}
}
</style>