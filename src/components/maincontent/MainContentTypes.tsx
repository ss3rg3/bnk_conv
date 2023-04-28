import {NormalizedRow} from "../../models/NormalizedRow.tsx";

export type ContentProps = {
    normalizedRows: NormalizedRow[];
};

export type MoneyCellProps = {
    dataKey: string;
    rowData?: {
        [key: string]: string;
    };
};
