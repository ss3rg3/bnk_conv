import {NormalizedRow} from "../models/NormalizedRow.tsx";
import {Moment} from "moment";
import {CsvType} from "../models/CsvType.tsx";
import * as moment from "moment/moment";

export function parseDkbCsv(rows: string[]): NormalizedRow[] {
    return rows.map((row: string): undefined | NormalizedRow => {

        if (row.length == 1) {
            return undefined;
        }
        const date: Moment = moment(row[0], "DD.MM.YYYY", true);
        if (!date.isValid() || isNaN(parseFloat(row[7]))) {
            return undefined;
        }

        const booking: string = row[3].trim() == "" ? `${row[4]}` : `${row[3]} ${row[4]}`;
        return {
            date: date.format("DD.MM.yyyy"),
            month: date.format("MMMM"),
            account: CsvType.DKB,
            booking: normalizeBooking(booking),
            type: "TODO",
            credit: determineIfCredit(row[7]),
            debit: determineIfDebit(row[7]),
        }
    })
        .filter((row: undefined | NormalizedRow): row is NormalizedRow => row !== undefined)
}

function determineIfDebit(value: string): number | null {
    if (!/^[-+]?(\d{1,3}(\.\d{3})*,\d{1,2})$/.test(value)) {
        throw new Error("The input is not a valid German formatted number.");
    }

    const standardFloat: number = parseFloat(value.replace(/\./g, '').replace(',', '.'));
    if (standardFloat < 0) {
        return standardFloat;
    } else {
        return null;
    }
}

function determineIfCredit(value: string): number | null {
    if (!/^[-+]?(\d{1,3}(\.\d{3})*,\d{1,2})$/.test(value)) {
        throw new Error("The input is not a valid German formatted number.");
    }

    const standardFloat: number = parseFloat(value.replace(/\./g, '').replace(',', '.'));
    if (standardFloat < 0) {
        return null;
    } else {
        return standardFloat;
    }
}


function normalizeBooking(value: string): string {
    if (value.length > 200) {
        return value.slice(0, 200) + "...";
    }
    return value
}


