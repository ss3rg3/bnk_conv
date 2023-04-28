import {Moment} from "moment";
import * as moment from "moment/moment";

export function normalizeDate(dateString: string): Moment {
    const dateFormats = [
        "MM/DD/YYYY",
        "M/D/YYYY",
        "MM.DD.YYYY",
        "M.D.YYYY",
        "DD/MM/YYYY",
        "D/M/YYYY",
        "DD.MM.YYYY",
        "D.M.YYYY",
        "YYYY-MM-DD",
        "YYYY-M-D",
    ];

    for (const format of dateFormats) {
        const date = moment(dateString, format, true);

        if (date.isValid()) {
            return date;
        }
    }

    throw new Error("Failed to parse date, got: " + dateString)
}

export function getNumberOrNull(value: string): number | null {
    const num: number = parseFloat(value);
    if (isNaN(num)) {
        return null;
    } else {
        return num;
    }
}

export function parseBooking(booking: string): string {
    if (booking.includes("ALDI") || booking.includes("REAL")) {
        return "Groceries"
    }

    return "TODO"
}

