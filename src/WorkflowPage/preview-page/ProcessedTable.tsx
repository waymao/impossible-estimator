import { TransformResult, ProcessedDataPoint } from "../datapoints"
import { Button, Row, Col } from 'react-bootstrap';
import React from 'react';
import styles from './table.module.css'

interface RowProps {
    data: ProcessedDataPoint, 
    setPage: (page: number) => void,
    setEditingKeyword: (data: ProcessedDataPoint) => void,
    setCurrHighlightDP: (data: ProcessedDataPoint) => void,
}

function ProcessedTableRow({data, setPage, setEditingKeyword, setCurrHighlightDP}: RowProps) {
        return <Row className={styles.tbRow}>
        <Col md="2" key="1.1" className="text-start">{data.category}</Col>
        <Col md="2" key="1.2" className="text-start">{data.metric}</Col>
        <Col md="3" key="1.3" className="text-start">{data.sub_metric}</Col>
        <Col md="2" key="2" className="text-center">{data.stat}</Col>
        <Col md="3" key="4" className="text-end">
            <Button variant="link" className="link-icon-button" onClick={() => setCurrHighlightDP(data)}>
                <i className="fa-solid fa-magnifying-glass"></i>
            </Button>
            <Button variant="link" className="link-icon-button"
                onClick={() => setEditingKeyword(data)}>
                <i className="fa-solid fa-pen"></i>
            </Button>
        </Col>
    </Row>;
}

interface Props {
    filename: string,
    data: TransformResult,
    filter_page?: number,
    setPage: (page: number) => void,
    setEditKeyword: (data: ProcessedDataPoint) => void,
    setCurrHighlightDP: (data: ProcessedDataPoint) => void,
}

export default function ProcessedTable({filename, data, filter_page, setPage, setEditKeyword, setCurrHighlightDP}: Props) {
    const filtered_data = React.useMemo(() => 
        (filter_page === undefined) ?
            data.processed_datas : data.processed_datas.filter(dp => dp.page === filter_page)
    , [filter_page, data]);
    return <><h5>{filename}</h5>
    <div className="overflow-auto px-2 text-center" style={{height: "75vh"}}>
        <Row className="text-center bg-secondary text-white">
            <Col md="2">Category</Col>
            <Col md="2">Metric</Col>
            <Col md="3">Sub-Metric</Col>
            <Col md="2">Data</Col>
            <Col md="3">Action</Col>
        </Row>
        {filtered_data.map(
            (data: ProcessedDataPoint) => 
                <ProcessedTableRow 
                    data={data}
                    key={`${data.id}-stat`}
                    setPage={setPage}
                    setEditingKeyword={setEditKeyword}
                    setCurrHighlightDP={setCurrHighlightDP}
                />
        )}
    </div>
    </>
}
