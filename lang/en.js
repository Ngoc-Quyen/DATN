import { template } from 'lodash';

export const transValidation = {
    email_incorrect: 'Email không hợp lệ',
    gender_incorrect: 'Giới tính không hợp lệ',
    password_incorrect: 'Mật khẩu phải có ít nhất 6 ký tự',
    password_confirmation_incorrect: 'Mật khẩu xác nhận không chính xác',
};

export const transMailBookingNew = {
    subject: 'Email thông báo tiến độ đặt lịch khám tại Doctors Care',
    template: (data) => {
        return `<h3>Cảm ơn bạn đã đặt lịch hẹn tại hệ thống Doctors Care </h3>
        <h4>Thông tin đặt lịch hẹn:</h4>
        <div>Tên bác sĩ ${data.doctor} </div>
        <div>Giờ: ${data.time}</div>
        <div>Ngày: ${data.date}</div>
        <div>Tình trạng: <b> Đang chờ xử lý - Một cuộc hẹn mới đang chờ xác nhận</b></div>
        <h4>Hệ thống Doctors Care sẽ tự động gửi email thông báo khi cuộc hẹn được xác nhận hoàn tất.</h4>
        <br>
        <h4>Cảm ơn bạn đã sử dụng dịch vụ của DoctorCare!</h4>
        <h4>Trân trọng,</h4> 
        <div>
            Đội ngũ hỗ trợ khách hàng <br>
            <b>DoctorCare</b> <br>
            Website: https://www.doctorcare.com <br>
            Email: webdoctorcare@gmail.com <br>
            Phone Number: 0382106557 <br>
        </div>`;
    },
};

export const transMailBookingFailed = {
    subject: 'Email thông báo tiến độ đặt lịch khám tại Doctors Care',
    template: (data) => {
        return `<h3>Cảm ơn bạn đã đặt lịch hẹn tại hệ thống Doctors Care  </h3>
        <h4>Thông tin đặt lịch hẹn:</h4>
        <div>Tên bác sĩ: ${data.doctor} </div>
        <div>Giờ: ${data.time}</div>
        <div>Ngày: ${data.date}</div>
        <div>Tình trạng: <b>Hủy - ${data.reason}</b></div>
        <br>
        <h4>Cảm ơn bạn đã sử dụng dịch vụ của DoctorCare!</h4>
        <h4>Trân trọng,</h4> 
        <div>
            Đội ngũ hỗ trợ khách hàng <br>
            <b>DoctorCare</b> <br>
            Website: https://www.doctorcare.com <br>
            Email: webdoctorcare@gmail.com <br>
            Phone Number: 0382106557 <br>
        </div>`;
    },
};

export const transMailBookingSuccess = {
    subject: 'Email thông báo tiến độ đặt lịch khám tại Doctors Care',
    template: (data) => {
        return `<h3>Cảm ơn bạn đã đặt lịch hẹn tại hệ thống Doctors Care </h3>
        <h4>Thông tin đặt lịch hẹn:</h4>
        <div>Tên bác sĩ: ${data.doctor} </div>
        <div>Giờ: ${data.time}</div>
        <div>Ngày: ${data.date}</div>
        <div>Tình trạng: <b>Thành công</b></div>
        <br>
        <h4>Cảm ơn bạn đã sử dụng dịch vụ của DoctorCare!</h4>
        <h4>Trân trọng,</h4> 
        <div>
            Đội ngũ hỗ trợ khách hàng <br>
            <b>DoctorCare</b> <br>
            Website: https://www.doctorcare.com <br>
            Email: webdoctorcare@gmail.com <br>
            Phone Number: 0382106557 <br>
        </div>`;
    },
};

export const transMailRemedy = {
    subject: 'Email gửi hóa đơn y tế từ bác sĩ',
    template: (data) => {
        return `<h3>Cảm ơn bạn đã tin tưởng đăng ký khám bệnh trên hệ thống của DoctorCare.</h3>
        Sau khi bạn đã hẹn khám tại bác sĩ <b> ${data.doctor} </b>, bạn có thể xem lại chi tiết thanh toán từ tệp đính kèm email này. </h4>
        <div>Mật khẩu giải nén file đính kèm có dạng sau: <i>Họ và tên không dấu - 3 số đầu số điện thoại - 2 số cuối năm sinh của bạn</div>
        <br>
        <div>Ví dụ: Họ và tên: Hongtien, SĐT đăng ký: 0123456789 và sinh: 2003, mật khẩu giải nén là: <b> Hongtien-012-03 </b> </div>
        <br>
        <div>Trong trường hợp không nhận được file đính kèm cũng như không giải nén được, vui lòng liên hệ tổng đài hỗ trợ <b>0123 456 789</b></div>
        <br>
        <h4>Cảm ơn bạn đã sử dụng dịch vụ của DoctorCare!</h4>
        <h4>Trân trọng,</h4> 
        <div>
            Đội ngũ hỗ trợ khách hàng <br>
            <b>DoctorCare</b> <br>
            Website: https://www.doctorcare.com <br>
            Email: webdoctorcare@gmail.com <br>
            Phone Number: 0382106557 <br>
        </div>`;
    },
};
export const mailEnd = {
    subject: 'Email gửi hóa đơn y tế từ bác sĩ',
    template: (data) => {
        return `<h3>Cảm ơn bạn đã tin tưởng đăng ký khám bệnh trên hệ thống của DoctorCare.</h3>
        <h4>Thông tin đặt lịch hẹn:</h4>
        <div>Tên bác sĩ: ${data.doctor} </div>
        <div>Giờ: ${data.time}</div>
        <div>Ngày: ${data.date}</div>
        <div>Kết quả khám bệnh: <b>${data.result}</b></div>
        <div>Thông tin thêm: <b>${data.moreInfo}</b></div>
        <br>
        <div>Nếu có gì thắc mắc, vui lòng liên hệ tổng đài hỗ trợ <b>0123 456 789</b></div>
        <div>Có phản hồi về vấn đề dịch vụ khám bệnh vui lòng gửi mail phản hồi tại địa chỉ mail <b>tranngocquyen262dc@gmail.com</b></div>
        <br>
        <h4>Cảm ơn bạn đã sử dụng dịch vụ của DoctorCare!</h4>
        <h4>Trân trọng,</h4> 
        <div>
            Đội ngũ hỗ trợ khách hàng <br>
            <b>DoctorCare</b> <br>
            Website: https://www.doctorcare.com <br>
            Email: webdoctorcare@gmail.com <br>
            Phone Number: 0382106557 <br>
        </div>
        `;
    },
};

export const mailChangePass = {
    subject: 'Email gửi mã OTP đổi mật khẩu',
    template: (data) => {
        return `<h3>Chào ${data.name}</h3>
        <div>Chúng tôi đã nhận được yêu cầu thay đổi mật khẩu cho tài khoản của bạn tại DoctorCare. Để hoàn tất quá trình này, vui lòng nhập Mã xác thực một lần (OTP) dưới đây: </div>
        <div><b>Mã OTP của bạn là: ${data.otp}</b></div>
        <div>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này và liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi để được trợ giúp.</div>
        <div><b>Lưu ý:</b> Vì lý do bảo mật, hãy không chia sẻ mã OTP này với bất kỳ ai. Nếu bạn nhận được email này nhưng không phải do bạn yêu cầu, vui lòng thông báo cho chúng tôi ngay lập tức.</div>
        <br>
        <h4>Cảm ơn bạn đã sử dụng dịch vụ của DoctorCare!</h4>
        <h4>Trân trọng,</h4> 
        <div>
            Đội ngũ hỗ trợ khách hàng <br>
            <b>DoctorCare</b> <br>
            Website: https://www.doctorcare.com <br>
            Email: webdoctorcare@gmail.com <br>
            Phone Number: 0382106557 <br>
        </div>
        `;
    },
};

export const mailNotificationTimeOffFail = {
    subject: 'Email thông báo lịch xin nghỉ không được duyệt',
    template: (data) => {
        return `
            <h3>Chào BS. ${data.name},</h3>
            <p>Chúng tôi đã nhận được yêu cầu xin nghỉ từ <strong>${data.startDate}</strong> đến <strong>${data.endDate}</strong>, tuy nhiên rất tiếc yêu cầu này <strong>không được duyệt</strong>.</p>
            <p><strong>Lý do:</strong> Không có bác sĩ thay thế ca làm trong khoảng thời gian này.</p>
            <p>Rất mong bác sĩ thông cảm và tiếp tục thực hiện công việc theo lịch đã được phân công.</p>
            <p>Nếu bác sĩ có nhu cầu thay đổi lịch trong các thời điểm khác, vui lòng thông báo sớm để chúng tôi có thể hỗ trợ sắp xếp hợp lý hơn.</p>
            <p>Trân trọng,</p>
            <p>Phòng Hành chính / Điều phối lịch làm việc</p>
        `;
    },
};

export const mailNotificationTimeOffSuccess = {
    subject: 'Email thông báo lịch xin nghỉ đã được duyệt',
    template: (data) => {
        const reassignedFromDoctorHtml = data.listSwapSchedule?.length
            ? `
            <p>Trong thời gian nghỉ, một số ca làm của bạn đã được chuyển cho Bác sĩ khác:</p>
            <ul>
            ${data.listSwapSchedule
                .map(
                    (shift) => `
                <li>
                Ngày <strong>${shift.dateASwap}</strong> - (${
                        shift.type === 'oncall' ? 'Ca trực' : 'Ca thường'
                    }) được chuyển cho BS. <strong>${shift.doctorSwapName}</strong>
                </li>
                <li>
                Ngày <strong>${shift.dateBSwap}</strong> - (${
                        shift.type === 'oncall' ? 'Ca trực' : 'Ca thường'
                    }) được đổi từ BS. <strong>${shift.doctorSwapName}</strong> sang cho bạn.
                </li>
            </ul>
            `
                )
                .join('')}
            </ul>
            `
            : '';

        return `
            <h3>Chào BS. ${data.name},</h3>
            <p>Yêu cầu xin nghỉ/đổi ca từ <strong>${data.startDate}</strong> đến <strong>${data.endDate}</strong> của bác sĩ đã được <strong>duyệt</strong>.</p>
            <p>Chúng tôi đã cập nhật lại lịch làm việc theo yêu cầu.</p>
            ${reassignedFromDoctorHtml}
            <p>Chúc bác sĩ có thời gian nghỉ ngơi thoải mái và hợp lý.</p>
            <p>Trân trọng,</p>
            <p>Phòng Hành chính / Điều phối lịch làm việc</p>
        `;
    },
};
