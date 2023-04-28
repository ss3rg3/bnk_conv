import {NormalizedRow} from "../../models/NormalizedRow.tsx";

export type ActionSidebarProps = {
    normalizedRows: NormalizedRow[];
    setNormalizedRows: (normalizedRows: NormalizedRow[]) => void;
};
