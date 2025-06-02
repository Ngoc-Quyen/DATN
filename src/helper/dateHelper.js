// src/helper/dateHelper.js
function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return null;

    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}
function formatDateToYYYYMMDD(dateStr) {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}
function toInternational(phone) {
    if (!phone) return '';

    // Nếu số bắt đầu bằng '0', thay thành '+84'
    if (phone.startsWith('0')) {
        return '+84' + phone.slice(1);
    }

    // Nếu đã là số quốc tế (ví dụ bắt đầu bằng +), giữ nguyên
    if (phone.startsWith('+')) {
        return phone;
    }

    // Trường hợp khác, giữ nguyên hoặc tùy xử lý thêm
    return phone;
}

export default {
    formatDateToDDMMYYYY: formatDateToDDMMYYYY,
    formatDateToYYYYMMDD: formatDateToYYYYMMDD,
    toInternational: toInternational,
};
