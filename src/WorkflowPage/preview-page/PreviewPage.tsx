import styles from './PreviewPage.module.css';
import React, { useState, useEffect, useCallback } from 'react';
import PDFViewer, { BoxToDraw } from './PDFViewer';
import { ExtractResult, getTransformedDataPoint, ProcessedDataPoint, TransformResult, getExtractedDataPoint } from '../datapoints';
import { useParams } from 'react-router';
import { Tabs, Tab } from 'react-bootstrap';
import { FileInfo, getFileInfo } from '../files';
import ProcessedTable from './ProcessedTable';
import RawDataTable from './RawDataTable';

type Mode = 'raw_all' | 'edit' | 'processed';

export function PreviewPage() {
    const file_id = useParams().file_id;
    const [file_info, setFileInfo] = React.useState<FileInfo | null>();
    const [data, setData] = React.useState<TransformResult>();
    const [raw_data, setRawData] = React.useState<ExtractResult>();
    const [mode, setMode] = React.useState<Mode>('processed');
    const [page, setPage] = React.useState<number>(1);

    useEffect(() => {
        if (file_id === undefined) return;
        getFileInfo(file_id).then(setFileInfo);
        getExtractedDataPoint(file_id).then(setRawData);
        getTransformedDataPoint(file_id).then(setData);
    }, [file_id])
    
    const getDataPointForPage = useCallback((page: number) => {
        return data?.processed_datas?.filter((item: ProcessedDataPoint) => item.page === page);
    }, [data]);

    const getDataBoxForValidate = useCallback((datapoint_id: number) => {
        // TODO to be able to validate by clicking on secondary boxes

        return [];
    }, [data]);

    const boxes_data: BoxToDraw[] = React.useMemo(() => {
        // returns processed data or raw data based on user selection
        if (mode === 'processed') {
            return data?.processed_datas.flatMap(item => ([{
                x1: item.coord[0],
                y1: item.coord[1],
                x2: item.coord[2],
                y2: item.coord[3], 
                color: 'black'
            }, {
                x1: item.coord[0],
                y1: item.coord[1],
                x2: item.coord[2],
                y2: item.coord[3], 
                color: 'red'
            }])) ?? [];
        } else if (mode === 'raw_all') {
            return raw_data?.raw_data
                    .filter(item => item.page + 1 === page)
                    .map(item => ({
                        x1: item.coord[0],
                        y1: item.coord[1],
                        x2: item.coord[2],
                        y2: item.coord[3], 
                        color: 'blue',
                        onClick: () => {console.log(item.content);}
            })) ?? [];
        }
        // TODO fixme
        return [];
    }, [data, raw_data, mode, page]);

    if (file_id === undefined) {
        return <div>
            <h2>Error: Filename not defined</h2>
        </div>
    } else if (file_info === undefined || data === undefined || raw_data === undefined) {
        return <div>
            <p>Loading...</p>
        </div>
    } else if (file_info === null) {
        return <div>
            <p>404: File Not Found</p>
        </div>
    }

    return <div className={styles.previewPageBoard}>
        <div className={styles.ListPanel}>
        <Tabs 
            defaultActiveKey="profile" 
            activeKey={mode}
            onSelect={(k) => setMode(k as Mode)}
            className="mb-3"
        >
            <Tab eventKey="processed" title="Processed Data">
                <ProcessedTable filename={file_info.name} data={data} setPage={setPage}/>
            </Tab>
            <Tab eventKey="raw_all" title="Raw Data">
                <RawDataTable filename={file_info.name} data={raw_data} setPage={setPage}/>
            </Tab>
        </Tabs>
        </div>
        <div>
            <PDFViewer 
                url={file_info?.path ?? ""}
                boxes_to_draw={boxes_data} 
                page={page}
                reportChangePage={setPage}
            />
        </div>
    </div>;
}
