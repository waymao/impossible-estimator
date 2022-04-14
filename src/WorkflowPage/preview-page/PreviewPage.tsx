import styles from './PreviewPage.module.css';
import React, { useState, useEffect, useCallback } from 'react';
import PDFViewer, { BoxToDraw } from './PDFViewer';
import { getTransformedDataPoint, ProcessedDataPoint, TransformResult } from '../datapoints';
import { useParams } from 'react-router';
import { Button } from 'react-bootstrap';
import { FileInfo, getFileInfo } from '../files';

export function PreviewPage() {
    const file_id = useParams().file_id;
    const [file_info, setFileInfo] = React.useState<FileInfo | null>();
    const [data, setData] = React.useState<TransformResult>();
    const [page, setPage] = React.useState<number>(1);

    useEffect(() => {
        console.log(file_id);
        if (file_id === undefined) return;
        getFileInfo(file_id).then(setFileInfo)
        getTransformedDataPoint(file_id).then(setData);
    }, [file_id])
    
    const getDataPointForPage = useCallback((page: number) => {
        return data?.processed_datas?.filter((item: ProcessedDataPoint) => item.page === page);
    }, [data]);

    const getDataBoxForValidate = useCallback((datapoint_id: number) => {
        // TODO to be able to validate by clicking on secondary boxes
        return [];
    }, [data]);

    const boxes_data: BoxToDraw[] = data?.processed_datas.flatMap(item => ([{
        left: item.coord[0],
        top: item.coord[1],
        width: item.coord[2] - item.coord[0],
        height: item.coord[3] - item.coord[1], 
        color: 'black'
    }, {
        left: item.stat_coord[0],
        top: item.stat_coord[1],
        width: item.stat_coord[2] - item.stat_coord[0],
        height: item.stat_coord[3] - item.stat_coord[1], 
        color: 'red'
    }])) ?? [];

    if (file_id === undefined) {
        return <div>
            <h2>Error: Filename not defined</h2>
        </div>
    } else if (file_info === undefined || data === undefined) {
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
            <h4>{file_info.name}</h4>
            <table>
                <thead>
                <tr>
                    <th>data</th>
                    <th>page</th>
                    <th>tag</th>
                    {/* <th>action</th> */}
                </tr>
                </thead>
                <tbody>
                {data && data.processed_datas.map(
                    (data: ProcessedDataPoint, idx: number) => 
                        <tr key={idx}>
                            <td>Data: {data.stat}</td>
                            <td className="me-1">Page: {data.page}</td>
                            <td className="me-1">{data.content}</td>
                            <td className="me-1"><Button variant="link" onClick={() => setPage(data.page)}>Lookup</Button></td>
                            <td className="me-1"><Button variant="link">Edit</Button></td>
                        </tr>
                )}
                </tbody>
            </table>
        </div>
        <div>
            <PDFViewer 
                url={file_info?.path ?? ""}
                boxes_to_draw={boxes_data} 
                page={page}
            />
        </div>
    </div>;
}
