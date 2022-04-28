import { ExtractResult, RawDataPoint } from "../datapoints"
import { Button } from 'react-bootstrap';
import React from 'react';

interface Props {
    filename: string,
    data: ExtractResult,
    filter_page?: number,
    setPage: (page: number) => void
}


export default function RawDataTable({filename, data, filter_page, setPage}: Props) {
    const filtered_data = React.useMemo(() => 
        (filter_page === undefined) ?
            data.raw_data : data.raw_data.filter(dp => dp.page === filter_page)
    , [filter_page, data]);
    return <><h4>{filename}</h4>
    <div className="overflow-auto" style={{height: "75vh"}}>
        <table>
        <thead>
        <tr>
            <th>data</th>
            <th>page</th>
            <th>type</th>
            <th>tag</th>
            {/* <th>action</th> */}
        </tr>
        </thead>
        <tbody>
        {filtered_data.map(
            (data: RawDataPoint, idx: number) => 
                <tr key={`page-${filter_page}-entry-${idx}`}>
                    <td>{data.content}</td>
                    <td className="me-1">{data.page + 1}</td>
                    <td className="me-1">{data.type}</td>
                    <td className="me-1">
                        <Button variant="link" onClick={() => setPage(data.page + 1)}>
                            Lookup
                        </Button>
                    </td>
                    <td className="me-1">
                        <Button variant="link">
                            Edit
                        </Button>
                    </td>
                </tr>
        )}
        </tbody>
        </table>
    </div>
    </>
}