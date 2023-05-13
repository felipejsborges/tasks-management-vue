<script setup lang="ts">
import { ref, type PropType, watch } from 'vue';
import { useRouter } from 'vue-router';

import api from '@/api';
import { debounce } from '@/utils/debounce';

interface Task {
	id: number
	title: string
	description: string
	effort: number
	completed_at: Date
}

type OnFetch = (data: {
	totalTasks: number,
	nextPage: string | null,
	previousPage: string | null
}) => void

const props = defineProps({
	currentPage: {
		type: Number,
		default: 1
	},
	search: {
		type: String,
		default: ""
	},
	onFetch: {
		type: Function as PropType<OnFetch>,
		required: true
	},
})

const router = useRouter()

const tasks = ref<Task[]>([])
const fieldToOrderBy = ref<string | null>(null)

const showConfirmDeletionDialog = ref(false)
const taskToDelete = ref<number | null>(null)

async function fetch() {
	let routePath = `/tasks?search=${props.search}&page=${props.currentPage}`

	if (fieldToOrderBy.value) {
		routePath += `&ordering=${fieldToOrderBy.value}`
	}

	const { data } = await api.get(routePath)

	tasks.value = data.results
	props.onFetch({ totalTasks: data.count, nextPage: data.next, previousPage: data.previous })
}
const debouncedFetch = debounce(() => {
	fetch()
}, 500);

function orderBy(field: string) {
	if (fieldToOrderBy.value === field) {
		fieldToOrderBy.value = `-${field}`
		return
	}
	fieldToOrderBy.value = field
}

async function handleCompleteTask(taskId: number) {
	await api.patch(`/tasks/${taskId}/complete`, {})

	await fetch()
}

function handleEditTask(taskId: number) {
	router.push({ name: 'tasks-form', params: { id: taskId } })
}

function handleDeleteTask(taskId: number) {
	taskToDelete.value = taskId
	showConfirmDeletionDialog.value = true
}

async function handleConfirmDeletion() {
	await api.delete(`/tasks/${taskToDelete.value}`)

	await fetch()
	showConfirmDeletionDialog.value = false
	taskToDelete.value = null
}

watch(() => props.search, debouncedFetch, { immediate: true })
watch(() => props.currentPage, fetch)

</script>

<template>
	<div class="container">
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
	</div>

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
</template>

<style lang="scss" scoped>
.container {
	table {
		margin-top: 5rem;
		width: 100%;
		border-collapse: collapse;

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

			.options {
				display: flex;
				justify-content: flex-end;
				gap: 1rem;
			}
		}
	}
}
</style>