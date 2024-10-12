import {NormalizedRow} from "../models/NormalizedRow.tsx";
import {Moment} from "moment";
import {CsvType} from "../models/CsvType.tsx";
import * as moment from "moment/moment";

export function parseDkbCsv(rows: string[]): NormalizedRow[] {
    return rows.map((row: string): undefined | NormalizedRow => {
        console.log(row)
        if (row.length == 1) {
            return undefined;
        }
        const date: Moment = moment(row[0], "DD.MM.YY", true);
        if (!date.isValid() || isNaN(parseFloat(row[8]))) {
            return undefined;
        }

        const booking: string = row[4].trim() == "" ? `${row[5]}` : `${row[4]} ${row[5]}`;
        const candidate = {
            date: date.format("DD.MM.yyyy"),
            month: date.format("MMMM"),
            account: CsvType.DKB,
            booking: normalizeBooking(booking),
            type: "TODO",
            credit: determineIfCredit(row[8]),
            debit: determineIfDebit(row[8]),
        }
        console.log(candidate)
        return candidate
    })
        .filter((row: undefined | NormalizedRow): row is NormalizedRow => row !== undefined)
}

function determineIfDebit(value: string): number | null {
    if (!/^[-+]?(\d{1,4}(\.\d{3})*(,\d{1,2})*)$/.test(value)) {
        throw new Error("The input is not a valid German formatted number, check: " + value);
    }

    const standardFloat: number = parseFloat(value.replace(/\./g, '').replace(',', '.'));
    if (standardFloat < 0) {
        return standardFloat;
    } else {
        return null;
    }
}

function determineIfCredit(value: string): number | null {
    if (!/^[-+]?(\d{1,4}(\.\d{3})*(,\d{1,2})*)$/.test(value)) {
        throw new Error("The input is not a valid German formatted number, check: " + value);
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


