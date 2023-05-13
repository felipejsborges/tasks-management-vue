<script setup lang="ts">
import type { PropType } from 'vue';


const props = defineProps({
	totalTasks: {
		type: Number,
		required: true
	},
	previousPage: {
		type: String as PropType<string | null>,
		default: null
	},
	nextPage: {
		type: String as PropType<string | null>,
		default: null
	},
	onChangePage: {
		type: Function as PropType<(page: number) => void>,
		required: true
	}
})

function changePage(pageUrl: string | null) {
	let pageNumber = 1
	if (pageUrl && pageUrl.includes("page=")) {
		pageNumber = Number(pageUrl.split("page=")[1].split("&")[0])
	}
	props.onChangePage(pageNumber)
}

</script>

<template>
	<div class="container">
		<button :disabled="!previousPage" @click="changePage(previousPage)">Previous</button>
		<button :disabled="!nextPage" @click="changePage(nextPage)">Next</button>
		<span>Total: {{ totalTasks }}</span>
	</div>
</template>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	gap: 1rem;
}
</style>