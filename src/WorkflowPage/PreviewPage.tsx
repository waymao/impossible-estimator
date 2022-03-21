import styles from './PreviewPage.module.css';
import React, { useState, useEffect } from 'react';
import PDFViewer from './PDFViewer';
import { getDataPoint, ProcessedDataPoint, TransformResult } from './datapoints';
import { useParams } from 'react-router';
import { Button } from 'react-bootstrap';

export function PreviewPage() {
    const filename = useParams().filename;
    const [data, setData] = React.useState<TransformResult>();
    const [page, setPage] = React.useState<number>(1);

    useEffect(() => {
        console.log(filename);
        getDataPoint('' + filename).then(setData);
    }, [filename])

    return <div className={styles.previewPageBoard}>
        <div className={styles.ListPanel}>
            <h4>google_2021_diversity_annual_report</h4>
            <table>
                <tr>
                    <th>data</th>
                    <th>page</th>
                    <th>tag</th>
                    {/* <th>action</th> */}
                </tr>
                {data && data.result.processed_datas.map(
                    (data: ProcessedDataPoint, idx: number) => 
                        <tr key={idx}>
                            <td>Data: {data.stat}</td>
                            <td className="me-1">Page: {data.page}</td>
                            <td className="me-1">{data.content}</td>
                            <td className="me-1"><Button variant="link" onClick={() => setPage(data.page)}>Lookup</Button></td>
                            <td className="me-1"><Button variant="link">Edit</Button></td>
                        </tr>
                )}
            </table>
        </div>
        <div>
            <PDFViewer 
                url="/google_2021_diversity_annual_report.pdf" 
                data={data?.result?.processed_datas} 
                page={page}
            />
        </div>
    </div>;
}
