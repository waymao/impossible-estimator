import { TransformResult, ProcessedDataPoint } from "../datapoints"
import { Button } from 'react-bootstrap';

interface Props {
    filename: string,
    data: TransformResult,
    setPage: (page: number) => void
}


export default function ProcessedTable({filename, data, setPage}: Props) {
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
        {data && data.processed_datas.map(
            (data: ProcessedDataPoint, idx: number) => 
                <tr key={idx}>
                    <td>Data: {data.stat}</td>
                    <td className="me-1">Page: {data.page}</td>
                    <td className="me-1">{data.content}</td>
                    <td className="me-1">
                        <Button variant="link" onClick={() => setPage(data.page)}>
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