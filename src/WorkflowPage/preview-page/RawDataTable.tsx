import { ExtractResult, RawDataPoint } from "../datapoints"
import { Button, Table } from 'react-bootstrap';
import React from 'react';

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
    setPage: (page: number) => void
}

function ProcessedTableRow({data, setPage}: RowProps) {
    return <tr>
        <td>{data.content}</td>
        <td>{dataCategoryToIcon(data.type)}</td>
        <td className="text-center">{data.page}</td>
        <td className="text-end">
            <Button variant="link" className="link-icon-button" onClick={() => setPage(data.page + 1)}>
                <i className="fa-solid fa-magnifying-glass"></i>
            </Button>
            <Button variant="link" className="link-icon-button">
                <i className="fa-solid fa-pen"></i>
            </Button>
        </td>
    </tr>;
}


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
        <Table responsive hover size="sm">
            <thead>
            <tr>
                <th>Content</th>
                <th>Type</th>
                <th className="text-center">Page</th>
                <th></th>
                {/* <th>action</th> */}
            </tr>
            </thead>
            <tbody>
            {filtered_data.map(
                (data: RawDataPoint, idx: number) => 
                    <ProcessedTableRow data={data} key={data.id} setPage={setPage}/>
            )}
            </tbody>
        </Table>
    </div>
    </>
}