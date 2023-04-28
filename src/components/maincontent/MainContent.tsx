import { Content, Table } from 'rsuite';
import {ContentProps, MoneyCellProps} from "./MainContentTypes.tsx";

const { Column, HeaderCell, Cell } = Table;


const MoneyCell = (props: MoneyCellProps) => (
    <Cell {...props}>
        {props.rowData && props.rowData[props.dataKey] != null
            ? parseFloat(props.rowData[props.dataKey]).toFixed(2) + ' €'
            : ''}
    </Cell>
);

const createColumn = (key: string) => {
    if (key === 'booking') {
        return (
            <Column key={key} flexGrow={5} fullText>
                <HeaderCell>{key}</HeaderCell>
                <Cell dataKey={key} />
            </Column>
        );
    }
    if (key === 'debit' || key === 'credit') {
        return (
            <Column key={key} flexGrow={1}>
                <HeaderCell>{key}</HeaderCell>
                <MoneyCell dataKey={key} />
            </Column>
        );
    }
    return (
        <Column key={key} flexGrow={1}>
            <HeaderCell>{key}</HeaderCell>
            <Cell dataKey={key} />
        </Column>
    );
};



const ContentComponent = ({ normalizedRows }: ContentProps) => {
    return (
        <Content>
            {normalizedRows.length > 0 ? (
                <Table data={normalizedRows} autoHeight>
                    {Object.keys(normalizedRows[0]).map((key) => createColumn(key))}
                </Table>
            ) : (
                <div>not loaded</div>
            )}
        </Content>
    );
};

export default ContentComponent;
