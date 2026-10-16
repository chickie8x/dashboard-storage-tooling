<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex flex-col gap-6">

        <!-- Header -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <button @click="handleBack"
                    class="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-200">
                    <ChevronLeftIcon class="w-4 h-4" />
                    <span>Quay lại</span>
                </button>
                <div class="flex flex-col gap-0.5">
                    <h1 class="text-xl font-bold text-slate-800">Nhập dữ liệu</h1>
                    <span class="text-xs text-slate-400">Dán dữ liệu từ Excel và điền thông tin phiên</span>
                </div>
            </div>
            <div
                class="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Phiên đang hoạt động</span>
            </div>
        </div>

        <!-- Body -->
        <div class="flex gap-5 flex-1">

            <!-- Left Panel: Excel Paste -->
            <div class="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
                <div class="flex items-center gap-2.5">
                    <TableCellsIcon class="w-5 h-5 text-blue-500" />
                    <span class="text-sm font-semibold text-slate-700 flex-1">Dữ liệu Excel</span>
                    <span
                        class="bg-blue-50 text-blue-500 text-xs font-semibold px-3 py-0.5 rounded-full border border-blue-100">
                        {{ rowCount }} dòng
                    </span>
                </div>

                <div class="relative flex-1 min-h-96 rounded-xl border-2 transition-all duration-200 overflow-hidden"
                    :class="excelData
                        ? 'border-blue-400 bg-white'
                        : 'border-dashed border-slate-300 bg-slate-50 focus-within:border-blue-400 focus-within:border-solid focus-within:bg-white'">
                    <textarea id="excel-paste-area" v-model="excelData"
                        class="w-full h-full min-h-96 resize-none border-none outline-none bg-transparent p-4 font-mono text-sm text-slate-700 leading-relaxed relative z-10"
                        spellcheck="false"></textarea>
                    <div v-if="!excelData"
                        class="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none z-0">
                        <ClipboardDocumentIcon class="w-10 h-10 text-slate-300" />
                        <span class="text-sm font-semibold text-slate-400">Dán dữ liệu Excel</span>
                        <span class="text-xs text-slate-300">Sao chép vùng dữ liệu trong Excel rồi nhấn Ctrl+V</span>
                    </div>
                </div>
            </div>

            <!-- Right Panel: Session Info -->
            <div class="w-96 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-5">
                <div class="flex items-center gap-2.5">
                    <AdjustmentsHorizontalIcon class="w-5 h-5 text-purple-500" />
                    <span class="text-sm font-semibold text-slate-700">Thông tin phiên</span>
                </div>

                <!-- Select Fields -->
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1.5">
                        <label for="select-vehicle"
                            class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <ArrowsRightLeftIcon class="w-3.5 h-3.5" />
                            Nhập/Xuất
                        </label>
                        <div class="relative">
                            <select id="select-vehicle" v-model="inputOutput"
                                class="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-9 text-sm text-slate-700 cursor-pointer outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 hover:border-indigo-300 transition-all duration-200">
                                <option value="Nhập" selected>Nhập</option>
                                <option value="Xuất">Xuất</option>
                            </select>
                            <ChevronDownIcon
                                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label for="select-route"
                            class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <TruckIcon class="w-3.5 h-3.5" />
                            Đơn vị vận chuyển
                        </label>
                        <div class="relative">
                            <select id="select-route" v-model="carrier"
                                class="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-9 text-sm text-slate-700 cursor-pointer outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 hover:border-indigo-300 transition-all duration-200">
                                <option value="SPX">SPX</option>
                                <option value="ViettelPost">Viettel Post</option>
                                <option value="JT">JT</option>
                                <option value="GHN">GHN</option>
                                <option value="GHTK">GHTK</option>
                                <option value="VNPost">VNPost</option>
                                <option value="NJV">NJV</option>
                                <option value="Best">Best</option>
                                <option value="Lazada">Lazada</option>
                                <option value="Hàng Nội Bài">Hàng Nội Bài</option>
                            </select>
                            <ChevronDownIcon
                                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label for="goodsStatus" class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <ExclamationCircleIcon class="w-3.5 h-3.5" />
                            Trạng thái
                        </label>
                        <div class="relative">
                            <select id="goodsStatus" v-model="status"
                                class="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-9 text-sm text-slate-700 cursor-pointer outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 hover:border-indigo-300 transition-all duration-200">
                                <option value="OK">OK</option>
                                <option value="Hỏng">Hỏng</option>
                                <option value="Đã xuất kho">Đã xuất kho</option>
                                <option value="Đã xuất kho tầng 3">Đã xuất kho tầng 3</option>
                                <option value="Van Nghe Yunyi">Van Nghe Yunyi</option>
                                <option value="KY Việt Hùng">KY Việt Hùng</option>
                                <option value="Ban giao VNPOST">Ban giao VNPOST</option>
                                <option value="SON MP">SON MP</option>
                                <option value="Lên kệ">Lên kệ</option>
                                <option value="Hạ kệ">Hạ kệ</option>
                                <option value="Bàn giao vận chuyển">Bàn giao vận chuyển</option>
                            </select>
                            <ChevronDownIcon
                                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <!-- Divider -->
                <div class="border-t border-slate-100"></div>

                <!-- Note -->
                <div class="flex flex-col gap-1.5">
                    <label for="note-area" class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <PencilSquareIcon class="w-3.5 h-3.5" />
                        Ghi chú
                    </label>
                    <textarea id="note-area" v-model="note" rows="4" placeholder="Nhập ghi chú cho phiên này..."
                        class="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 resize-y outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 placeholder:text-slate-300 leading-relaxed"></textarea>
                    <span class="text-xs text-slate-400 text-right">{{ note.length }} ký tự</span>
                </div>

                <!-- Buttons -->
                <div class="mt-auto flex gap-3 pt-4 border-t border-slate-100">
                    <button id="btn-clear" @click="handleClearData"
                        class="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-500 border border-red-100 rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-200 hover:-translate-y-0.5 transition-all duration-200">
                        <TrashIcon class="w-4 h-4" />
                        Xóa dữ liệu
                    </button>
                    <button id="btn-close-session" @click="handleCloseSession"
                        class="flex-1 flex items-center justify-center gap-2 bg-orange-50 text-orange-500 border border-orange-100 rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all duration-200">
                        <XCircleIcon class="w-4 h-4" />
                        Đóng phiên
                    </button>
                </div>
            </div>
        </div>

        <!-- Confirm Modal -->
        <Teleport to="body">
            <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
                leave-active-class="transition-opacity duration-200" leave-to-class="opacity-0">
                <div v-if="modal.show"
                    class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50"
                    @click.self="modal.show = false">
                    <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 scale-95"
                        leave-active-class="transition-all duration-200" leave-to-class="opacity-0 scale-95">
                        <div v-if="modal.show"
                            class="bg-white rounded-2xl p-8 w-[380px] flex flex-col items-center gap-3 shadow-2xl">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center" :class="modal.iconBg">
                                <component :is="modal.icon" class="w-6 h-6" :class="modal.iconColor" />
                            </div>
                            <h3 class="text-lg font-bold text-slate-800">{{ modal.title }}</h3>
                            <p class="text-sm text-slate-500 text-center leading-relaxed">{{ modal.desc }}</p>
                            <div class="flex gap-3 w-full mt-2">
                                <button @click="modal.show = false"
                                    class="flex-1 bg-slate-100 text-slate-600 rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-slate-200 transition-all duration-200">
                                    Hủy
                                </button>
                                <button @click="modal.onConfirm"
                                    class="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200"
                                    :class="modal.confirmBg">
                                    {{ modal.confirmText }}
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import {
    ChevronLeftIcon,
    ChevronDownIcon,
    TableCellsIcon,
    ClipboardDocumentIcon,
    AdjustmentsHorizontalIcon,
    PencilSquareIcon,
    TrashIcon,
    XCircleIcon,
    TruckIcon,
    ArrowsRightLeftIcon,
    ExclamationCircleIcon
} from '@heroicons/vue/24/solid'

const router = useRouter()
const excelData = ref('')
const note = ref('')
const inputOutput = ref('Nhập')
const carrier = ref('SPX')
const status = ref('OK')

const rowCount = computed(() => {
    if (!excelData.value.trim()) return 0
    return excelData.value.trim().split('\n').filter((r) => r.trim()).length
})

const modal = ref({
    show: false,
    title: '',
    desc: '',
    icon: null,
    iconBg: '',
    iconColor: '',
    confirmText: '',
    confirmBg: '',
    onConfirm: () => { },
})

const handleBack = () => {
    router.push('/dashboard')
}

const handleClearData = () => {
    modal.value = {
        show: true,
        title: 'Xóa dữ liệu?',
        desc: 'Toàn bộ dữ liệu Excel, thông tin phiên và ghi chú sẽ bị xóa. Hành động này không thể hoàn tác.',
        icon: TrashIcon,
        iconBg: 'bg-red-50',
        iconColor: 'text-red-500',
        confirmText: 'Xóa',
        confirmBg: 'bg-red-500 hover:bg-red-600',
        onConfirm: () => {
            excelData.value = ''
            note.value = ''
            inputOutput.value = 'Nhập'
            carrier.value = 'SPX'
            status.value = 'OK'
            modal.value.show = false
        },
    }
}

const createSession = async () => {
    const token = localStorage.getItem('token')
    console.log(token)
    const items = excelData.value.trim().split('\n').filter((r) => r.trim())
    if (items.length === 0) return alert('Phiên cần ít nhất 1 mã vận đơn')
    if (!navigator.onLine) return alert('Không có kết nối internet')
    const sessionCode = `LC_${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}`

    const payload = {
        sessionCode,
        sessionType: inputOutput.value,
        transportCode: items.map(item => {
            return {
                code: item,
                transporter: carrier.value,
                goodsStatus: status.value,
            }
        }),
        note: note.value,
        goodsStatus: status.value,
        transporter: carrier.value,
        transportCodeQuantity: items.length,
    }

    await axios
        .post('http://171.244.143.152/api/session-transport/create', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            alert('Lưu phiên thành công')
            excelData.value = ''
            note.value = ''
            inputOutput.value = 'Nhập'
            carrier.value = 'SPX'
            status.value = 'OK'
        })
        .catch((err) => {
            alert(err.response?.data?.message || err.message)
        })
}

const handleCloseSession = () => {
    createSession()
}
</script>