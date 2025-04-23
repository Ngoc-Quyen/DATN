function handleChangeDatePicker(currentDate) {
    $('#datepicker')
        .datepicker()
        .on('changeDate', function (event) {
            let date = $('#datepicker').val();
            let dateConvert = stringToDate(date, 'dd/MM/yyyy', '/');
            let currentDateConvert = stringToDate(currentDate, 'dd/MM/yyyy', '/');
            if (dateConvert >= currentDateConvert) {
                //continue, refresh button
                $('.btn-schedule').removeClass('btn-css').addClass('btn');
            } else {
                $('#datepicker').datepicker('setDate', new Date());
                alertify.error('Không thể thay đổi');
            }
        });
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

function loadNewPatientsForUser() {
    $.ajax({
        url: `${window.location.origin}/user/get-patients-for-user`,
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
                <td> ${patient.id}    </td>
                <td> ${patient.name}     </td>
                <td> ${patient.dateBooking}     </td>
                <td> (${patient.timeBooking})   </td>
                    <td> 
                    <button type="button"  data-patient-id="${patient.id}" class="ml-3 btn btn-primary btn-new-patient-ok1"><i class="fa fa-info" aria-hidden="true"></i></button>
                    <button  type="button" data-patient-id="${patient.id}" class="ml-3 btn btn-danger btn-new-patient-cancel"> Hủy </button>
                    </td>
                </tr>
                `;
            });
            // đổ dữ liệu chỗ đã chấp nhận
            data.object.pendingPatients.forEach((patient) => {
                htmlPending += `
                <tr>
                    <td> ${patient.name}   </td>
                    <td> ${patient.dateBooking}    </td>
                    <td> (${patient.timeBooking})   </td>
                    <td> 
                    <button type="button" data-patient-id="${patient.id}" class="ml-3 btn btn-primary btn-new-patient-ok1"><i class="fa fa-info" aria-hidden="true"></i></button>
                    </td>
                </tr>
                `;
            });
            // Đổ dữ liệu chỗ đã khám
            data.object.confirmedPatients.forEach((patient) => {
                htmlConfirmed += `
                <tr>
                    <td> ${patient.name}   </td>
                    <td> ${patient.dateBooking}     </td>
                    <td>(${patient.timeBooking})   </td>
                    <td> 
                   <div class="btn-group">
    <button type="button" data-patient-id="${patient.id}" class="btn btn-info btn-sm btn-confirmed-patient" style="font-size: 16px; background-color: #009933">Thông tin</button>
    <button type="button" data-doctor-id="${patient.doctorId}" data-patient-id="${patient.id}" class="btn btn-secondary btn-sm btn-feedback-patient ml-1" style="font-size: 16px; color: #ffffff; background-color: #0066FF;">Phản hồi</button>

</div>



                    </td>
                </tr>
                `;
            });
            // Đổ dữ liệu chỗ đã hủy
            data.object.canceledPatients.forEach((patient) => {
                htmlCanceled += `
                <tr>
                    <td> ${patient.name}   </td>
                    <td>${patient.dateBooking}   </td>
                    <td> (${patient.timeBooking})   </td>
                    <td> 
                    <button   data-patient-id="${patient.id}"  class="ml-3 btn btn-primary btn-history-cancel-patient">Lịch sử</button>
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

function handleBtnNewPatientOk1() {
    $('#tableNewPatients').on('click', '.btn-new-patient-ok1', function (e) {
        let patientId = $(this).data('patient-id');
        let option = false;
        showDetailPatient1(patientId);
    });
    $('#tableNeedConfirmPatients').on('click', '.btn-new-patient-ok1', function (e) {
        let patientId = $(this).data('patient-id');
        let option = false;
        showDetailPatient1(patientId);
    });
}

function handleBtnFeedback() {
    $('#tableConfirmedPatients').on('click', '.btn-feedback-patient', function (e) {
        let doctorId = $(this).data('doctor-id');
        let patientId = $(this).data('patient-id');
        window.location.href = `/feedback/${doctorId}?patientId=${patientId}`;
    });
}

function showDetailPatient1(patientId) {
    $.ajax({
        method: 'POST',
        url: `${window.location.origin}/api/get-detail-patient-by-id`,
        data: { patientId: patientId },
        success: function (data) {
            $('#patientName').val(data.patient.name);
            $('#btn-confirm-patient-done').attr('data-patient-id', data.patient.id);
            $('#patientPhone').val(data.patient.phone);
            $('#patientEmail').val(data.patient.email);
            $('#patientDate').val(data.patient.dateBooking);
            $('#patientTime').val(data.patient.timeBooking);
            $('#patientReason').val(data.patient.description);
            $('#patientAddress').val(data.patient.address);
            $('#patientDoctor').val(data.doctor.name);

            $('#modalDetailPatient1').modal('show');
        },
        error: function (err) {
            console.log(error);
            alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
        },
    });
}

function showDetailBookend(patientId) {
    $.ajax({
        method: 'POST',
        url: `${window.location.origin}/api/get-detail-patient-by-id`,
        data: { patientId: patientId },
        success: function (data) {
            $('#patientName1').val(data.patient.name);
            // $('#btn-confirm-patient-done').attr('data-patient-id', data.patient.id);
            $('#patientPhone1').val(data.patient.phone);
            $('#patientEmail1').val(data.patient.email);
            $('#patientDate1').val(data.patient.dateBooking);
            $('#patientTime1').val(data.patient.timeBooking);
            $('#patientReason1').val(data.patient.description);
            $('#patientAddress1').val(data.patient.address);
            console.log('doctor.name: ', data.doctor.name);
            $('#patientDoctor1').val(data.doctor.name);
            if (data.ExtraInfo) {
                $('#patientHistoryBreath').val(data.ExtraInfo.historyBreath);
                $('#patientMoreInfo').val(data.ExtraInfo.moreInfo);
            }
            $('#modalResultlPatient').modal('show');
        },
        error: function (err) {
            console.log(error);
            alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
        },
    });
}

function handleBtnNewPatientCancel() {
    $('#tableNewPatients').on('click', '.btn-new-patient-cancel', function (e) {
        $('#btnCancelBookingPatient').attr('data-patient-id', $(this).data('patient-id'));
        $('#btnCancelBookingPatient').attr('data-type', 'new-patient-cancel');
        $('#modalCancelBooking').modal('show');
    });
}

// hàm show modal của đã khám
function callAjaxRenderModalInfo(patientId, option) {
    $.ajax({
        method: 'POST',
        url: `${window.location.origin}/api/get-detail-patient-by-id`,
        data: { patientId: patientId },
        success: function (data) {
            $('#patientDoctor').val(data.doctor.name);
            $('#patientName').val(data.patient.name);
            $('#btn-confirm-patient-done').attr('data-patient-id', data.patient.id);
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
            $('#modalResultlPatient').modal('show');
        },
        error: function (err) {
            console.log(error);
            alertify.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
        },
    });
}

function handleBtnPendingCancel() {
    $('#tableNeedConfirmPatients').on('click', '.btn-pending-patient-cancel', function (e) {
        $('#btnCancelBookingPatient').attr('data-patient-id', $(this).data('patient-id'));
        $('#btnCancelBookingPatient').attr('data-type', 'pending-patient-cancel');
        $('#modalCancelBooking').modal('show');
    });
}

function addNewRowTablePending(patient) {
    let htmlPending = `
                 <tr>
                    <td> ${patient.name}   </td>
                    <td> ${patient.dateBooking}     </td>
                    <td> ${patient.timeBooking}     </td>
                    <td> 
                    <button  data-patient-id="${patient.id}"  class="ml-3 btn btn-warning btn-pending-patient">Xác nhận</button>
                    <button  type="button" data-patient-id="${patient.id}" class="ml-3 btn btn-danger btn-pending-patient-cancel"> Hủy </button>
                    </td>
                </tr>
               
                `;
    $('#tableNeedConfirmPatients tbody').prepend(htmlPending);
}

function addNewRowTableConfirmed(patient) {
    let htmlConfirmed = `
                <tr>
                <td> ${patient.name}   </td>
                <td> ${patient.dateBooking}     </td>
                <td>(${patient.timeBooking})   </td>
                <td> 
                <button  type="button" data-patient-id="${patient.id}"  class="ml-3 btn btn-info btn-confirmed-patient"> Thông tin</button>
                </td>
                </tr>
                `;
    $('#tableConfirmedPatients tbody').prepend(htmlConfirmed);
}

function addNewRowTableCanceled(patient) {
    let htmlPending = `
                  <tr>
                    <td> ${patient.name}   </td>
                    <td> ${patient.dateBooking}     </td>
                    <td> ${patient.timeBooking}     </td>
                    <td>
                    <button   data-patient-id="${patient.id}"  class="ml-3 btn btn-primary btn-history-cancel-patient">Lịch sử</button>
                    </td>
                </tr>
               
                `;
    $('#tableCancelPatients tbody').prepend(htmlPending);
}

function convertStringToDateClient(string) {
    // Chuyển đổi chuỗi thành đối tượng Date
    var date = new Date(string);

    // Lấy các thành phần của ngày và thời gian
    var day = date.getDate();
    var month = date.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    // Chuẩn hóa các thành phần để có hai chữ số
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    // Định dạng lại thành chuỗi ngày/tháng/năm, giờ:phút AM/PM
    var formattedDate = day + '/' + month + '/' + year;

    return formattedDate;
}

function handleAfterCallingPatient() {
    $('#btn-confirm-patient-done').on('click', function (e) {
        if (!confirm('Bạn chắc chắn xác nhận kết thúc lịch hẹn?')) {
            return;
        }
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
        showDetailBookend(patientId);
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
                    window.location.href = '/InfoUser#'; // Thay thế '/your-new-url' bằng đường dẫn mới bạn muốn tải lại
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
                    $('#patientTimeCancel').val(convertStringToDateClient(log.createdAt));
                    $('#patientReason2').val(log.content);
                    $('#patientDoctor2').val(log.adminName);
                });
                $('#modalHistoryBooking1').modal('show');
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
                $('#patientPhone').val(data.phone);
                $('#patientEmail').val(data.email);
                $('#patientDate').val(data.dateBooking);
                $('#patientTime').val(data.timeBooking);
                $('#patientReason').val(data.description);
                $('#patientAddress').val(data.address);
                if (data.ExtraInfo) {
                    $('#patientHistoryBreath').val(data.ExtraInfo.historyBreath);
                    $('#patientMoreInfo').val(data.ExtraInfo.moreInfo);
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

    $(`#modalHistoryBooking1`).on('hidden.bs.modal', function (e) {
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

function showModalSettingUser() {
    $('.user-setting').on('click', function (e) {
        e.preventDefault();
        $('#modalSettingUser').modal('show');
    });
}

function selectNotifiUpdate() {
    const userId = form.data('user-id');
    $('#formUpdateUser').on('submit', function (e) {
        e.preventDefault();
        console.log('Ham nay duoc goi');
        $.ajax({
            url: `${window.location.origin}/users/edit/${userId}`,
            method: 'POST',
            data: $(this).serialize(),
            success: (response) => {
                alertify.success(response.message);
                // Tự động chuyển hướng sau 1 giây
                setTimeout(() => {
                    window.location.href = response.redirect;
                }, 1000);
            },
            error: (err) => {
                alertify.error(err.responseJSON.message);
            },
        });
    });
}
$(document).ready(function (e) {
    $('#input-search').on('input', function () {
        let query = $(this).val();
        if (query.length > 0) {
            $.ajax({
                method: 'POST',
                url: `${window.location.origin}/api/search`,
                data: { query: query },
                success: function (data) {
                    let results = data.results;
                    let htmlContent = '';
                    results.forEach((result) => {
                        htmlContent += `<div class="search-result-item">${result.name}</div>`;
                    });
                    $('#show-info-search').html(htmlContent);
                },
                error: function (err) {
                    console.log(err);
                    $('#show-info-search').html('<div class="search-result-item">Không tìm thấy kết quả</div>');
                },
            });
        } else {
            $('#show-info-search').html('');
        }
    });
    loadNewPatientsForUser();
    handleBtnNewPatientCancel();
    handleBtnPendingCancel();
    resetModal();
    handleAfterCallingPatient();
    handleViewInfoPatientBooked();
    handleCancelBtn();
    handleBtnViewHistory();

    handleDoctorViewInfoPatient();
    showModalSendForms();

    handleBtnNewPatientOk1();
    handleBtnFeedback();
    showModalSettingUser();
    selectNotifiUpdate();
});
