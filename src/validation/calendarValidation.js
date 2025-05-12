import * as dateFns from 'date-fns';
import * as dateFnsTz from 'date-fns-tz';
import { TIME_ZONE, ShiftType, getShiftStartDateTime, getShiftEndDateTime } from '../helper/dateUtils.js';
let isDoctorOnLeave = async (doctorId, dateStr, TimeOffs) => {
    if (!TimeOffs || TimeOffs.length === 0) return false;
    let targetDate = dateFnsTz.toZonedTime(dateFns.parseISO(dateStr), TIME_ZONE);
    for (let leave of TimeOffs) {
        if (leave.doctorId === doctorId) {
            let startDate = dateFnsTz.toZonedTime(dateFns.parseISO(leave.startDate), TIME_ZONE);
            let endDate = dateFnsTz.toZonedTime(dateFns.parseISO(leave.endDate), TIME_ZONE);
            if (dateFns.isWithinInterval(targetDate, { start: startDate, end: endDate })) {
                return true;
            }
        }
    }
    return false;
};

// --- RÀNG BUỘC: NGHỈ SAU TRỰC ---
let violatesRestAfterOnCall = async (doctorId, dateStrToAssign, typeToAssign, existingDoctorShifts) => {
    if (typeToAssign !== ShiftType.REGULAR) return false; // Chỉ áp dụng khi xếp ca thường
    const targetAssignDate = dateFns.parseISO(dateStrToAssign);

    for (const existingShift of existingDoctorShifts) {
        if (existingShift.doctorId === doctorId && existingShift.type === ShiftType.ON_CALL) {
            const onCallEndTime = existingShift.endTime; // endTime đã là đối tượng Date
            // Kiểm tra xem ca trực có kết thúc vào buổi sáng của ngày đang định xếp ca thường không
            if (dateFns.isSameDay(onCallEndTime, targetAssignDate) && onCallEndTime.getHours() === 8) {
                // console.log(`Violation (RestAfterOnCall): Dr ${doctorId} cannot work regular on ${dateStrToAssign} due to on-call ending that morning.`);
                return true;
            }
        }
    }
    return false;
};

let violatesSameDayWorkAndOnCall = async (doctorId, dateStrToAssign, typeToAssign, existingDoctorShifts) => {
    const targetAssignDate = dateFns.parseISO(dateStrToAssign);

    for (const existingShift of existingDoctorShifts) {
        // Sử dụng hàm qua đối tượng đã import
        if (
            existingShift.doctorId === doctorId &&
            dateFns.isSameDay(dateFns.parseISO(existingShift.date), targetAssignDate)
        ) {
            if (existingShift.type === ShiftType.REGULAR && typeToAssign === ShiftType.ON_CALL) {
                return true;
            }
            if (existingShift.type === ShiftType.ON_CALL && typeToAssign === ShiftType.REGULAR) {
                return true;
            }
        }
    }
    return false;
};

let getOnCallCountForWeek = async (doctorId, dateForWeek, allAssignedShiftsForDoctor) => {
    const targetDate = dateFnsTz.toZonedTime(dateFns.parseISO(dateForWeek), TIME_ZONE);
    const weekNumber = dateFns.getWeek(targetDate, { weekStartsOn: 1 });
    const year = targetDate.getFullYear(); // Hoặc dateFns.getYear(targetDate)
    let count = 0;
    for (const shift of allAssignedShiftsForDoctor) {
        if (shift.doctorId === doctorId && shift.type === ShiftType.ON_CALL) {
            const shiftDate = dateFnsTz.toZonedTime(dateFns.parseISO(shift.date), TIME_ZONE);
            if (shiftDate.getFullYear() === year && dateFns.getWeek(shiftDate, { weekStartsOn: 1 }) === weekNumber) {
                count++;
            }
        }
    }
    return count;
};

export { isDoctorOnLeave, violatesRestAfterOnCall, violatesSameDayWorkAndOnCall, getOnCallCountForWeek };
