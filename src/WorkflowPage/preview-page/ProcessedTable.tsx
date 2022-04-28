import { TransformResult, ProcessedDataPoint } from "../datapoints"
import { Button, Row, Col } from 'react-bootstrap';
import React from 'react';


interface RowProps {
    data: ProcessedDataPoint, 
    setPage: (page: number) => void
}

function ProcessedTableRow({data, setPage}: RowProps) {
    return <div>
    <Row>
        <Col>{data.content}</Col>
        <Col>{data.page}</Col>
        <Col>{data.stat}</Col>
        <Col>Actions</Col>
    </Row>
    </div>;
}

interface Props {
    filename: string,
    data: TransformResult,
    filter_page?: number,
    setPage: (page: number) => void
}

export default function ProcessedTable({filename, data, filter_page, setPage}: Props) {
    const filtered_data = React.useMemo(() => 
        (filter_page == undefined) ?
            data.processed_datas : data.processed_datas.filter(dp => dp.page === filter_page)
    , [filter_page, data]);
    return <><h4>{filename}</h4>
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
        {filtered_data.map(
            (data: ProcessedDataPoint, idx: number) => 
                <tr key={idx}>
                    <td>Data: {data.stat}</td>
                    <td className="me-1">Page: {data.page}</td>
                    <td className="me-1">{data.content}</td>
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
    </>
}