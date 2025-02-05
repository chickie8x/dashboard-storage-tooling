import { format } from 'date-fns'
import * as XLSX from 'xlsx'

export const formatDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy')
}

export const exportExcel = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const array = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([array], { type: 'application/octet-stream' })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'exported-data.xlsx'
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const preprocessData = (data) => {
  return data.map((item) => {
    delete item.id
    delete item.updatedAt
    delete item.sessionTransportId
    delete item.userId

    if (item.code) {
      item['Mã vận đơn'] = item.code
      delete item.code
    }

    if (item.transporter) {
      item['Đơn vị vận chuyển'] = item.transporter
      delete item.transporter
    }

    if (item.author) {
      item['Người tạo'] = item.author
      delete item.author
    }

    if (item.goodsStatus) {
      item['Trạng thái hàng hóa'] = item.goodsStatus
      delete item.goodsStatus
    }

    if (item.createdAt) {
      item['Ngày tạo'] = formatDate(item.createdAt)
      delete item.createdAt
    }

    item['Ghi chú'] = item.note
    delete item.note
    
    return item
  })
}
