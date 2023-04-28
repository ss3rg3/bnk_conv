import {NormalizedRow} from "../models/NormalizedRow.tsx";
import {Moment} from "moment";
import {CsvType} from "../models/CsvType.tsx";
import * as moment from "moment/moment";

export function parseDbCsv(rows: string[]): NormalizedRow[] {
    return rows.map((row: string): undefined | NormalizedRow => {
            if (row.length == 1) {
                return undefined;
            }

            const date: Moment = moment(row[0], "MM/DD/YYYY", true);
            if (!date.isValid() || row[17] !== "EUR") {
                return undefined;
            }

            const booking: string =
                row[3].trim() == "" ? `${row[4]}` : `${row[3]} ${row[4]}`;
            return {
                date: date.format("DD.MM.yyyy"),
                month: date.format("MMMM"),
                account: CsvType.DB,
                booking: normalizeBooking(booking),
                type: parseBooking(booking),
                credit: getNumberOrNull(row[16]),
                debit: getNumberOrNull(row[15]),
            }
        })
        .filter((row: undefined | NormalizedRow): row is NormalizedRow => row !== undefined)
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

function normalizeBooking(value: string): string {
    if (value.length > 200) {
        return value.slice(0, 200) + "...";
    }
    return value
}


