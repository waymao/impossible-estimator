import React, { useEffect } from "react";
import { Button, FormLabel, Form } from "react-bootstrap"
import { 
    ProcessedDataPoint, 
    RawDataPoint, 
    newTransformedDataPoint, 
    UpdateDPResult,
    ProcessedDPUpdateReq
} from "../datapoints"

interface Props {
    processed_data?: ProcessedDataPoint,
    raw_data: RawDataPoint,
    file_id: number,
    candidate_data?: RawDataPoint,
    override: boolean,
    reportUpdate: (res: UpdateDPResult) => void,
    cancelUpdate: () => void
}


export default function EditPanel(props: Props) {
    const {
        processed_data, 
        raw_data, 
        candidate_data, 
        reportUpdate, 
        file_id, 
        override
    } = props;

    const [manual_data, setManualData] = React.useState("");
    useEffect(() => {
        if (processed_data !== undefined && processed_data.ref_num !== null) {
            setManualData(processed_data.stat);
        } else {
            setManualData("");
        }
    }, [processed_data]);

    const updateInfo = async () => {
        try {
            if (candidate_data && manual_data === "") {
                const new_data: ProcessedDPUpdateReq = {
                    filename: file_id,
                    page: raw_data.page,
                    content: raw_data.content,
                    coord: raw_data.coord,
                    stat: candidate_data.content,
                    stat_coord: candidate_data.coord,
                    ref_word: raw_data.id,
                    ref_num: candidate_data.id,
                    override: override
                }
                const res = await newTransformedDataPoint(new_data);
                if (reportUpdate) reportUpdate(res);
            } else {
                const new_data: ProcessedDPUpdateReq = {
                    filename: file_id,
                    page: raw_data.page,
                    content: raw_data.content,
                    coord: raw_data.coord,
                    stat: manual_data,
                    ref_word: raw_data.id,
                    ref_num: null,
                    stat_coord: [0, 0, 0, 0],
                    override: override
                };
                const res = await newTransformedDataPoint(new_data);
                if (reportUpdate) reportUpdate(res);
            }
        } catch (e: any) {
            console.log(e);
            alert("Submission failed");
            return;
        }
    }

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
            <Form.Control 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setManualData(e.target.value)}
                value={manual_data}>
            </Form.Control>
        </Form.Group>
        <Form.Group>
            <Button onClick={updateInfo} className="me-2">Update</Button>
            <Button variant="secondary" onClick={updateInfo}>Cancel</Button>
        </Form.Group>
    </div>
}
