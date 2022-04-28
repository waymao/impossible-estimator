import { Button, FormLabel, Form } from "react-bootstrap"
import { ProcessedDataPoint, RawDataPoint } from "../datapoints"

interface Props {
    processed_data?: ProcessedDataPoint,
    raw_data: RawDataPoint,
    candidate_data?: RawDataPoint
}


export default function EditPanel({processed_data, raw_data, candidate_data}: Props) {
    return <div>
        <p>You are editing: <b>{raw_data.content}</b></p>
        {candidate_data ?
            <p>Current Selected value is: <b>{candidate_data.content}</b></p> :
        processed_data ? 
            <p>Current Value is: <b>{processed_data.stat}</b></p> :
            <p>Currently, there's no data selected</p>
        }
        <p>Click on any number box to quickly change the number to that,
            Or you can also enter a custom number below:
        </p>
        <Form.Group className="mb-3">
            <FormLabel>
                Value
            </FormLabel>
            <Form.Control>
            </Form.Control>
        </Form.Group>
        <Form.Group>
            <Button>Update</Button>
        </Form.Group>
    </div>
}
