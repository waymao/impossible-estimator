import { ExtractResult, RawDataPoint } from "../datapoints"
import { Button } from 'react-bootstrap';

interface Props {
    filename: string,
    data: ExtractResult,
    setPage: (page: number) => void
}


export default function RawDataTable({filename, data, setPage}: Props) {
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
        {data && data.raw_data.map(
            (data: RawDataPoint, idx: number) => 
                <tr key={idx}>
                    <td>{data.content}</td>
                    <td className="me-1">{data.page + 1}</td>
                    <td className="me-1">{data.type}</td>
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
    </div>
    </>
}