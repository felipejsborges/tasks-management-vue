<script setup lang="ts">
import { ref } from 'vue';

import SearchBar from './SearchBar/SearchBar.vue'
import TasksList from './TasksList/TasksList.vue'
import Pagination from './PaginationView/PaginationView.vue'

const search = ref('')

const totalTasks = ref<number>(0)
const currentPage = ref<number>(1)
const nextPage = ref<string | null>(null)
const previousPage = ref<string | null>(null)

function handleChangeSearchInput(value: string) {
	search.value = value
}

function handleFetch(data: {
	totalTasks: number,
	nextPage: string | null,
	previousPage: string | null
}) {
	totalTasks.value = data.totalTasks
	nextPage.value = data.nextPage
	previousPage.value = data.previousPage
}

function handleChangePage(page: number) {
	currentPage.value = page
}

</script>

<template>
	<div class="container">
		<header>
			<SearchBar :onChangeSearchInput="handleChangeSearchInput" />
		</header>

		<main>
			<TasksList :onFetch="handleFetch" :currentPage="currentPage" :search="search" />
		</main>

		<footer>
			<Pagination :totalTasks="totalTasks" :nextPage="nextPage" :previousPage="previousPage"
				:onChangePage="handleChangePage" />
		</footer>
	</div>
</template>

<style lang="scss" scoped>
.container {
	max-width: 1400px;
	width: 100%;
	position: relative;
}
</style>
