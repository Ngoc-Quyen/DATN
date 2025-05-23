var loadFile = function (event) {
    var output = $('#image-preview');
    if ($('#image-clinic').val()) {
        output.removeClass('d-none');
        output.addClass('d-block');
        output.attr('src', URL.createObjectURL(event.target.files[0]));
    }
};

function loadImageUserSetting() {
    var output = $('#img-user-setting');
    if ($('#update-avatar').val()) {
        output.attr('src', URL.createObjectURL(event.target.files[0]));
    }
}

function createNewPost(markdown, converter) {
    $('#createNewPost').on('click', function (event) {
        let formData = new FormData($('form#formCreateNewPost')[0]);
        let contentMarkdown = markdown.value();
        let contentHTML = converter.makeHtml(contentMarkdown);
        formData.append('contentMarkdown', contentMarkdown);
        formData.append('contentHTML', contentHTML);
        formData.append('title', $('#title-post').val());

        let data = {};
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1];
        }
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/admin/manage/post/create`,
            data: data,
            success: function (data) {
                alert('Một bài đăng mới được tạo thành công!');
                window.location.href = `${window.location.origin}/admin/manage/posts`;
            },
            error: function (error) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(error);
            },
        });
    });
}

function deleteClinicById() {
    $('.delete-specific-clinic').bind('click', function (e) {
        e.preventDefault();
        if (!confirm('Xóa gói khám này?')) {
            return;
        }

        let id = $(this).data('clinic-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/clinic`,
            data: { id: id },
            success: function (data) {
                node.closest('tr').remove();
                alertify.success('Xóa thành công!');
            },
            error: function (err) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(err);
            },
        });
    });
}

function createNewClinic(markdownIntroClinic, converter) {
    $('#createNewClinic').on('click', function (e) {
        let formData = new FormData($('form#formCreateNewClinic')[0]);
        let contentMarkdown = markdownIntroClinic.value();
        let contentHTML = converter.makeHtml(contentMarkdown);

        //contain file upload
        if ($('#image-clinic').val()) {
            formData.append('introductionMarkdown', contentMarkdown);
            formData.append('introductionHTML', contentHTML);
            formData.append('image', document.getElementById('image-clinic').files[0]);
            handleCreateClinicNormal(formData);
        } else {
            // create without file upload
            let data = {
                introductionMarkdown: contentMarkdown,
                introductionHTML: contentHTML,
            };
            for (let pair of formData.entries()) {
                data[pair[0]] = pair[1];
            }
            handleCreateClinicWithoutFile(data);
        }
    });
}

function handleCreateClinicWithoutFile(data) {
    $.ajax({
        method: 'POST',
        url: `${window.location.origin}/admin/clinic/create-without-file`,
        data: data,
        success: function (data) {
            alert('Một gói khám mới được tạo thành công');
            window.location.href = `${window.location.origin}/users/manage/clinic`;
        },
        error: function (error) {
            alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            console.log(error);
        },
    });
}

function handleCreateClinicNormal(formData) {
    $.ajax({
        method: 'POST',
        url: `${window.location.origin}/admin/clinic/create`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            alert('Một gói khám mới được tạo thành công');
            window.location.href = `${window.location.origin}/users/manage/clinic`;
        },
        error: function (error) {
            alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            console.log(error);
        },
    });
}

function updateClinic(markdownIntroClinic, converter) {
    $('#btnUpdateClinic').on('click', function (e) {
        let clinicId = $('#btnUpdateClinic').data('clinic-id');
        let formData = new FormData($('form#formUpdateClinic')[0]);
        let contentMarkdown = markdownIntroClinic.value();
        let contentHTML = converter.makeHtml(contentMarkdown);

        //contain file upload
        if ($('#image-clinic').val()) {
            formData.append('introductionMarkdown', contentMarkdown);
            formData.append('introductionHTML', contentHTML);
            formData.append('image', document.getElementById('image-clinic').files[0]);
            formData.append('id', clinicId);
            handleUpdateClinicNormal(formData);
        } else {
            // create without file upload
            let data = {
                id: clinicId,
                introductionMarkdown: contentMarkdown,
                introductionHTML: contentHTML,
            };
            for (let pair of formData.entries()) {
                data[pair[0]] = pair[1];
            }
            handleUpdateClinicWithoutFile(data);
        }
    });
}

function handleUpdateClinicNormal(formData) {
    $.ajax({
        method: 'PUT',
        url: `${window.location.origin}/admin/clinic/update`,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            alert('Cập nhật thành công');
            window.location.href = `${window.location.origin}/users/manage/clinic`;
        },
        error: function (error) {
            alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            console.log(error);
        },
    });
}

function handleUpdateClinicWithoutFile(data) {
    $.ajax({
        method: 'PUT',
        url: `${window.location.origin}/admin/clinic/update-without-file`,
        data: data,
        success: function (data) {
            alert('Cập nhật thành công');
            window.location.href = `${window.location.origin}/users/manage/clinic`;
        },
        error: function (error) {
            alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            console.log(error);
        },
    });
}

function showModalInfoClinic() {
    $('.info-specific-clinic').on('click', function (e) {
        e.preventDefault();
        let id = $(this).data('clinic-id');

        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/get-info-clinic-by-id`,
            data: { id: id },
            success: function (data) {
                $('#imageClinic').empty();
                $('#name').val(data.clinic.name);
                if (data.clinic.phone) {
                    $('#phone').val(data.clinic.phone);
                } else {
                    $('#phone').val('Chưa cập nhật');
                }

                if (data.clinic.image) {
                    $('#imageClinic').prepend(
                        `<img class="img-info-clinic" src="/images/clinics/${data.clinic.image}" />`
                    );
                } else {
                    $('#imageClinic').text('Chưa cập nhật');
                }

                $('#modalInfoClinic').modal('show');
            },
            error: function (error) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(error);
            },
        });
    });
}

function showModalSettingUser() {
    $('.user-setting').on('click', function (e) {
        e.preventDefault();
        $('#modalSettingUser').modal('show');
    });
}

function createNewDoctor() {
    $('#createNewDoctor').on('click', function (e) {
        e.preventDefault();
        let formData = new FormData($('form#formCreateNewDoctor')[0]);
        let data = {};
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1];
        }
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/admin/doctor/create`,
            data: data,
            success: function (data) {
                alertify.success('Thêm Bác sĩ thành công');
                // Chờ 2 giây và sau đó tải lại trang với đường dẫn mới
                setTimeout(function () {
                    window.location.href = '/users/manage/doctor'; // Thay thế '/your-new-url' bằng đường dẫn mới bạn muốn tải lại
                }, 2000); // 2000 milliseconds = 2 giây
                // alert('Tạo một bác sĩ mới thành công');
                // window.location.href = `${window.location.origin}/users/manage/doctor`;
            },
            error: function (error) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(error);
            },
        });
    });
}

function deleteDoctorById() {
    $('.delete-doctor-info').on('click', function (e) {
        if (!confirm('Xóa bác sĩ này?')) {
            return;
        }

        let id = $(this).data('doctor-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/doctor`,
            data: { id: id },
            success: function (data) {
                node.closest('tr').remove();
                alertify.success('Xóa thành công');
                // Chờ 2 giây và sau đó tải lại trang với đường dẫn mới
                setTimeout(function () {
                    window.location.href = '/users/manage/doctor'; // Thay thế '/your-new-url' bằng đường dẫn mới bạn muốn tải lại
                }, 2000); // 2000 milliseconds = 2 giây
            },
            error: function (err) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(err);
            },
        });
    });
}

// hàm xóa doctor item
$(document).ready(function () {
    // Event delegation to handle click events for dynamically added elements
    $(document).on('click', '.delete-doctor-info', function (e) {
        if (!confirm('Xóa bác sĩ này?')) {
            return;
        }

        let id = $(this).data('doctor-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/doctor`,
            data: { id: id },
            success: function (data) {
                node.closest('tr').remove();
                alertify.success('Xóa thành công');
                // Chờ 2 giây và sau đó tải lại trang với đường dẫn mới
                setTimeout(function () {
                    window.location.href = '/users/manage/doctor'; // Thay thế '/your-new-url' bằng đường dẫn mới bạn muốn tải lại
                }, 2000); // 2000 milliseconds = 2 giây
            },
            error: function (err) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(err);
            },
        });
    });
});

// function deleteCustomerById() {
//     $('.delete-customer-info').on('click', function (e) {
//         if (!confirm('Xóa bệnh nhân này?')) {
//             return;
//         }

//         let id = $(this).data('customer-id');
//         let node = this;
//         $.ajax({
//             method: 'DELETE',
//             url: `${window.location.origin}/users/customer/delete`,
//             data: { id: id },
//             success: function (data) {
//                 node.closest('tr').remove();
//                 alertify.success('Xóa thành công');
//                 // Chờ 2 giây và sau đó tải lại trang với đường dẫn mới
//                 setTimeout(function () {
//                     window.location.href = '/users/manage/customer'; // Thay thế '/your-new-url' bằng đường dẫn mới bạn muốn tải lại
//                 }, 2000); // 2000 milliseconds = 2 giây
//             },
//             error: function (err) {
//                 alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
//                 console.log(err);
//             },
//         });
//     });
// }
// hàm delete customer by Id
$(document).ready(function () {
    // Event delegation to handle click events for dynamically added elements
    $(document).on('click', '.delete-customer-info', function (e) {
        if (!confirm('Xóa bệnh nhân này?')) {
            return;
        }

        let id = $(this).data('customer-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/users/customer/delete`,
            data: { id: id },
            success: function (data) {
                node.closest('tr').remove();
                alertify.success('Xóa thành công');
                // Chờ 2 giây và sau đó tải lại trang với đường dẫn mới
                setTimeout(function () {
                    window.location.href = '/users/manage/customer'; // Thay thế '/your-new-url' bằng đường dẫn mới bạn muốn tải lại
                }, 2000); // 2000 milliseconds = 2 giây
            },
            error: function (err) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(err);
            },
        });
    });
});

function deleteScheduleByDate() {
    $('.delete-schedule-info').on('click', function (e) {
        if (!confirm('Xóa thời gian của lịch này?')) {
            return;
        }

        let day = $(this).data('schedule-day');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/doctor/delete/schedule`,
            data: { day: day },
            success: function (data) {
                node.closest('tr').remove();
                if (data.message === 'success') {
                    alertify.success('Xóa lịch hẹn thành công');
                    // Chờ 2 giây và sau đó tải lại trang với đường dẫn mới
                    setTimeout(function () {
                        window.location.href = '/doctor/manage/schedule'; // Thay thế '/your-new-url' bằng đường dẫn mới bạn muốn tải lại
                    }, 2000); // 2000 milliseconds = 2 giây
                } else {
                    alertify.error(data.message);
                    // Chờ 2 giây và sau đó tải lại trang với đường dẫn mới
                    setTimeout(function () {
                        window.location.href = '/doctor/manage/schedule'; // Thay thế '/your-new-url' bằng đường dẫn mới bạn muốn tải lại
                    }, 2000); // 2000 milliseconds = 2 giây
                }
            },
            error: function (err) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(err);
            },
        });
    });
}

function showModalInfoDoctor() {
    $('.show-doctor-info').on('click', function (e) {
        e.preventDefault();
        let id = $(this).data('doctor-id');

        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/get-info-doctor-by-id`,
            data: { id: id },
            success: function (data) {
                $('#imageDoctor').empty();

                $('#nameDoctor').val(data.doctor.name);
                $('#emailDoctor').val(data.doctor.email);
                if (data.doctor.phone) {
                    $('#phoneDoctor').val(data.doctor.phone);
                } else {
                    $('#phoneDoctor').val('Chưa cập nhật');
                }
                if (data.doctor.address) {
                    $('#addressDoctor').val(data.doctor.address);
                } else {
                    $('#addressDoctor').val('Chưa cập nhật');
                }
                if (data.specializationName) {
                    $('#specializationDoctor12').val(data.specializationName);
                } else {
                    $('#specializationDoctor12').val('Chua cap nhat');
                }

                if (data.doctor.avatar) {
                    $('#imageDoctor').prepend(`<img class="img-info-clinic" src="${data.doctor.avatar}" />`);
                } else {
                    $('#imageDoctor').text('Chưa cập nhật');
                }

                $('#modalInfoDoctor').modal('show');
            },
            error: function (error) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(error);
            },
        });
    });
}
// hàm show doctor item
$(document).ready(function () {
    // Event delegation to handle click events for dynamically added elements
    $(document).on('click', '.show-doctor-info', function (e) {
        e.preventDefault();
        let id = $(this).data('doctor-id');
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/get-info-doctor-by-id`,
            data: { id: id },
            success: function (data) {
                $('#imageDoctor').empty();

                $('#nameDoctor').val(data.doctor.name);
                if (data.doctor.phone) {
                    $('#phoneDoctor').val(data.doctor.phone);
                } else {
                    $('#phoneDoctor').val('Chưa cập nhật');
                }
                if (data.doctor.address) {
                    $('#addressDoctor').val(data.doctor.address);
                } else {
                    $('#addressDoctor').val('Chưa cập nhật');
                }
                $('#specializationDoctor12').val(data.specializationName);

                if (data.doctor.avatar) {
                    $('#imageDoctor').prepend(`<img class="img-info-clinic" src="${data.doctor.avatar}" />`);
                } else {
                    $('#imageDoctor').text('Chưa cập nhật');
                }

                $('#modalInfoDoctor').modal('show');
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
});

// function showModalInfoCustomer() {
//     $('.show-customer-info').on('click', function (e) {
//         e.preventDefault();
//         let id = $(this).data('customer-id');
//         $.ajax({
//             method: 'POST',
//             url: `${window.location.origin}/get-info-customer-by-id`,
//             data: { id: id },
//             success: function (data) {
//                 $('#imageCustomer').empty();

//                 $('#nameCustomer').val(data.user.name);
//                 if (data.user.phone) {
//                     $('#phoneCustomer').val(data.user.phone);
//                 } else {
//                     $('#phoneCustomer').val('Chưa cập nhật');
//                 }
//                 if (data.user.address) {
//                     $('#addressCustomer').val(data.user.address);
//                 } else {
//                     $('#addressCustomer').val('Chưa cập nhật');
//                 }
//                 if (data.user.avatar) {
//                     $('#imageCustomer').prepend(`<img class="img-info-clinic" src="${data?.user?.avatar}" />`);
//                 } else {
//                     $('#imageCustomer').text('Chưa cập nhật');
//                 }
//                 $('#modalInfoCustomer').modal('show');
//             },
//             error: function (error) {
//                 console.log(error);
//                 alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
//             },
//         });
//     });
// }

// hàm show customer item
$(document).ready(function () {
    // Event delegation to handle click events for dynamically added elements
    $(document).on('click', '.show-customer-info', function (e) {
        e.preventDefault();
        let id = $(this).data('customer-id');
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/get-info-customer-by-id`,
            data: { id: id },
            success: function (data) {
                $('#imageCustomer').empty();

                $('#nameCustomer').val(data.user.name);
                if (data.user.phone) {
                    $('#phoneCustomer').val(data.user.phone);
                } else {
                    $('#phoneCustomer').val('Chưa cập nhật');
                }
                if (data.user.address) {
                    $('#addressCustomer').val(data.user.address);
                } else {
                    $('#addressCustomer').val('Chưa cập nhật');
                }
                if (data.user.avatar) {
                    $('#imageCustomer').prepend(`<img class="img-info-clinic" src="${data?.user?.avatar}" />`);
                } else {
                    $('#imageCustomer').text('Chưa cập nhật');
                }
                $('#modalInfoCustomer').modal('show');
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
});

function updateCustomer() {
    $('#btnUpdateCustomer').on('click', function (e) {
        let doctorId = $('#btnUpdateCustomer').data('doctor-id');
        let data = {
            id: doctorId,
        };
        let url = `${window.location.origin}/users/customer/edit/${doctorId}`;
        $.ajax({
            method: 'POST',
            url: url,
            data: data,
            success: function (data) {
                alertify.success('Cập nhật thành công');
                window.location.reload();
            },
            error: function (error) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(error);
            },
        });
    });
}

function updateDoctorFinal() {
    $('#btnUpdateDoctor').on('click', function (e) {
        let doctorId = $('#btnUpdateDoctor').data('doctor-id');
        let data = {
            id: doctorId,
        };

        // Cập nhật URL với giá trị thực tế của doctorId
        let url = `${window.location.origin}/users/doctor/edit/${doctorId}`;
        $.ajax({
            method: 'POST',
            url: url,
            data: data,
            success: function (data) {
                alert('Cập nhật thành công');
                window.location.href = `${window.location.origin}/users/manage/doctor`;
            },
            error: function (error) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(error);
            },
        });
    });
}

function deleteSpecializationById() {
    $('.delete-specialization').on('click', function (e) {
        if (!confirm('Xóa chuyên khoa này?')) {
            return;
        }
        let id = $(this).data('specialization-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/specialization`,
            data: { id: id },
            success: function (data) {
                node.closest('tr').remove();
                alertify.success('Xóa thành công');
                // Chờ 2 giây và sau đó tải lại trang với đường dẫn mới
                setTimeout(function () {
                    window.location.href = '/users/manage/specialization'; // Thay thế '/your-new-url' bằng đường dẫn mới bạn muốn tải lại
                }, 2000); // 2000 milliseconds = 2 giây
            },
            error: function (err) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(err);
            },
        });
    });
}

function showPostsForAdmin() {
    let currentPage = 1;
    let total = $('#paginationForPost').data('total');
    if (total === 1) {
        $(' .li-next').addClass('disabled');
    }
    $('.page-post-next').on('click', function (e) {
        e.preventDefault();
        currentPage++;
        $(' .li-pre').removeClass('disabled');

        if (currentPage === total) {
            $(' .li-next').addClass('disabled');
        }
        if (currentPage > total) return;
        generateTablePostPagination(currentPage);
    });

    $('.page-post-pre').on('click', function (e) {
        e.preventDefault();
        currentPage--;
        $(' .li-next').removeClass('disabled');
        if (currentPage === 1) {
            $(' .li-pre').addClass('disabled');
        }
        if (currentPage === 0) return;
        generateTablePostPagination(currentPage);
    });
}

function generateTablePostPagination(page) {
    $.ajax({
        url: `${window.location.origin}/admin/pagination/posts?page=${page}`,
        method: 'GET',
        success: function (data) {
            $('#listPostsTable tbody').empty();
            let html = '';
            data.posts.rows.forEach((post) => {
                html += `
                 <tr>
                        <td> ${post.id}</td>
                        <td>${post.title}</td>
                        <td>${post.writerName}</td>
                        <td>${post.dateClient}</td>
                        <td class="">
                            <a class=" " href="/admin/post/edit/${post.id}" title="Edit info"><i class="fas fa-pen-square mx-3"></i></a>
                            <a class="delete-post" href="#" data-post-id="${post.id}" title="Delete"><i class="fas fa-trash"></i></a>
                        </td>
                   </tr>
                `;
            });
            $('#listPostsTable tbody').append(html);
        },
        error: function (err) {
            alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            console.log(err);
        },
    });
}

function deletePostById() {
    $('.delete-post').on('click', function (e) {
        if (!confirm('Delete this post?')) {
            return;
        }
        let id = $(this).data('post-id');
        let node = this;
        $.ajax({
            method: 'DELETE',
            url: `${window.location.origin}/admin/delete/post`,
            data: { id: id },
            success: function (data) {
                node.closest('tr').remove();
                alertify.success('Xóa thành công');
            },
            error: function (err) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(err);
            },
        });
    });
}

function updatePost(markdown, converter) {
    $('#btnUpdatePost').on('click', function (e) {
        let postId = $('#btnUpdatePost').data('post-id');
        let formData = new FormData($('form#formUpdatePost')[0]);
        let contentMarkdown = markdown.value();
        let contentHTML = converter.makeHtml(contentMarkdown);
        formData.append('contentMarkdown', contentMarkdown);
        formData.append('contentHTML', contentHTML);
        formData.append('title', $('#titlePost').val());

        let data = {
            id: postId,
        };
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1];
        }
        $.ajax({
            method: 'PUT',
            url: `${window.location.origin}/admin/post/update`,
            data: data,
            success: function (data) {
                alert('Cập nhật thành công');
                window.location.href = `${window.location.origin}/admin/manage/posts`;
            },
            error: function (error) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(error);
            },
        });
    });
}

function createScheduleByDoctor(scheduleArr) {
    $('#createNewScheduleDoctor').on('click', function () {
        const doctorId = $(this).val();
        const selectedDate = $('#datepicker').val();

        if (scheduleArr.length === 0) {
            alertify.error('Have not selected a plan to save');
            return;
        }

        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/users/manage/schedule-doctor/create/${doctorId}`,
            data: { schedule_arr: scheduleArr },
            success: function (data) {
                if (data.status === 1) {
                    alertify.success('Thêm lịch hẹn thành công');
                }
                // Giữ nguyên URL hiện tại và tải lại trang
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },
            error: function (error) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(error);
            },
        });
    });
}

function selectAllScheduleByAdmin(scheduleArr) {
    $('#selectAllScheduleDoctor').on('click', function () {
        const selectedDate = $('#datepicker').val();

        $('.btn-schedule:not(:disabled)').each(function () {
            const $btn = $(this);
            const time = $btn.val();

            // Nếu chưa được chọn (chưa có class btn-info)
            if (!$btn.hasClass('btn-info')) {
                // Đổi màu nút
                $btn.removeClass('btn-light').addClass('btn-info');

                // Kiểm tra nếu chưa có trong bảng (tránh thêm trùng)
                const exists = scheduleArr.some((item) => item.time === time && item.date === selectedDate);
                if (!exists) {
                    // Thêm vào bảng hiển thị
                    $('#tableCreateSchedule tbody').append(`
                        <tr data-time="${time}" data-date="${selectedDate}">
                            <td>${time}</td>
                            <td>${selectedDate}</td>
                        </tr>
                    `);

                    // Thêm vào mảng lưu trữ
                    scheduleArr.push({
                        time: time,
                        date: selectedDate,
                    });
                }
            }
            handleBtnSchedule(scheduleArr);
        });
    });
}

function cancelAllScheduleByAdmin(scheduleArr) {
    $('#cancelAllScheduleDoctor').on('click', function () {
        // Reset nút được chọn
        $('.btn-schedule.btn-info').each(function () {
            $(this).removeClass('btn-info').addClass('btn-light');
        });

        // Xóa bảng hiển thị
        $('#tableCreateSchedule tbody').empty();

        // Xóa tất cả phần tử trong mảng
        scheduleArr.length = 0; // Giữ tham chiếu gốc
        handleBtnSchedule(scheduleArr);
    });
}

function handleBtnSchedule(scheduleArr) {
    $('.btn-schedule')
        .unbind('click')
        .bind('click', function () {
            let idBtn = $(this).attr('id');
            let $btn = $(`#${idBtn}`);
            $btn.toggleClass('btn-light btn-info');

            let time = $btn.val();
            let date = $('#datepicker').val();

            if ($btn.hasClass('btn-info')) {
                // Nếu chưa tồn tại thì thêm
                const exists = scheduleArr.some((item) => item.time === time && item.date === date);
                if (!exists) {
                    scheduleArr.push({ date, time, id: `${idBtn}-${date}` });
                    $('#tableCreateSchedule tbody').append(`
                        <tr id="row-${idBtn}" data-time="${time}" data-date="${date}">
                            <td>${time}</td>
                            <td>${date}</td>
                        </tr>
                    `);
                }
            } else {
                // Gỡ khỏi mảng và bảng
                const indexToRemove = scheduleArr.findIndex((x) => x.time === time && x.date === date);
                if (indexToRemove > -1) scheduleArr.splice(indexToRemove, 1);
                $(`#row-${idBtn}`).remove();
            }

            scheduleArr.sort((a, b) => a.time.localeCompare(b.time));
        });
}

let isHandlingChange = false;

function handleChangeDatePicker() {
    $('#datepicker')
        .datepicker({
            // startDate: '+1d',
            // endDate: '+7d',
            format: 'dd/MM/yyyy',
            autoclose: true,
            todayHighlight: true,
        })
        .on('changeDate', function (event) {
            if (!isHandlingChange) {
                isHandlingChange = true;

                let selectedDate = event.date;
                $('#datepicker').val(formattedDate);
                // $('.btn-schedule').removeClass('btn-css').addClass('btn');
                // let tomorrow = new Date();
                // tomorrow.setDate(tomorrow.getDate() + 1);
                // tomorrow.setHours(0, 0, 0, 0);

                // let endDate = new Date();
                // endDate.setDate(tomorrow.getDate() + 6);
                // endDate.setHours(0, 0, 0, 0);

                // if (selectedDate > tomorrow && selectedDate <= endDate) {
                //     $('.btn-schedule').removeClass('btn-css').addClass('btn');
                // } else {
                //     $('#datepicker').datepicker('setDate', tomorrow);
                //     let formattedDate = formatDate(tomorrow);
                //     alertify.error('Chỉ được chọn 6 ngày kế tiếp từ ngày ' + formattedDate);
                // }

                isHandlingChange = false;
            }
        });
}

// Hàm để chuyển đổi ngày thành dạng ngày/tháng/năm
function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
    let year = date.getFullYear();
    return day + '/' + month + '/' + year;
}

function stringToDate(_date, _format, _delimiter) {
    let formatLowerCase = _format.toLowerCase();
    let formatItems = formatLowerCase.split(_delimiter);
    let dateItems = _date.split(_delimiter);
    let monthIndex = formatItems.indexOf('mm');
    let dayIndex = formatItems.indexOf('dd');
    let yearIndex = formatItems.indexOf('yyyy');
    let month = parseInt(dateItems[monthIndex]);
    month -= 1;
    return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
}

function loadNewPatientsForAdmin() {
    $.ajax({
        url: `${window.location.origin}/admin/get-patients-for-tabs`,
        method: 'POST',
        success: function (data) {
            let countNew = data.object.newPatients.length;
            let countPending = data.object.pendingPatients.length;
            let countConfirmed = data.object.confirmedPatients.length;
            let countCanceled = data.object.canceledPatients.length;

            $('#count-new').text(`${countNew}`);
            $('#count-need').text(`${countPending}`);
            $('#count-confirmed').text(`${countConfirmed}`);
            $('#count-canceled').text(`${countCanceled}`);

            let htmlNew,
                htmlPending,
                htmlConfirmed,
                htmlCanceled = '';
            // Đổ dữ liệu ở lịch hẹn mới
            data.object.newPatients.forEach((patient) => {
                htmlNew += `
                <tr>
                    <td> ${patient.name}   </td>
                    <td> ${patient.year}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td>${patient.dateBooking} (${patient.timeBooking})   </td>
                    <td> 
                        <button type="button"  data-patient-id="${patient.id}" class="ml-3 btn btn-primary cursor-pointer btn-new-patient-ok"> Chấp nhận</button>
                        <button  type="button" data-patient-id="${patient.id}" class="ml-3 btn btn-danger cursor-pointer btn-new-patient-cancel"> Hủy </button>
                    </td>
                </tr>
                `;
            });
            // đổ dữ liệu chỗ đã chấp nhận
            data.object.pendingPatients.forEach((patient) => {
                htmlPending += `
                <tr>
                    <td> ${patient.name}   </td>
                    <td> ${patient.year}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td>${patient.dateBooking} (${patient.timeBooking})   </td>
                    <td> 
                        <button  data-patient-id="${patient.id}"  class="ml-3 btn btn-success cursor-pointer btn-pending-patient">Xác nhận</button>
                        <button  type="button" data-patient-id="${patient.id}" class="ml-3 btn btn-danger cursor-pointer btn-new-patient-cancel"> Hủy </button>
                    </td>
                </tr>
                `;
            });
            // Đổ dữ liệu chỗ đã khám
            data.object.confirmedPatients.forEach((patient) => {
                htmlConfirmed += `
                <tr>
                    <td> ${patient.name}   </td>
                    <td> ${patient.year}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td>${patient.dateBooking} (${patient.timeBooking})   </td>
                    <td> 
                        <button  type="button" data-patient-id="${patient.id}"  class="ml-3 btn btn-info cursor-pointer btn-confirmed-patient"> Thông tin</button>
                    </td>
                </tr>
                `;
            });
            // Đổ dữ liệu chỗ đã hủy
            data.object.canceledPatients.forEach((patient) => {
                htmlCanceled += `
                <tr>
                    <td> ${patient.name}   </td>
                    <td> ${patient.year}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td>${patient.dateBooking} (${patient.timeBooking})   </td>
                    <td> 
                        <button data-patient-id="${patient.id}"  class="ml-3 btn btn-primary cursor-pointer btn-history-cancel-patient">Lịch sử</button>
                    </td>
                </tr>
                `;
            });

            $('#tableNewPatients tbody').append(htmlNew);
            $('#tableNeedConfirmPatients tbody').append(htmlPending);
            $('#tableConfirmedPatients tbody').append(htmlConfirmed);
            $('#tableCancelPatients tbody').append(htmlCanceled);
        },
        error: function (error) {
            console.log(error);
            alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
        },
    });
}

function loadPatientsByDate() {
    $('#btn_SearchBooking').on('click', function (e) {
        let dateSearch = $('#dateDoctorAppointment').val();
        $.ajax({
            url: `${window.location.origin}/admin/manage/booking-date`,
            method: 'POST',
            data: { dateSearch: dateSearch },
            success: function (data) {
                let countNew = data.object.newPatients.length;
                let countPending = data.object.pendingPatients.length;
                let countConfirmed = data.object.confirmedPatients.length;
                let countCanceled = data.object.canceledPatients.length;

                $('#count-new').text(`${countNew}`);
                $('#count-need').text(`${countPending}`);
                $('#count-confirmed').text(`${countConfirmed}`);
                $('#count-canceled').text(`${countCanceled}`);
                // Clear the table bodies before appending new data
                $('#tableNewPatients tbody').empty();
                $('#tableNeedConfirmPatients tbody').empty();
                $('#tableConfirmedPatients tbody').empty();
                $('#tableCancelPatients tbody').empty();
                let htmlNew,
                    htmlPending,
                    htmlConfirmed,
                    htmlCanceled = '';
                // Đổ dữ liệu ở lịch hẹn mới
                data.object.newPatients.forEach((patient) => {
                    htmlNew += `
                    <tr>
                        <td> ${patient.name}   </td>
                        <td> ${patient.year}   </td>
                        <td> ${patient.phone}     </td>
                        <td> ${patient.email}     </td>
                        <td>${patient.dateBooking} (${patient.timeBooking})   </td>
                        <td> 
                            <button type="button"  data-patient-id="${patient.id}" class="ml-3 btn btn-primary cursor-pointer btn-new-patient-ok"> Chấp nhận</button>
                            <button  type="button" data-patient-id="${patient.id}" class="ml-3 btn btn-danger cursor-pointer btn-new-patient-cancel"> Hủy </button>
                        </td>
                    </tr>
                    `;
                });
                // đổ dữ liệu chỗ đã chấp nhận
                data.object.pendingPatients.forEach((patient) => {
                    htmlPending += `
                    <tr>
                        <td> ${patient.name}   </td>
                        <td> ${patient.year}   </td>
                        <td> ${patient.phone}     </td>
                        <td> ${patient.email}     </td>
                        <td>${patient.dateBooking} (${patient.timeBooking})   </td>
                        <td> 
                            <button  data-patient-id="${patient.id}"  class="ml-3 btn btn-success cursor-pointer btn-pending-patient">Xác nhận</button>
                            <button  type="button" data-patient-id="${patient.id}" class="ml-3 btn btn-danger cursor-pointer btn-new-patient-cancel"> Hủy </button>
                        </td>
                    </tr>
                    `;
                });
                // Đổ dữ liệu chỗ đã khám
                data.object.confirmedPatients.forEach((patient) => {
                    htmlConfirmed += `
                    <tr>
                        <td> ${patient.name}   </td>
                        <td> ${patient.year}   </td>
                        <td> ${patient.phone}     </td>
                        <td> ${patient.email}     </td>
                        <td>${patient.dateBooking} (${patient.timeBooking})   </td>
                        <td> 
                            <button  type="button" data-patient-id="${patient.id}"  class="ml-3 btn btn-info cursor-pointer btn-confirmed-patient"> Thông tin</button>
                        </td>
                    </tr>
                    `;
                });
                // Đổ dữ liệu chỗ đã hủy
                data.object.canceledPatients.forEach((patient) => {
                    htmlCanceled += `
                    <tr>
                        <td> ${patient.name}   </td>
                        <td> ${patient.year}   </td>
                        <td> ${patient.phone}     </td>
                        <td> ${patient.email}     </td>
                        <td>${patient.dateBooking} (${patient.timeBooking})   </td>
                        <td> 
                            <button   data-patient-id="${patient.id}"  class="ml-3 btn btn-primary cursor-pointer btn-history-cancel-patient">Lịch sử</button>
                        </td>
                    </tr>
                    `;
                });

                $('#tableNewPatients tbody').append(htmlNew);
                $('#tableNeedConfirmPatients tbody').append(htmlPending);
                $('#tableConfirmedPatients tbody').append(htmlConfirmed);
                $('#tableCancelPatients tbody').append(htmlCanceled);
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
}

function handleBtnNewPatientOk() {
    $('#tableNewPatients').on('click', '.btn-new-patient-ok', function (e) {
        let patientId = $(e.target).data('patient-id');
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/get-detail-patient-by-id`,
            data: { patientId: patientId },
            success: function (data) {
                $('#newPatientName').val(data.patient.name);
                $('#newPatientYear').val(data.patient.year);
                $('#newPatientPhone').val(data.patient.phone);
                $('#newPatientEmail').val(data.patient.email);
                $('#newPatientDate').val(data.patient.dateBooking);
                $('#newPatientTime').val(data.patient.timeBooking);
                $('#newPatientReason').val(data.patient.description);
                $('#newPatientAddress').val(data.patient.address);
                $('#btn-new-patient-ok').attr('data-patient-id', patientId);
                $('#btn-new-patient-cancel').attr('data-patient-id', patientId);
                // Hiển thị modal chi tiết bệnh nhân mới
                $('#modalDetailNewPatient').modal('show');
                // Bạn có thể truyền patientId vào modal nếu cần
                $('#modalDetailNewPatient').attr('data-patient-id', patientId);
            },
            error: function (err) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
    // Nếu là nút có id btn-new-patient-ok
    // Chỉ thực hiện khi click đúng vào #btn-new-patient-ok
    $('#modalDetailNewPatient').on('click', '#btn-new-patient-ok', function (e) {
        let patientId = $(e.target).data('patient-id');
        let countNew = +$('#count-new').text();
        let countPending = +$('#count-need').text();
        // Không xóa tr trong bảng, chỉ xử lý khi cần
        countNew--;
        countPending++;
        $('#count-new').text(countNew);
        $('#count-need').text(countPending);

        $.ajax({
            url: `${window.location.origin}/admin/change-status-patient`,
            method: 'POST',
            data: { patientId: patientId, status: 'pending' },
            success: function (data) {
                let patient = data.patient;
                addNewRowTablePending(patient);
                alertify.success('Đã xác nhận lịch hẹn thành công');
                setTimeout(function () {
                    window.location.href = '/doctor/get-new-patients';
                }, 2000);
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
}

function handleBtnNewPatientCancel() {
    // Handle click on .btn-new-patient-cancel (in table row)
    $('#tableNewPatients').on('click', '.btn-new-patient-cancel', function (e) {
        $('#btnCancelBookingPatient').attr('data-patient-id', $(this).data('patient-id'));
        $('#modalCancelBooking').modal('show');
    });

    $('#tableNeedConfirmPatients').on('click', '.btn-new-patient-cancel', function (e) {
        $('#btnCancelBookingPatient').attr('data-patient-id', $(this).data('patient-id'));
        $('#modalCancelBooking').modal('show');
    });
    // Handle click on #btn-new-patient-cancel (in modal)
    $('#modalDetailNewPatient').on('click', '#btn-new-patient-cancel', function (e) {
        $('#btnCancelBookingPatient').attr('data-patient-id', $(this).data('patient-id'));
        $('#modalCancelBooking').modal('show');
        $('#modalDetailNewPatient').modal('hide');
    });
}

function callAjaxRenderModalInfo(patientId, option) {
    $.ajax({
        method: 'POST',
        url: `${window.location.origin}/api/get-detail-patient-by-id`,
        data: { patientId: patientId },
        success: function (data) {
            $('#btn-confirm-patient-done').attr('data-patient-id', data.patient.id);
            $('#patientName').val(data.patient.name);
            $('#patientYear').val(data.patient.year);
            $('#patientPhone').val(data.patient.phone);
            $('#patientEmail').val(data.patient.email);
            $('#patientDate').val(data.patient.dateBooking);
            $('#patientTime').val(data.patient.timeBooking);
            $('#patientReason').val(data.patient.description);
            $('#patientAddress').val(data.patient.address);
            if (data.ExtraInfo) {
                $('#patientHistoryBreath').val(data.ExtraInfo.historyBreath);
                $('#patientMoreInfo').val(data.ExtraInfo.moreInfo);
            }
            if (option) {
                $('#btn-confirm-patient-done').css('display', 'none');
                $('#btn-cancel-patient').text('OK');
            } else {
                $('#btn-confirm-patient-done').css('display', 'block');
                $('#btn-cancel-patient').text('Hủy');
            }
            console.log('option: ', option);
            $('#modalDetailPatient').modal('show');
        },
        error: function (err) {
            console.log(error);
            alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
        },
    });
}

function handleBtnPendingPatient() {
    $('#tableNeedConfirmPatients').on('click', '.btn-pending-patient', function (e) {
        let patientId = $(this).data('patient-id');
        let option = false;
        callAjaxRenderModalInfo(patientId, option);
    });
}

function handleBtnPendingCancel() {
    $('#tableNeedConfirmPatients').on('click', '.btn-pending-patient-cancel', function (e) {
        $('#btnCancelBookingPatient').attr('data-patient-id', $(this).data('patient-id'));
        $('#modalCancelBooking').modal('show');
    });
}

function addNewRowTablePending(patient) {
    let htmlPending = `
                 <tr>
                    <td> ${patient.id} - ${patient.name}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td> ${patient.dateBooking} (${patient.timeBooking})     </td>
                    <td> 
                        <button  data-patient-id="${patient.id}"  class="ml-3 btn btn-success cursor-pointer btn-pending-patient">Xác nhận</button>
                        <button  type="button" data-patient-id="${patient.id}" class="ml-3 btn btn-danger cursor-pointer btn-new-patient-cancel"> Hủy </button>
                    </td>
                </tr>
               
                `;
    $('#tableNeedConfirmPatients tbody').prepend(htmlPending);
}

function addNewRowTableConfirmed(patient) {
    let htmlConfirmed = `
                <tr>
                    <td> ${patient.id} - ${patient.name}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td> ${patient.dateBooking} (${patient.timeBooking})     </td>
                    <td> 
                        <button  type="button" data-patient-id="${patient.id}"  class="ml-3 btn btn-info cursor-pointer btn-confirmed-patient"> Thông tin</button>
                    </td>
                </tr>
                `;
    $('#tableConfirmedPatients tbody').prepend(htmlConfirmed);
}

function addNewRowTableCanceled(patient) {
    let htmlPending = `
                  <tr>
                    <td> ${patient.id} - ${patient.name}   </td>
                    <td> ${patient.phone}     </td>
                    <td> ${patient.email}     </td>
                    <td> ${patient.dateBooking} (${patient.timeBooking}) </td>
                    <td> 
                        <button   data-patient-id="${patient.id}"  class="ml-3 btn btn-primary cursor-pointer btn-history-cancel-patient">Lịch sử</button>
                    </td>
                </tr>
               
                `;
    $('#tableCancelPatients tbody').prepend(htmlPending);
}

function convertStringToDateClient(string) {
    return moment(Date.parse(string)).format('DD/MM/YYYY, HH:mm A');
}

function handleAfterCallingPatient() {
    $('#btn-confirm-patient-done').on('click', function (e) {
        let countPending = +$('#count-need').text();
        let countConfirmed = +$('#count-confirmed').text();
        countPending--;
        countConfirmed++;
        $('#modalDetailPatient').modal('hide');
        let patientId = $('#btn-confirm-patient-done').attr('data-patient-id');
        // Lấy dữ liệu từ textarea
        let patientHistoryBreath = $('#patientHistoryBreath').val();
        let patientMoreInfo = $('#patientMoreInfo').val();
        $('#tableNeedConfirmPatients tbody')
            .find(`.btn-pending-patient[data-patient-id=${patientId}]`)
            .closest('tr')
            .remove();
        $('#count-need').text(countPending);
        $('#count-confirmed').text(countConfirmed);
        $.ajax({
            url: `${window.location.origin}/admin/change-status-patient`,
            method: 'POST',
            data: {
                patientId: patientId,
                status: 'confirmed',
                historyBreath: patientHistoryBreath,
                moreInfo: patientMoreInfo,
            },
            success: function (data) {
                let patient = data.patient;
                addNewRowTableConfirmed(patient);
                alertify.success('Xác nhận thành công!');
                setTimeout(function () {
                    window.location.href = '/doctor/get-new-patients'; // Thay thế '/your-new-url' bằng đường dẫn mới bạn muốn tải lại
                }, 2000);
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
}

function handleViewInfoPatientBooked() {
    $('#tableConfirmedPatients').on('click', '.btn-confirmed-patient', function (e) {
        let patientId = $(this).data('patient-id');
        let option = true;
        callAjaxRenderModalInfo(patientId, option);
    });
}

function handleCancelBtn() {
    $('#btnCancelBookingPatient').on('click', function (e) {
        let formData = new FormData($('form#formCancelBooking')[0]);
        let data = {};
        let text = '';
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1];
        }

        if (data.reasonCancel === 'reason3') {
            if (!$('#otherReason').val()) {
                alert('Vui lòng điền thêm thông tin vì lý do khác');
                return;
            }
            text = `Lý do khác: ${$('#otherReason').val()} `;
        } else if (data.reasonCancel === 'reason2') {
            text = 'Bệnh nhân hủy lịch hẹn';
        } else {
            text = 'Lịch hẹn không đúng';
        }

        let patientId = $('#btnCancelBookingPatient').attr('data-patient-id');

        let type = $('#btnCancelBookingPatient').attr('data-type');

        if (type === 'pending-patient-cancel') {
            let countPending = +$('#count-need').text();
            let countCancel = +$('#count-canceled').text();
            countPending--;
            countCancel++;
            $('#tableNeedConfirmPatients tbody')
                .find(`.btn-pending-patient-cancel[data-patient-id=${patientId}]`)
                .closest('tr')
                .remove();
            $('#count-need').text(countPending);
            $('#count-canceled').text(countCancel);
        } else {
            let countNew = +$('#count-new').text();
            let countCancel = +$('#count-canceled').text();
            countNew--;
            countCancel++;
            $('#tableNewPatients tbody')
                .find(`.btn-new-patient-cancel[data-patient-id=${patientId}]`)
                .closest('tr')
                .remove();
            $('#count-new').text(countNew);
            $('#count-canceled').text(countCancel);
        }

        $('#modalCancelBooking').modal('hide');

        $.ajax({
            url: `${window.location.origin}/admin/change-status-patient`,
            method: 'POST',
            data: { patientId: patientId, status: 'failed', reason: text },
            success: function (data) {
                let patient = data.patient;
                addNewRowTableCanceled(patient);
                alertify.success('Đã hủy lịch hẹn thành công');
                setTimeout(function () {
                    window.location.href = '/doctor/get-new-patients'; // Thay thế '/your-new-url' bằng đường dẫn mới bạn muốn tải lại
                }, 2000);
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
}

function handleBtnViewHistory() {
    $('#tableCancelPatients').on('click', '.btn-history-cancel-patient', function () {
        let patientId = $(this).data('patient-id');
        $('#btn-view-history').attr('data-patient-id', patientId);
        $.ajax({
            url: `${window.location.origin}/admin/get-logs-patient`,
            method: 'POST',
            data: { patientId: patientId },
            success: function (data) {
                $('#contentHistory').empty();

                let html = '';
                data.forEach((log) => {
                    html += `
                     <div class="form-row mb-3">
                            <div class="col-6">
                                <input type="text"  class="form-control" id="historyStatus" value="${log.content}">
                            </div>
                            <div class="col-3">
                                <input type="text"  class="form-control" id="personDone" value="${log.adminName}">
                            </div>
                            <div class="col-3">
                                <input type="text"  class="form-control" id="timeDone" value="${convertStringToDateClient(
                                    log.createdAt
                                )} ">
                            </div>
                        </div>
                    
                    `;
                });
                $('#contentHistory').append(html);
                $('#modalHistoryBooking').modal('show');
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
}

function handleDoctorViewInfoPatient() {
    $('.doctor-view-detail').on('click', function (e) {
        let patientId = $(this).attr('data-patient-id');
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/api/get-detail-patient-by-id`,
            data: { patientId: patientId },
            success: function (data) {
                $('#imageOldForms').empty();
                $('#patientName').val(data.name);
                $('#patientYear').val(data.year);
                $('#patientPhone').val(data.phone);
                $('#patientEmail').val(data.email);
                $('#patientDate').val(data.dateBooking);
                $('#patientTime').val(data.timeBooking);
                $('#patientReason').text(data.description);
                $('#patientAddress').text(data.address);
                if (data.ExtraInfo) {
                    $('#patientHistoryBreath').text(data.ExtraInfo.historyBreath);
                    $('#patientMoreInfo').text(data.ExtraInfo.moreInfo);
                    if (data.ExtraInfo.oldForms) {
                        let images = JSON.parse(data.ExtraInfo.oldForms);
                        let html = '';
                        for (let [key, value] of Object.entries(images)) {
                            html += `
                              <a href="/images/patients/${value}" class="mr-3" target="_blank" title="Nhấn vào đây để hiển thị hình ảnh">
                                <span>${value}</span>
                              </a>
                            `;
                        }

                        $('#imageOldForms').append(html);
                    } else {
                        $('#imageOldForms').append(`<span>Không có thông tin</span>`);
                    }
                }

                $('#modalDetailPatientForDoctor').modal('show');
            },
            error: function (err) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
}

function showModalSendForms() {
    $('.doctor-send-forms').on('click', function (e) {
        let patientId = $(this).attr('data-patient-id');
        let isSend = $(this).attr('data-is-send-forms');

        $.ajax({
            url: `${window.location.origin}/api/get-detail-patient-by-id`,
            method: 'POST',
            data: { patientId: patientId },
            success: function (data) {
                let html = '';
                $('#divGenerateFilesSend').empty();
                $('#emailPatient').val(data.email);
                $('#btnSendFilesForms').attr('data-patient-id', patientId);
                if (data.ExtraInfo) {
                    if (data.ExtraInfo.sendForms) {
                        let images = JSON.parse(data.ExtraInfo.sendForms);
                        for (let [key, value] of Object.entries(images)) {
                            html += `
                              <div class="form-row">
                                <div class="form-group col-9">
                                    <a type="text" class="form-control" id="nameFileSent" target="_blank" href="/images/patients/remedy/${value}" readonly="true" title="${value}" >
                               ${value}
                                </a>
                                </div>
                             </div>`;
                        }
                    } else {
                        html = `
                          <div class="form-row">
                            <div class="form-group col-9">
                                <label class="col-form-label text-label" for="nameFileSent"> File's name:</label>
                                <input type="text" class="form-control" id="nameFileSent" name="nameFileSent" disabled>
                            </div>
                         </div>`;
                    }
                }
                $('#divGenerateFilesSend').append(html);
                $('#modalSendForms').modal('show');
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
}

function handleSendFormsForPatient() {
    $('#btnSendFilesForms').on('click', function (e) {
        if (!$('#filesSend').val()) {
            alert('Please select files before sending!');
            return;
        }
        $(this).prop('disabled', true);
        $('#processLoadingAdmin').removeClass('d-none');
        let formData = new FormData($('form#formSendFormsForPatient')[0]);
        formData.append('patientId', $(this).attr('data-patient-id'));

        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/doctor/send-forms-to-patient`,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                $('#modalSendForms').modal('hide');
                $('#processLoadingAdmin').addClass('d-none');
                $('#btnSendFilesForms').prop('disabled', false);
                $(`.fa-exclamation-circle[data-patient-id=${data.patient.id}]`).css('color', '#36b9cc');
                $(`.fa-exclamation-circle[data-patient-id=${data.patient.id}]`)
                    .removeClass('fa-exclamation-circle')
                    .addClass('fa-check-circle');
                alertify.success('Sending remedies succeeds');
            },
            error: function (error) {
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                console.log(error);
            },
        });
    });
}

function resetModal() {
    $(`#modalDetailPatient`).on('hidden.bs.modal', function (e) {
        $(this)
            .find('input,textarea,select')
            .val('')
            .end()
            .find('input[type=checkbox], input[type=radio]')
            .prop('checked', '')
            .end();
    });

    $(`#modalHistoryBooking`).on('hidden.bs.modal', function (e) {
        $(this)
            .find('input,textarea,select')
            .val('')
            .end()
            .find('input[type=checkbox], input[type=radio]')
            .prop('checked', '')
            .end();
    });

    $(`#modalDetailPatientForDoctor`).on('hidden.bs.modal', function (e) {
        $(this)
            .find('input,textarea,select')
            .val('')
            .end()
            .find('input[type=checkbox], input[type=radio]')
            .prop('checked', '')
            .end();
    });

    $(`#modalSendForms`).on('hidden.bs.modal', function (e) {
        $(this)
            .find('input,textarea,select')
            .val('')
            .end()
            .find('input[type=checkbox], input[type=radio]')
            .prop('checked', '')
            .end();
    });
    $(`#modalCancelBooking`).on('hidden.bs.modal', function (e) {
        $(this)
            .find('input,textarea,select')
            .val('')
            .end()
            .find('input[type=checkbox], input[type=radio]')
            .prop('checked', '')
            .end();
        $('#inputDefaultReason').prop('checked', true);
    });
}

function doneComment() {
    $('.done-comment').on('click', function (e) {
        if (confirm('Confirm save customer feedback?')) {
            let commentId = $(this).attr('data-comment-id');
            node = this;
            $.ajax({
                method: 'POST',
                url: `${window.location.origin}/admin/done-comment`,
                data: { commentId: commentId },
                success: function (data) {
                    node.closest('tr').remove();

                    alertify.success('Đã lưu thành công phần bình luận');
                },
                error: function (error) {
                    alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
                    console.log(error);
                },
            });
        }
    });
}

function statisticalAdmin(month) {
    $.ajax({
        method: 'POST',
        url: `${window.location.origin}/admin/statistical`,
        data: { month: month },
        success: function (data) {
            $('#sumPatient').text(data.patients.count);
            $('#sumDoctor').text(data.doctors.count);
            $('#sumPost').text(data.posts.count);

            if (data.bestDoctor === '') {
                $('#bestDoctor').text(`Không có thông tin`);
            } else {
                $('#bestDoctor').text(`${data.bestDoctor.name} (${data.bestDoctor.count})`);
            }
            // if (data.bestAdmin === '') {
            //     $('#bestAdmin').text(`Không có thông tin`);
            // } else {
            //     $('#bestAdmin').text(`${data.bestAdmin.name} (${data.bestAdmin.count})`);
            // }
        },
        error: function (error) {
            alertify.error('Đã xảy ra lỗi khi lấy thông tin thống kê, vui lòng thử lại sau');
            console.log(error);
        },
    });
}

function handleFindStatisticalAdmin() {
    $('#findStatisticalAdmin').on('click', function () {
        statisticalAdmin($('#monthAnalyse').val());
    });
}

function searchCustomerByPhone() {
    $('#btnSearch').on('click', function () {
        event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
        let phone = document.getElementById('phone').value;
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/users/manage/customer`,
            data: { phone },
            success: function (data) {
                console.log('data.customers in js : ', data.customers);
                updateCustomerTable(data.customers); // Assuming 'customers' is the key in the response
            },
            error: function (error) {
                alertify.error('Đã xảy ra lỗi khi lấy thông tin thống kê, vui lòng thử lại sau');
                console.log(error);
            },
        });
    });
}

function updateCustomerTable(customers) {
    const tbody = $('#dataTable tbody');
    tbody.empty(); // Clear existing table rows

    customers.forEach(function (customer) {
        const row = `<tr>
                        <td>${customer.name}</td>
                        <td>${customer.phone}</td>
                        <td>${customer.isActive ? 'Hoạt động' : 'Không hoạt động'}</td>
                        <td class="">
                        <a class="show-customer-info" data-customer-id="${customer.id}" href="#"
                        title="View info"><i class="fas fa-info-circle"></i></a>
                            <a class="edit-customer-info" href="/users/customer/edit/${
                                customer.id
                            }" title="Edit"><i class="fas fa-pen-square mx-3"></i></a>
                            <a class="delete-customer-info" data-customer-id="${
                                customer.id
                            }" href="#" title="Delete"><i class="fas fa-trash"></i></a>
                        </td>
                    </tr>`;
        tbody.append(row);
    });
}

function searchDoctorBy() {
    $('#btnSearchDoctor').on('click', function (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
        let thongtin;
        let selectedValue = $('#specializationDoctor').val();
        if (selectedValue === 'specializationId') {
            thongtin = $('#thongtinSelect').val(); // Nếu tìm kiếm theo chuyên khoa, lấy giá trị từ select
        } else {
            thongtin = $('#thongtin').val(); // Nếu không, lấy giá trị từ input
        }
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/users/manage/doctor`,
            data: { thongtin: thongtin, selectedValue: selectedValue },
            success: function (data) {
                updateDoctorTable(data); // Giả sử 'customers' là key trong response
            },
            error: function (error) {
                alertify.error('Đã xảy ra lỗi khi lấy thông tin thống kê, vui lòng thử lại sau');
                console.log(error);
            },
        });
    });
}

function updateDoctorTable(doctors) {
    const tbody = $('#dataTable tbody');
    tbody.empty(); // Xóa nội dung cũ

    doctors.forEach(function (doctor) {
        const row = `
            <tr>
                <td>${doctor.id}</td>
                <td>${doctor.name}</td>
                <td>${doctor.phone}</td>
                <td>${doctor.specializationName}</td>
                <td>${doctor.isActive ? 'Hoạt động' : 'Không hoạt động'}</td>
                <td class="">
                    <a class="show-doctor-info" href="#" data-doctor-id="${doctor.id}" title="Xem thông tin">
                        <i class="fas fa-info-circle"></i>
                    </a>
                    <a class="edit-doctor-info mx-3" href="/users/doctor/edit/${doctor.id}" title="Chỉnh sửa">
                        <i class="fas fa-pen-square"></i>
                    </a>
                    <a class="delete-doctor-info pr-3" href="#" data-doctor-id="${doctor.id}" title="Xoá">
                        <i class="fas fa-trash"></i>
                    </a>
                    <a class="calendar-doctor-info" href="/users/manage/schedule-doctor/create/${
                        doctor.id
                    }" title="Lịch khám">
                        <i class="fas fa-calendar-alt"></i>
                    </a>
                </td>
            </tr>`;
        tbody.append(row);
    });
}
function handleShowBookingTimeOff() {
    $('#showBookingTimeOff').on('click', function (e) {
        let $reasonSelect = $('#timeoffReasonSelect');
        let $otherReasonContainer = $('#otherReasonContainer');
        let $otherReasonInput = $('#timeoffReasonOther');
        $.ajax({
            method: 'GET',
            url: `${window.location.origin}/new-get-time-off`,
            data: { doctorId: $('#doctorId').val() },
            success: function (data) {
                $('#startDate').val(data.startDate);
                $('#endDate').val(data.endDate);
                let currentReasonList = data.reasonList;

                // Populate the reasonSelect dropdown
                $reasonSelect.empty();
                currentReasonList.forEach(function (reason) {
                    $reasonSelect.append(new Option(reason.text, reason.text));
                });

                $reasonSelect.on('change', function () {
                    if ($(this).val() === 'Khác') {
                        $otherReasonContainer.css('display', 'block');
                    } else {
                        $otherReasonContainer.css('display', 'none');
                    }
                });

                $('#modalBookingTimeOff').modal('show');
            },
            error: function (err) {
                console.log(err);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
}

function postBookingTimeOff() {
    $('#btn-booking-time-off').on('click', function (e) {
        e.preventDefault();
        let dataRequest = {
            doctorId: $('#doctorId').val(),
            startDate: $('#startDate').val(),
            endDate: $('#endDate').val(),
            reason: $('#timeoffReasonSelect').val(),
        };
        if (dataRequest.reason === 'Khác') {
            dataRequest.reason = $('#timeoffReasonOther').val();
        }
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/new-post-time-off`,
            data: dataRequest,
            success: function (data) {
                alertify.success('Đã gửi yêu cầu nghỉ phép thành công!');
                $('#modalBookingTimeOff').modal('hide');
                setTimeout(function () {
                    window.location.href = '/doctor/manage/schedule/timeoff';
                }, 2000);
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
}

function showCalendarDoctor() {
    $('#viewCalendar').on('click', function () {
        const month = parseInt($('#monthSelect').val());
        const year = parseInt($('#yearSelect').val());
        const calendarBody = $('#calendarBody');
        const currentMonth = $('#currentMonth');
        const currentYear = $('#currentYear');

        currentMonth.text(new Date(year, month).toLocaleString('vi', { month: 'long' }));
        currentYear.text(year);
        $('#currentMonthYear').text(`${('0' + (month + 1)).slice(-2)}/${year}`);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        let day = 1;

        calendarBody.empty();
        for (let i = 0; i < 6; i++) {
            const row = $('<tr></tr>');
            for (let j = 0; j < 7; j++) {
                const cell = $('<td></td>');
                if (i === 0 && j < firstDay) {
                    row.append(cell);
                } else if (day > daysInMonth) {
                    row.append(cell);
                } else {
                    cell.text(day).addClass('font-weight-bold');
                    if (
                        day === new Date().getDate() &&
                        month === new Date().getMonth() &&
                        year === new Date().getFullYear()
                    ) {
                        cell.addClass('bg-primary text-white');
                    }
                    day++;
                    row.append(cell);
                }
            }
            calendarBody.append(row);
        }

        // Load time-off data and update calendar
        $.ajax({
            method: 'GET',
            url: `${window.location.origin}/doctor/manage/schedule/timeoff`,
            data: { month: month + 1, year: year },
            success: function (data) {
                data.timeOffDays.forEach((timeOffDay) => {
                    const date = new Date(timeOffDay.date);
                    if (date.getMonth() === month && date.getFullYear() === year) {
                        const dayCell = calendarBody.find('td').filter(function () {
                            return $(this).text() == date.getDate();
                        });
                        if (timeOffDay.statusId === 3) {
                            dayCell
                                .addClass('bg-warning text-white')
                                .attr('title', timeOffDay.reason || 'No reason provided');
                        } else if (timeOffDay.statusId === 1) {
                            dayCell
                                .addClass('bg-secondary text-white')
                                .attr('title', timeOffDay.reason || 'No reason provided');
                        }
                    }
                });
                // Lặp qua các ngày trong tháng và cập nhật icon từ listSchedule
                for (const schedule of data.listSchedule) {
                    const date = new Date(schedule.date);
                    if (date.getMonth() === month && date.getFullYear() === year) {
                        const dayCell = calendarBody.find('td').filter(function () {
                            return $(this).text() == date.getDate();
                        });

                        let iconHtml = '';

                        // Thêm icon vào ngày dựa trên loại lịch (on-call hoặc regular)
                        if (schedule.type === 'on-call') {
                            iconHtml = '<i class="fas fa-moon pl-2"></i>';
                            dayCell.addClass('bg-info text-white');
                        } else if (schedule.type === 'regular') {
                            iconHtml = '<i class="fas fa-calendar-alt pl-2"></i>';
                            dayCell.addClass('bg-success text-white');
                        }

                        // Thêm icon vào ô ngày
                        dayCell.find('.schedule-icon').remove(); // Xóa các icon cũ nếu có
                        if (iconHtml) {
                            dayCell.append('<span class="schedule-icon">' + iconHtml + '</span>');
                        }
                    }
                }
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
}

function createScheduleAll() {
    $('#createScheduleAll').on('click', function (e) {
        e.preventDefault();
        const selectedMonth = parseInt($('#monthPicker').val()); // lấy giá trị đã chọn từ select
        const selectedYear = parseInt($('#yearPicker').val());

        const dataRequest = {
            year: selectedYear,
            month: selectedMonth,
        };

        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/create-schedule-all`,
            data: dataRequest,
            success: function (data) {
                alertify.success(data.message);
                setTimeout(function () {
                    window.location.href = '/users/manage/schedule-doctor/create-all';
                }, 2000);
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
}

function RefuseTimeOff() {
    $(document).on('click', '#btnRefuseTimeOff', function (e) {
        e.preventDefault();
        let timeOffId = $(this).data('time-off-id');
        dataRequest = {
            timeOffId: timeOffId,
            statusId: 2,
        };
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/users/manage/reschedule/time-off/update/${timeOffId}`,
            data: dataRequest,
            success: function (data) {
                alertify.success('Đã từ chối yêu cầu nghỉ phép thành công!');
                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
    $(document).on('click', '#btnAcceptTimeOff', function (e) {
        e.preventDefault();
        let timeOffId = $(this).data('time-off-id');
        dataRequest = {
            timeOffId: timeOffId,
            statusId: 1,
        };
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/users/manage/reschedule/time-off/update/${timeOffId}`,
            data: dataRequest,
            success: function (data) {
                alertify.success('Đã chấp nhận yêu cầu nghỉ phép thành công!');
                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
}

function SwapScheduleAccept() {
    $(document).on('click', '#btnSwapScheduleAccept', function (e) {
        e.preventDefault();
        let scheduleSwapId = $(this).data('schedule-swap-id');
        let doctorId = $(this).data('doctor-id');
        let doctorSwapId = $(this).data('doctor-swap-id');
        let dateASwap = $(this).data('date-a-swap');
        let dateBSwap = $(this).data('date-b-swap');
        let type = $(this).data('type');
        console.log('Hàm này được gọi');
        let dataRequest = {
            scheduleSwapId: scheduleSwapId,
            doctorId: doctorId,
            doctorSwapId: doctorSwapId,
            dateASwap: dateASwap,
            dateBSwap: dateBSwap,
            type: type,
            statusId: 1,
        };
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/users/manage/reschedule/time-off/option/swap-schedule`,
            data: dataRequest,
            success: function (data) {
                alertify.success(data.message);
                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
    $(document).on('click', '#btnSaveOptionSwapSchedule', function (e) {
        e.preventDefault();
        let doctorId = $(this).data('doctor-id');
        let doctorSwapId = $(this).data('doctor-swap-id');
        let dateASwap = $(this).data('date-a-swap');
        let dateBSwap = $(this).data('date-b-swap');
        let type = $(this).data('type');
        let statusId = $(this).data('status-id');
        let dataRequest = {
            doctorId: doctorId,
            doctorSwapId: doctorSwapId,
            dateASwap: dateASwap,
            dateBSwap: dateBSwap,
            type: type,
            statusId: statusId,
        };
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/users/manage/reschedule/time-off/option/save-swap-schedule`,
            data: dataRequest,
            success: function (data) {
                alertify.success('Đã gửi lịch đến bác sĩ kia thành công!');
                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
    $(document).on('click', '#btnSwapScheduleCancel', function (e) {
        e.preventDefault();
        let scheduleSwapId = $(this).data('schedule-swap-id');
        let dataRequest = {
            scheduleSwapId: scheduleSwapId,
            statusId: 2,
        };
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/users/manage/reschedule/time-off/option/cancel-swap-schedule`,
            data: dataRequest,
            success: function (data) {
                alertify.success(data.message);
                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
}

// hàm show speciality item
$(document).ready(function () {
    // Event delegation to handle click events for dynamically added elements
    $(document).on('click', '.info-specialization', function (e) {
        e.preventDefault();
        let id = $(this).data('specialization-id');
        $.ajax({
            method: 'POST',
            url: `${window.location.origin}/get-info-speciality-by-id`,
            data: { id: id },
            success: function (data) {
                $('#imageSpeciality').empty();

                $('#nameSpeciality').val(data.specialization.name);
                if (data.specialization.description) {
                    $('#descriptionSpeciality').val(data.specialization.description);
                } else {
                    $('#descriptionSpeciality').val('Chưa cập nhật');
                }
                if (data.specialization.image) {
                    $('#imageSpeciality').prepend(
                        `<img class="img-info-clinic" src="${data?.specialization?.image}" />`
                    );
                } else {
                    $('#imageSpeciality').text('Chưa cập nhật');
                }
                $('#modalInfoSpeciality').modal('show');
            },
            error: function (error) {
                console.log(error);
                alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            },
        });
    });
});

$(document).ready(function (e) {
    // $('.modal').on('hidden.bs.modal', function(e) {
    //     $(this).removeData();
    // });

    let markdownIntroClinic = new SimpleMDE({
        element: document.getElementById('intro-clinic'),
        placeholder: 'Nội dung giới thiệu...',
        spellChecker: false,
    });

    let markdownPost = new SimpleMDE({
        element: document.getElementById('contentMarkdown'),
        placeholder: 'Nội dung bài đăng...',
        spellChecker: false,
    });
    let converter = new showdown.Converter();
    // //create datepicker, doctor create schedule
    $('#datepicker').datepicker({
        format: 'dd/mm/yyyy',
        weekStart: 1,
        daysOfWeekHighlighted: '6,0',
        autoclose: true,
        todayHighlight: true,
    });
    $('#datepicker').datepicker('setDate', new Date());

    //create datepicker, doctor-appointment
    $('#dateDoctorAppointment').datepicker({
        format: 'dd/mm/yyyy',
        weekStart: 1,
        daysOfWeekHighlighted: '6,0',
        autoclose: true,
        todayHighlight: true,
    });
    $('#startDate').datepicker({
        format: 'dd/mm/yyyy',
        weekStart: 1,
        daysOfWeekHighlighted: '6,0',
        autoclose: true,
        todayHighlight: true,
    });
    $('#endDate').datepicker({
        format: 'dd/mm/yyyy',
        weekStart: 1,
        daysOfWeekHighlighted: '6,0',
        autoclose: true,
        todayHighlight: true,
    });

    loadFile(e);
    loadImageUserSetting(e);
    showModalSettingUser();
    createNewDoctor();
    deleteDoctorById();
    showModalInfoDoctor();
    // updateDoctor();
    deleteSpecializationById();
    showPostsForAdmin();
    deletePostById();
    createNewPost(markdownPost, converter);
    updatePost(markdownPost, converter);

    let arr = [];
    handleBtnSchedule(arr);
    createScheduleByDoctor(arr);
    selectAllScheduleByAdmin(arr);
    cancelAllScheduleByAdmin(arr);
    let currentDate = $('#datepicker').val();
    handleChangeDatePicker(currentDate);
    loadNewPatientsForAdmin();
    handleBtnNewPatientOk();
    handleBtnNewPatientCancel();
    handleBtnPendingPatient();
    handleBtnPendingCancel();
    resetModal();
    handleAfterCallingPatient();
    handleViewInfoPatientBooked();
    handleCancelBtn();
    handleBtnViewHistory();

    handleDoctorViewInfoPatient();
    showModalSendForms();
    handleSendFormsForPatient();
    doneComment();

    let month = new Date().getMonth();
    statisticalAdmin(month + 1);
    handleFindStatisticalAdmin();

    deleteScheduleByDate();
    // showModalInfoCustomer();
    // deleteCustomerById();
    loadPatientsByDate();
    searchCustomerByPhone();
    searchDoctorBy();
    updateCustomer();
    updateDoctorFinal();
    handleShowBookingTimeOff();
    postBookingTimeOff();
    showCalendarDoctor();
    createScheduleAll();
    RefuseTimeOff();
    SwapScheduleAccept();
});
