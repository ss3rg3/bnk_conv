import {getNumberOrNull, normalizeDate, parseBooking} from "../utils/Utils.tsx";
import {NormalizedRow} from "../models/NormalizedRow.tsx";
import {Moment} from "moment";
import {CsvType} from "../models/CsvType.tsx";

export function parseDbCsv(rows: string[]): NormalizedRow[] {
    return rows.map((row: string): undefined | NormalizedRow => {
            if (row.length == 1) {
                return undefined;
            }
            if (isNaN(new Date(row[0]).getTime()) || row[17] !== "EUR") {
                return undefined;
            }

            const moment: Moment = normalizeDate(row[0]);
            const booking: string =
                row[3].trim() == "" ? `${row[4]}` : `${row[3]} ${row[4]}`;
            return {
                date: moment.format("DD.MM.yyyy"),
                month: moment.format("MMMM"),
                account: CsvType.DB,
                booking: booking,
                type: parseBooking(booking),
                credit: getNumberOrNull(row[16]),
                debit: getNumberOrNull(row[15]),
            }
        })
        .filter((row: undefined | NormalizedRow): row is NormalizedRow => row !== undefined)
}



