import * as dateFns from 'date-fns';
import * as dateFnsTz from 'date-fns-tz';
const TIME_ZONE = process.env.TIME_ZONE || 'Asia/Ho_Chi_Minh';

const ShiftType = {
    REGULAR: 'regular', // Ca làm việc thường (ví dụ: 8h-17h)
    ON_CALL: 'on-call', // Ca trực đêm (ví dụ: 17h - 8h sáng hôm sau)
};

// --- Hàm tùy chỉnh ---

function getShiftStartDateTime(dateStr, type) {
    if (!dateStr || !type) {
        console.error('getShiftStartDateTime: Missing dateStr or type.');
        return null;
    }
    try {
        const baseDate = dateFns.parseISO(dateStr);
        if (isNaN(baseDate.getTime())) {
            console.error(`getShiftStartDateTime: Invalid date string format: ${dateStr}`);
            return null;
        }
        let zonedStart = dateFnsTz.toZonedTime(baseDate, TIME_ZONE);
        if (type === ShiftType.ON_CALL) {
            zonedStart = dateFns.setHours(zonedStart, 17);
        } else if (type === ShiftType.REGULAR) {
            zonedStart = dateFns.setHours(zonedStart, 8);
        } else {
            console.error(`getShiftStartDateTime: Unknown shift type: ${type}`);
            return null;
        }
        zonedStart = dateFns.setMinutes(zonedStart, 0);
        zonedStart = dateFns.setSeconds(zonedStart, 0);
        zonedStart = dateFns.setMilliseconds(zonedStart, 0);
        return zonedStart;
    } catch (error) {
        console.error(`Error in getShiftStartDateTime for date '${dateStr}', type '${type}':`, error);
        return null;
    }
}

function getShiftEndDateTime(dateStr, type) {
    if (!dateStr || !type) {
        console.error('getShiftEndDateTime: Missing dateStr or type.');
        return null;
    }
    try {
        const baseDate = dateFns.parseISO(dateStr);
        if (isNaN(baseDate.getTime())) {
            console.error(`getShiftEndDateTime: Invalid date string format: ${dateStr}`);
            return null;
        }
        let zonedEnd = dateFnsTz.toZonedTime(baseDate, TIME_ZONE);
        if (type === ShiftType.ON_CALL) {
            zonedEnd = dateFns.addDays(zonedEnd, 1);
            zonedEnd = dateFns.setHours(zonedEnd, 8);
        } else if (type === ShiftType.REGULAR) {
            zonedEnd = dateFns.setHours(zonedEnd, 17);
        } else {
            console.error(`getShiftEndDateTime: Unknown shift type: ${type}`);
            return null;
        }
        zonedEnd = dateFns.setMinutes(zonedEnd, 0);
        zonedEnd = dateFns.setSeconds(zonedEnd, 0);
        zonedEnd = dateFns.setMilliseconds(zonedEnd, 0);
        return zonedEnd;
    } catch (error) {
        console.error(`Error in getShiftEndDateTime for date '${dateStr}', type '${type}':`, error);
        return null;
    }
}

// --- Export các hằng số, hàm tùy chỉnh và toàn bộ thư viện date-fns, date-fns-tz ---
export {
    // Hằng số
    TIME_ZONE,
    ShiftType,

    // Hàm tùy chỉnh
    getShiftStartDateTime,
    getShiftEndDateTime,
};
