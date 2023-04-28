import {Sidebar, Sidenav, Form, SelectPicker, Uploader, useToaster, Message, Button} from 'rsuite';
import {CsvType} from '../../models/CsvType.tsx';
import {NormalizedRow} from '../../models/NormalizedRow.tsx';
import {parseDbCsv} from '../../converters/DbConverter.tsx';
import Papa from 'papaparse';
import {FileType} from 'rsuite/Uploader';
import {TypeAttributes} from 'rsuite/cjs/@types/common';
import Status = TypeAttributes.Status;
import {useCallback, useState} from "react";
import {headerStyles} from "./ActionSidebarStyles.tsx";
import {ActionSidebarProps} from "./ActionSidebarTypes.tsx";
import {parseDkbCsv} from "../../converters/DkbConverter.tsx";


const createMessage = (message: string, messageType: Status) => {
    return (
        <Message showIcon type={messageType}>
            {message}
        </Message>
    );
};

const ActionSidebar = ({normalizedRows, setNormalizedRows}: ActionSidebarProps) => {
    const [csvType, setCsvType] = useState<CsvType>(CsvType.DB);
    const [currentFile, setCurrentFile] = useState<string>("");
    const toaster = useToaster();

    const handleFileChange = (file: File) => {
        if (file) {
            Papa.parse<string>(file, {
                'header': false,
                'complete': (results) => {
                    let normalizedRows: NormalizedRow[] = [];
                    switch (csvType) {
                        case 'DB':
                            normalizedRows = parseDbCsv(results.data);
                            break;
                        case 'DKB':
                            normalizedRows = parseDkbCsv(results.data);
                            break;
                        default:
                            pushToast(`CSV type not recognized, must be one of ${Object.keys(CsvType)}`, 'error');
                            return

                    }

                    if (normalizedRows.length > 1) {
                        setNormalizedRows(normalizedRows);
                        pushToast(`Converted ${normalizedRows.length} rows`, 'success');
                    } else {
                        setNormalizedRows([]);
                        pushToast("Couldn't convert CSV, no valid rows", 'error');
                    }
                },
            });
            setCurrentFile(file.name)
        }
    };

    const convertToCSV = (data: NormalizedRow[]) => {
        const rows = data
            .map((row) =>
                Object.values(row)
                    .map((value) => {
                        if (value === null) {
                            return '';
                        } else if (typeof value === 'number') {
                            return value.toLocaleString('de-DE');
                        } else {
                            return JSON.stringify(value);
                        }
                    })
                    .join('\t'),
            )
            .join('\n');
        return `${rows}`;
    };

    const pushToast = useCallback(
        (message: string, type: Status) => {
            toaster.push(createMessage(message, type), {placement: 'bottomEnd', duration: 3000});
        },
        [toaster],
    );

    const handleCopyToClipboard = useCallback(() => {
        if (normalizedRows.length < 1) {
            pushToast('Nothing to copy', 'error');
            return;
        }

        const csvData = convertToCSV(normalizedRows);
        navigator.clipboard.writeText(csvData).then(
            () => {
                pushToast('Copied to clipboard', 'success');
            },
            () => {
                pushToast('Failed to copy to clipboard', 'error');
            },
        );
    }, [normalizedRows, pushToast]);

    return (
        <Sidebar style={{display: 'flex', flexDirection: 'column'}} width="260" collapsible>
            <Sidenav.Header>
                <div style={headerStyles}>CSV Converter</div>
            </Sidenav.Header>
            <Sidenav appearance="subtle">
                <Sidenav.Body>
                    <Form fluid>
                        <Form.Group>
                            <Form.ControlLabel style={{marginTop: '20px', fontWeight: 'bold'}}>
                                CSV Type
                            </Form.ControlLabel>
                            <SelectPicker
                                data={[
                                    {label: 'DB', value: 'DB'},
                                    {label: 'DKB', value: 'DKB'},
                                ]}
                                searchable={false}
                                onChange={value => setCsvType(value as CsvType)}
                                value={csvType}
                                style={{width: '100%'}}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel style={{fontWeight: 'bold'}}>CSV File</Form.ControlLabel>
                            <Uploader
                                action=""
                                autoUpload={false}
                                fileListVisible={false}
                                accept=".csv"
                                draggable
                                onChange={(fileList: FileType[]) => {
                                    if (fileList.length > 0) {
                                        handleFileChange(fileList[fileList.length - 1].blobFile as File);
                                    }
                                }}
                            >
                                <div style={{height: '80px', verticalAlign: 'center', textAlign: 'center'}}>
                                    {currentFile == ""
                                        ?  <span>Drag and drop<br/>CSV file here</span>
                                        :  <span>{currentFile}</span>
                                    }

                                </div>
                            </Uploader>
                        </Form.Group>
                    </Form>
                    <Button onClick={handleCopyToClipboard}>Copy CSV to Clipboard</Button>
                </Sidenav.Body>
            </Sidenav>
        </Sidebar>
    );
};

export default ActionSidebar;
