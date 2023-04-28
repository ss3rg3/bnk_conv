import {CSSProperties, useCallback, useState} from 'react';
import {
    Container,
    Sidebar,
    Sidenav,
    Content,
    Button,
    Table,
    Form,
    SelectPicker,
    Uploader,
    useToaster,
    Message
} from 'rsuite';
import Papa from 'papaparse';
import {FileType} from "rsuite/Uploader";
import {parseDbCsv} from "./converters/DbConverter.tsx";
import {NormalizedRow} from "./models/NormalizedRow.tsx";
import {CsvType} from "./models/CsvType.tsx";
import {TypeAttributes} from "rsuite/cjs/@types/common";
import Status = TypeAttributes.Status;

const {Column, HeaderCell, Cell} = Table;

const headerStyles: CSSProperties = {
    padding: 18,
    fontSize: "2em",
    background: '#34c3ff',
    color: ' #fff',
    overflow: 'hidden',
    textAlign: 'center'
};

type MoneyCellProps = {
    dataKey: string;
    rowData?: {
        [key: string]: string;
    };
};

const MoneyCell = ({dataKey, ...props}: MoneyCellProps) => (
    <Cell {...props}>
        {props.rowData && props.rowData[dataKey] != null ? parseFloat(props.rowData[dataKey]).toFixed(2) + " €" : ""}
    </Cell>
);

const createColumn = (key: string) => {
    if (key == 'booking') {
        return (
            <Column key={key} flexGrow={5} fullText>
                <HeaderCell>{key}</HeaderCell>
                <Cell dataKey={key}/>
            </Column>
        )
    }
    if (key == 'debit' || key == 'credit') {
        return (
            <Column key={key} flexGrow={1}>
                <HeaderCell>{key}</HeaderCell>
                <MoneyCell dataKey={key}/>
            </Column>
        )
    }
    return (
        <Column key={key} flexGrow={1}>
            <HeaderCell>{key}</HeaderCell>
            <Cell dataKey={key}/>
        </Column>
    )
}

const createMessage = (message: string, messageType: Status) => {
    return (
        <Message showIcon type={messageType}>
            {message}
        </Message>
    )
}


export default function App() {
    const [csvType, setCsvType] = useState<CsvType>(CsvType.DB);
    const [normalizedRows, setNormalizedRows] = useState<NormalizedRow[]>([]);
    const toaster = useToaster();

    const handleFileChange = (file: File) => {
        if (file) {
            Papa.parse<string>(file, {
                "header": false,
                "complete": (results) => {

                    let normalizedRows
                    switch (csvType) {
                        case "DB":
                            normalizedRows = parseDbCsv(results.data)
                            break
                        default:
                            throw new Error("csvType not recognized")
                    }

                    if (normalizedRows.length > 1) {
                        setNormalizedRows(normalizedRows)
                        pushToast(`Converted ${normalizedRows.length} rows`, "success")
                    } else {
                        pushToast("Couldn't convert CSV, no valid rows", "error")
                    }
                },
            });
        }
    };

    const convertToCSV = (data: NormalizedRow[]) => {
        const rows = data
            .map((row) =>
                Object.values(row)
                    .map((value) => {
                        if (value === null) {
                            return "";
                        } else if (typeof value === "number") {
                            return value.toLocaleString("de-DE");
                        } else {
                            return JSON.stringify(value);
                        }
                    })
                    .join('\t')
            )
            .join('\n');
        return `${rows}`;
    };

    const pushToast = useCallback((message: string, type: Status) => {
        toaster.push(createMessage(message, type), { placement: "bottomEnd", duration: 3000 })
    }, [toaster])

    const handleCopyToClipboard = useCallback(() => {
        if (normalizedRows.length < 1) {
            pushToast("Nothing to copy", "error")
            return
        }

        const csvData = convertToCSV(normalizedRows);
        navigator.clipboard.writeText(csvData).then(
            () => {
                pushToast("Copied to clipboard", "success")
            },
            () => {
                pushToast("Failed to copied to clipboard", "error")
            }
        );
    }, [normalizedRows, pushToast]);


    return (
        <Container style={{height: "100vh"}}>
            <Sidebar style={{display: 'flex', flexDirection: 'column'}} width="260" collapsible>
                <Sidenav.Header>
                    <div style={headerStyles}>
                        CSV Converter
                    </div>
                </Sidenav.Header>
                <Sidenav appearance="subtle">
                    <Sidenav.Body>
                        <Form fluid>
                            <Form.Group>
                                <Form.ControlLabel style={{marginTop: "20px", fontWeight: "bold"}}>CSV
                                    Type</Form.ControlLabel>
                                <SelectPicker
                                    data={[
                                        {label: 'DB', value: 'DB'},
                                        {label: 'DKB', value: 'DKB'},
                                    ]}
                                    searchable={false}
                                    onChange={(value) => setCsvType(value as CsvType)}
                                    value={csvType}
                                    style={{width: '100%'}}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.ControlLabel style={{fontWeight: "bold"}}>CSV File</Form.ControlLabel>
                                <Uploader
                                    action=""
                                    autoUpload={false}
                                    fileListVisible={false}
                                    accept=".csv"
                                    draggable
                                    onChange={(fileList: FileType[]) => {
                                        if (fileList.length > 0) {
                                            handleFileChange(fileList[0].blobFile as File);
                                        }
                                    }}>
                                    <div style={{height: '80px', verticalAlign: 'center', textAlign: 'center'}}>Drag
                                        and drop<br/>CSV file here
                                    </div>
                                </Uploader>
                            </Form.Group>
                        </Form>
                        <Button onClick={handleCopyToClipboard}>Copy CSV to Clipboard</Button>
                    </Sidenav.Body>
                </Sidenav>
            </Sidebar>


            <Content>
                {normalizedRows.length > 0 ? (
                    <Table data={normalizedRows} autoHeight>
                        {Object.keys(normalizedRows[0]).map((key) => (
                            createColumn(key)
                        ))}
                    </Table>
                ) : (
                    <div>not loaded</div>
                )}
            </Content>
        </Container>
    );
}
