$(document).ready(function () {
    if (!window.timeOffs) return;

    highlightTimeOffDays(window.timeOffs);
});
// Hàm đổi màu cho các ngày trong lịch

function highlightTimeOffDays(timeOffs) {
    const calendarBody = $('#calendarBody');
    const rows = calendarBody.find('tr');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Duyệt qua từng hàng trong lịch
    rows.each(function () {
        const cells = $(this).find('td');

        // Duyệt qua từng ô trong hàng
        cells.each(function () {
            const cell = $(this);
            const day = parseInt(cell.text());

            // Bỏ qua các ô trống
            if (isNaN(day)) return;

            // Tạo ngày hiện tại từ ô lịch
            const cellDate = new Date(currentYear, currentMonth, day);

            // Kiểm tra ngày có trong timeOffs không
            timeOffs.forEach((timeOff) => {
                const startDate = new Date(timeOff.startDate);
                const endDate = new Date(timeOff.endDate);

                if (cellDate >= startDate && cellDate <= endDate) {
                    // Đổi màu theo statusId
                    if (timeOff.statusId === 3) {
                        cell.css('background-color', '#FFE082'); // Màu vàng nhạt
                    } else if (timeOff.statusId === 1) {
                        cell.css('background-color', '#A5D6A7'); // Màu xanh lá nhạt
                    } else if (timeOff.statusId === 2) {
                        cell.css('background-color', '#EF9A9A'); // Màu đỏ nhạt
                    }
                }
            });
        });
    });
}

// Xuất hàm để sử dụng ở nơi khác
export { highlightTimeOffDays };
