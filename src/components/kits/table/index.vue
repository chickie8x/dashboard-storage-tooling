<template>
  <div class="w-full h-full">
    <table class="w-full min-w-[720px] border border-slate-300">
      <thead class="bg-slate-200 h-10 text-sm">
        <tr class="text-left">
          <th class="px-4 py-2 border-r border-white">
            <input type="checkbox" disabled class="w-4 h-4" />
          </th>
          <th v-for="header in headers" :key="header.value" class="px-4 py-2 border-r border-white">
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody v-if="data.length === 0">
        <tr>
          <td colspan="100%" class="text-center text-gray-500 py-4">
            {{ isLoading ? '&#8693; Đang tải dữ liệu...' : '&#9888; Không có dữ liệu' }}
          </td>
        </tr>
      </tbody>
      <tbody v-else class="text-sm text-slate-700">
        <tr v-for="(row, idx) in data" :key="idx" class="border-b border-slate-300">
          <td class="px-4 py-2 border-r border-gray-200">
            <input v-model="selectedRows[idx]" type="checkbox" class="w-4 h-4" />
          </td>
          <td
            v-for="header in headers"
            :key="header.value"
            class="px-4 py-2 border-r border-gray-200"
            :class="[
              header.value === 'goodsStatus' && row[header.value] === 'OK'
                ? 'text-green-600 font-semibold'
                : '',
              header.value === 'goodsStatus' && row[header.value] === 'Hỏng'
                ? 'text-red-600 font-semibold'
                : '',
              header.value === 'goodsStatus'
                ? 'text-fuchsia-600 font-semibold'
                : '',
              header.value === 'sessionCode'
                ? 'text-blue-600 font-semibold cursor-pointer hover:underline'
                : '',
              header.value === 'code'
                ? 'text-blue-600 font-semibold'
                : '',
              header.value === 'note'
                ? 'max-w-[160px] overflow-hidden hover:overflow-visible text-ellipsis whitespace-nowrap hover:whitespace-normal hover:break-words cursor-default'
                : '',
              header.value === 'isDone' ? 'text-green-600 font-semibold' : '',
            ]"
            @click="handleClick(header.value, row.id)"
          >
            {{ header.value === 'createdAt' ? formatDate(row[header.value]) : row[header.value] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatDate } from '@/utils'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  headers: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: () => false,
  },
})

const emit = defineEmits(['selectRow'])

const selectedRows = ref(new Array(props.data.length).fill(null))

watch(
  selectedRows,
  () => {
    emit('selectRow', selectedRows.value)
  },
  { deep: true },
)

const handleClick = (key, id) => {
  if (key !== 'sessionCode') return
  router.push(`/session/${id}`)
}

const refreshCheckbox = () => {
  selectedRows.value = new Array(props.data.length).fill(null)
}

defineExpose({
  refreshCheckbox,
})
</script>
