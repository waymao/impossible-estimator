import { ExtractResult, RawDataPoint } from "../datapoints"
import { Button, Row, Col } from 'react-bootstrap';
import React from 'react';
import styles from './table.module.css'

function dataCategoryToIcon(category: RawDataPoint["type"]) {
    switch (category) {
        case "NUM":
            return <i className="fa-solid fa-chart-simple"></i>;
        case "STR":
            return <i className="fa-solid fa-font"></i>;
        default:
            return <i className="fa-solid fa-circle-question"></i>;
    }
}

interface RowProps {
    data: RawDataPoint, 
    setPage: (page: number) => void,
    setCurrentKeyword: (data: RawDataPoint) => void,
}

function RawTableRow({data, setPage, setCurrentKeyword}: RowProps) {
    return <Row className={styles.tbRow}>
        <Col md="6" className="text-start">{data.content}</Col>
        <Col md="1" sm="3">{dataCategoryToIcon(data.type)}</Col>
        <Col md="2" sm="3" className="text-center">{data.page}</Col>
        <Col md="3" className="text-end">
            {data.type === 'STR' ? 
                <Button variant="link" className="link-icon-button" onClick={() => setCurrentKeyword(data)}>
                    <i className="fa-solid fa-circle-plus"></i>
                </Button>
                 : 
                <></>
            }
            <Button variant="link" className="link-icon-button" onClick={() => setPage(data.page + 1)}>
                <i className="fa-solid fa-magnifying-glass"></i>
            </Button>
        </Col>
    </Row>;
}


interface Props {
    filename: string,
    data: ExtractResult,
    filter_page?: number,
    setPage: (page: number) => void,
    setCurrentKeyword: (data: RawDataPoint) => void,
}


export default function RawDataTable({filename, data, filter_page, setPage, setCurrentKeyword}: Props) {
    const filtered_data = React.useMemo(() => 
        (filter_page === undefined) ?
            data.raw_data : data.raw_data.filter(dp => dp.page === filter_page)
    , [filter_page, data]);
    return <><h5>{filename}</h5>
    <div className="overflow-auto px-2 text-center" style={{height: "75vh"}}>
        <Row className="text-center bg-secondary text-white">
            <Col md="6">Content</Col>
            <Col md="1">T</Col>
            <Col md="2">Page</Col>
        </Row>
        {filtered_data.map(
            (data: RawDataPoint, idx: number) => 
                <RawTableRow data={data} key={data.id} setPage={setPage} setCurrentKeyword={setCurrentKeyword}/>
        )}
    </div>
    </>
}