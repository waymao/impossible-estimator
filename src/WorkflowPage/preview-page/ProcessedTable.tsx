import { TransformResult, ProcessedDataPoint } from "../datapoints"
import { Button, Row, Col } from 'react-bootstrap';
import React from 'react';
import styles from './table.module.css'

interface RowProps {
    data: ProcessedDataPoint, 
    setPage: (page: number) => void
}

function ProcessedTableRow({data, setPage}: RowProps) {
    return <Row className={styles.tbRow}>
        <Col md="4" key="1" className="text-start">{data.content}</Col>
        <Col md="3" key="2" className="text-start">{data.stat}</Col>
        <Col md="2" key="3" sm="3" className="text-center">{data.page}</Col>
        <Col md="3" key="4" className="text-end">
            <Button variant="link" className="link-icon-button" onClick={() => setPage(data.page + 1)}>
                <i className="fa-solid fa-magnifying-glass"></i>
            </Button>
            <Button variant="link" className="link-icon-button">
                <i className="fa-solid fa-pen"></i>
            </Button>
        </Col>
    </Row>;
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
    return <><h5>{filename}</h5>
    <div className="overflow-auto px-2 text-center" style={{height: "75vh"}}>
        <Row className="text-center bg-secondary text-white">
            <Col md="4">Keyword</Col>
            <Col md="3">Data</Col>
            <Col md="2">Page</Col>
            <Col md="3">Action</Col>
        </Row>
        {filtered_data.map(
            (data: ProcessedDataPoint) => 
                <ProcessedTableRow data={data} key={data.id} setPage={setPage}/>
        )}
    </div>
    </>
}
