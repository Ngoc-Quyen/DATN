# shared-doctor-care

## Quickstart (after downloading this project)

1. Open this project with your favorite editor(IDE), eg: Visual Studio Code
2. Run the command (to install the node_modules): npm install
3. Copy the .env.example, create a new file, name ".env" in root folder (the same level with .env.example)
4. Create the database: open Mysql Workbench or PHP myadmin or any database management system, run the "database.sql" in the "database" folder.
   It will automatically create a new schema, name "doctorcare" in your database.
5. Update the .env file

-   If you use "no-password" to login to your database, this variable "DB_PASSWORD" will be blank, otherwise, provide your password.
    Default, I use the root account. If you use other accounts, change the "DB_USERNAME" variable.
-   With the variable "MAIL_USERNAME", is your email
    "MAIL_PASSWORD" is your email app password (not your email's password). you need to generate one here: https://myaccount.google.com/apppasswords
    ( Select App: Mail, Select Device: Windows Computer -> Generate )

6. To run this app, use the command: npm start

\*\*Trong này từ đồ án cũ chuyển thành đồ án mới là
Supporter chuyển thành bệnh nhân
Clinic là gói khám (để package thì bị lỗi nên để clinic luôn)
Có gì sai sót khi chuyển thì sửa luôn nhé

Phần gói khám chưa hoàn thành
Phần customer chuyển thành bệnh nhân vẫn chưa ổn
Chưa làm phần đăng nhập cho user
Mọi người check thử lại hết cái nào k ổn ghi vào đây nhé

Các quy trình sử dụng web (frontend)

-   Đăng nhập
    Home (main/homepage/homepage.ejs)
    |** Đăng nhập (auth/login.ejs)
    |** Quên mật khẩu (auth/login.ejs)
    |\_\_ Đổi mật khẩu (auth/reset-password.ejs) -> câu này ở dòng 1 <%- contentFor('content-body') %>

-   Đăng ký
    Home (main/homepage/homepage.ejs)
    |\_\_ Đăng ký (auth/register.ejs)

-   Xem bác sĩ
    Home (main/homepage/homepage.ejs)
    |** Tất cả bác sĩ (main/homepage/allDoctors.ejs)
    |** Chi tiết bác sĩ (main/homepage/doctor.ejs)

    hoặc
    Home (main/homepage/homepage.ejs)
    |** Tất cả chuyên khoa (main/homepage/allSpecialozation.ejs)
    |** Chi tiết bác sĩ (main/homepage/doctor.ejs)

    có thêm phần bình luận của bệnh nhân đối với bác sĩ
    |** Chi tiết bác sĩ (main/homepage/doctor.ejs)
    |** Gửi bình luận (main/homepage/feedback.ejs)

    khi đặt lịch khám
    |** Chi tiết bác sĩ (main/homepage/doctor.ejs)
    |** Hiện thông tin đặt lịch khám (main/homepage/infoBooking.ejs)

-   Xem chuyên khoa
    Home (main/homepage/homepage.ejs)
    |** Tất cả chuyên khoa (main/homepage/allSpecialozation.ejs)
    |** Chi tiết chuyên khoa (main/homepage/specialization.ejs)

-   Xem bài đăng (chưa hoàn thiện)
    Home (main/homepage/homepage.ejs)
    |** Tất cả bài đăng (main/homepage/allPostPagination.ejs)
    |** Chi tiết bài đăng (main/homepage/post.ejs)
    |\_\_ Tìm bài đăng (main/homepage/searchPost.ejs)

\*\*Phần admin:

-   Phần khung bên trái: (main/user/includes/sidebar.ejs)

-   Phần khung phía trên: (main/user/includes/topbar.ejs)

-   Phần chính của admin/dashboard/điều khiển: (main/user/home.ejs)

-   Bác sĩ:
    |** Tạo bác sĩ: (main/user/admins/createDoctor.ejs)
    |** Chỉnh sửa bác sĩ: (main/user/admins/editDoctor.ejs)
    |\_\_ Quản lý bác sĩ: (main/user/admins/manageDoctor.ejs)

-   Người dùng:
    |\_\_ Quản lý người dùng: (main/user/admins/manageUser.ejs) (Từ quản lý supporter chuyển qua quản lý user)

-   Bài đăng:
    |** Tạo bài đăng: (main/user/admins/createPost.ejs)
    |** Chỉnh sửa bài đăng: (main/user/admins/editPost.ejs)
    |\_\_ Quản lý bài đăng: (main/user/admins/managePost.ejs)

-   Quản lý các lịch hẹn - có thể search và xem lại lịch đã hẹn
    |\_\_ Quản lý lịch hẹn (main/user/admins/manageAppointment.ejs)

-   Kế hoạch (từng bác sĩ):
    |** Tạo lịch trình: (main/user/admins/createSchedule.ejs)
    |** Lịch trình: (main/user/admins/Schedule.ejs)

-   Quản lý đặt khám
    |\_\_ Quản lý lịch đã đặt (main/user/admins/manageBooking.ejs)

-   Thống kê:
    |\_\_ Thống kê (main/user/admins/manageChartDoctor.ejs)

Admin: - Quản lý tài khoản bệnh nhân, bác sĩ - Quản lý chuyên khoa - Bệnh nhân chỉ đặt lịch hẹn thì ko đổ dữ liệu vào admin

Bác sĩ: - Quản lý lịch hẹn
